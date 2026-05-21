/*
    Page for searching flights
*/
"use client";
import {ChangeEvent, useEffect, useState} from "react";
import Link from "next/link";

interface FlightEntry {
    _id: string,
    flightNo: string,
    depDate: string,
    arrDate: string,
    seats_avail: boolean,
    price: number,
    aircraft: string,
}

interface AirportDoc {
    name: string,
    code: string,
    tz: string,
}

interface SearchData {
    orig: AirportDoc,
    dest: AirportDoc,
    entries: FlightEntry[]
}

interface InvoiceData {
    ref: string,
    firstName: string,
    lastName: string,
    email: string,
    flightNo: string,
    orig: string,
    dest: string,
    depDate: string,
    arrDate: string,
    aircraft: string,
    price: number,
}

interface DropdownProps {
    label: string,
    items: string[],
    value: string,
    onChange: (value: string) => void,
}

const DropdownMenu = (props: DropdownProps) => (
    <div style={{flex: 1}}>
        <label><b>{props.label}</b></label><br/>
        <select
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            style={{width: "100%", padding: "6px", border: "1px solid black"}}>
            <option value="">-- Select --</option>
            {props.items.map((item) => (<option key={item}>{item}</option>))}
        </select>
    </div>
)

interface DateProps {
    label: string,
    name: string,
    onChange: (value: string) => void,
}

const DateInput = (props: DateProps) => (
    <div style={{flex: 1}}>
        <label><b>{props.label}</b></label><br/>
        <input type="date" name={props.name}
            onChange={(e) => props.onChange(e.target.value)}
            style={{width: "100%", padding: "6px", border: "1px solid black"}}
        />
    </div>
)

interface InputProps {
    label: string,
    name: string,
    value: string,
    onChange: (name: string, value: string) => void,
}

const TextInput = ({label, name, value, onChange}: InputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    }
    return (
        <div>
            <label>
                {label}<br/>
                <input type="text" name={name} value={value} onChange={handleChange}
                    style={{border: "1px solid black", padding: "4px", width: "100%"}}/>
            </label>
        </div>
    )
}

interface FlightOptionProps {
    entry: FlightEntry,
    tz: string,
    index: number,
    onChange: (value: string) => void,
}

const FlightOption = ({entry, tz, index, onChange}: FlightOptionProps) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    const seatsMsg = entry.seats_avail ? "Available" : "Unavailable";
    const rowBg = index % 2 === 0 ? "white" : "#f3f4f6";

    const depDate = new Intl.DateTimeFormat("en-NZ", {
        dateStyle: "full",
        timeZone: tz,
    }).format(new Date(entry.depDate));

    const depTime = new Intl.DateTimeFormat("en-NZ", {
        timeStyle: "short",
        timeZone: tz,
    }).format(new Date(entry.depDate));

    return (
        <tr style={{backgroundColor: rowBg}}>
            <td style={{padding: "8px", border: "1px solid black"}}>
                <input
                    type="radio"
                    name="flightchoice"
                    value={entry._id}
                    disabled={!entry.seats_avail}
                    onChange={handleChange}
                />
            </td>
            <td style={{padding: "8px", border: "1px solid black"}}>{entry.flightNo}</td>
            <td style={{padding: "8px", border: "1px solid black"}}>{depDate}</td>
            <td style={{padding: "8px", border: "1px solid black"}}>{depTime}</td>
            <td style={{padding: "8px", border: "1px solid black"}}>{entry.aircraft}</td>
            <td style={{padding: "8px", border: "1px solid black"}}>${entry.price}</td>
            <td style={{padding: "8px", border: "1px solid black"}}>{seatsMsg}</td>
        </tr>
    )
}

export default function SearchPage() {

    const airports = [
        "NZNE - Dairy Flat Airport",
        "YSSY - Sydney Airport",
        "NZRO - Rotorua Airport",
        "NZGB - Claris Airport (Great Barrier Island)",
        "NZCI - Tuuta Airport (Chatham Islands)",
        "NZTL - Lake Tekapo Aerodrome",
    ];

    const [orig, setOrig] = useState("");
    const [dest, setDest] = useState("");
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [data, setData] = useState<SearchData | null>(null);
    const [flight, setFlight] = useState("");
    const [searched, setSearched] = useState(false);

    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [error, setError] = useState("");

    const handlePassengerChange = (name: string, value: string) => {
        setPassenger(prev => ({...prev, [name]: value}));
    }

    useEffect(() => {
        if (!searched) return;
        const origCode = orig.split(" - ")[0];
        const destCode = dest.split(" - ")[0];
        const uri = `/api/schedules/search?orig=${origCode}&dest=${destCode}&date1=${date1}&date2=${date2}`;
        console.log("Fetching:", uri);
        fetch(uri)
            .then(res => res.json())
            .then(d => setData(d));
    }, [searched]);

    const handleSearch = () => {
        if (!orig) {
            setError("Please select a departure airport.");
            return;
        }
        if (!dest) {
            setError("Please select an arrival airport.");
            return;
        }
        if (!date1) {
            setError("Please select an earliest departure date.");
            return;
        }
        if (!date2) {
            setError("Please select a latest departure date.");
            return;
        }
        if (orig === dest) {
            setError("Departure and arrival airports cannot be the same.");
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(date1) < today) {
            setError("Earliest departure date cannot be in the past.");
            return;
        }
        if (new Date(date2) < new Date(date1)) {
            setError("Latest departure date cannot be earlier than earliest departure date.");
            return;
        }
        setFlight("");
        setData(null);
        setInvoice(null);
        setError("");
        setSearched(false);
        setTimeout(() => setSearched(true), 10);
    }

    const handleBook = () => {
        if (!flight || !passenger.firstName || !passenger.lastName || !passenger.email) {
            setError("Please select a flight and fill in all your details.");
            return;
        }
        if (!passenger.email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(passenger.firstName)) {
            setError("First name can only contain letters.");
            return;
        }
        if (!nameRegex.test(passenger.lastName)) {
            setError("Last name can only contain letters.");
            return;
        }
        setError("");
        fetch("/api/bookings", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                scheduleId: flight,
                firstName: passenger.firstName,
                lastName: passenger.lastName,
                email: passenger.email,
            })
        })
        .then(res => res.json())
        .then(d => {
            if (d.error) {
                setError(d.error);
            } else {
                setInvoice(d);
            }
        });
    }

    return (
        <div className="min-h-screen bg-pink-200">
            <main className="p-5 bg-black text-white">
                <h1 className="text-2xl tracking-widest uppercase"
                    style={{WebkitTextStroke: "1px white", color: "black"}}>
                    DAIRY FLAT AIRWAYS
                </h1>
            </main>

            <div className="p-5">
                <div style={{marginBottom: "12px"}}>
                    <Link href="/" className="text-black font-bold">← Back to Home</Link>
                </div>

                <div className="bg-white p-6 mb-4 rounded">
                    <div className="p-3 mb-4 rounded font-bold text-white"
                        style={{backgroundColor: "black"}}>
                        Search available flights below:
                    </div>

                    <div style={{display: "flex", gap: "24px", marginBottom: "16px"}}>
                        <DropdownMenu label="Departure Airport" items={airports} value={orig} onChange={setOrig} />
                        <DropdownMenu label="Arrival Airport" items={airports} value={dest} onChange={setDest} />
                    </div>

                    <p className="mb-2">Find available flights between the dates below:</p>

                    <div style={{display: "flex", gap: "24px", marginBottom: "16px"}}>
                        <DateInput label="Earliest departure date" name="date1" onChange={setDate1} />
                        <DateInput label="Latest departure date" name="date2" onChange={setDate2} />
                    </div>

                    {error && !flight && <p className="text-red-600 mb-2">{error}</p>}
                    <button onClick={handleSearch} className="p-2 text-white rounded font-bold"
                        style={{backgroundColor: "#4b5563"}}>
                        SEARCH FLIGHTS
                    </button>
                </div>

                {data && !invoice && (
                    <div className="bg-white p-4 mb-4 rounded">
                        <div className="p-3 mb-4 rounded font-bold text-white"
                            style={{backgroundColor: "black"}}>
                            Available Flights
                        </div>
                        <p><b>Departure Airport:</b> {data.orig?.name} &rarr; <b>Arrival Airport:</b> {data.dest?.name}</p>
                        <br/>
                        {data.entries.length === 0 && <p>No flights found for this route and date range.</p>}
                        {data.entries.length > 0 && (
                            <>
                                <p className="font-bold mb-2">Select your flight below:</p>
                                <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid black"}}>
                                    <thead>
                                        <tr style={{backgroundColor: "black", color: "white"}}>
                                            <th style={{padding: "8px", border: "1px solid black"}}></th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Flight</th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Date</th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Time</th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Aircraft</th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Price</th>
                                            <th style={{padding: "8px", border: "1px solid black", textAlign: "left"}}>Seat Availability</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.entries.map((item: FlightEntry, index: number) => (
                                            <FlightOption
                                                key={item._id}
                                                entry={item}
                                                tz={data.orig?.tz || "Pacific/Auckland"}
                                                index={index}
                                                onChange={setFlight}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                )}

                {flight && !invoice && (
                    <div className="bg-white p-4 mb-4 rounded">
                        <div className="p-3 mb-4 rounded font-bold text-white"
                            style={{backgroundColor: "black"}}>
                            Your Details
                        </div>
                        <TextInput label="First name" name="firstName" value={passenger.firstName} onChange={handlePassengerChange} />
                        <br/>
                        <TextInput label="Last name" name="lastName" value={passenger.lastName} onChange={handlePassengerChange} />
                        <br/>
                        <TextInput label="Email" name="email" value={passenger.email} onChange={handlePassengerChange} />
                        <br/><br/>
                        {error && <p className="text-red-600 mb-2">{error}</p>}
                        <button onClick={handleBook} className="p-2 text-white rounded font-bold"
                            style={{backgroundColor: "#4b5563"}}>
                            CONFIRM BOOKING
                        </button>
                    </div>
                )}

                {invoice && (
                    <div className="bg-white p-4 mb-4 rounded">
                        <div className="p-3 mb-4 rounded font-bold text-white"
                            style={{backgroundColor: "black"}}>
                            Booking Confirmed
                        </div>
                        <p><b>Booking reference:</b> {invoice.ref}</p>
                        <p><b>Passenger:</b> {invoice.firstName} {invoice.lastName}</p>
                        <p><b>Email:</b> {invoice.email}</p>
                        <br/>
                        <p><b>Flight:</b> {invoice.flightNo}</p>
                        <p><b>Route:</b> {invoice.orig} to {invoice.dest}</p>
                        <p><b>Aircraft:</b> {invoice.aircraft}</p>
                        <p><b>Departure:</b> {new Date(invoice.depDate).toLocaleString("en-NZ", {timeZone: "Pacific/Auckland"})}</p>
                        <p><b>Arrival:</b> {new Date(invoice.arrDate).toLocaleString("en-NZ", {timeZone: "Pacific/Auckland"})}</p>
                        <p><b>Price:</b> ${invoice.price}</p>
                        <br/>
                        <div style={{display: "flex", gap: "12px"}}>
                            <button onClick={() => {setInvoice(null); setFlight(""); setData(null); setSearched(false);}}
                                className="p-2 text-white rounded font-bold"
                                style={{backgroundColor: "#4b5563"}}>
                                BOOK ANOTHER FLIGHT
                            </button>
                            <Link href="/mybookings" className="p-2 text-white rounded font-bold"
                                style={{backgroundColor: "#4b5563"}}>
                                VIEW MY BOOKINGS
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}