/*
    My Bookings page to look up all bookings for a passenger
*/
"use client";
import {useState} from "react";
import Link from "next/link";

interface BookingType {
    ref: string,
    firstName: string,
    lastName: string,
    flightNo: string,
    orig: string,
    dest: string,
    depDate: string,
    arrDate: string,
    aircraft: string,
    price: number,
}

export default function MyBookingsPage() {

    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [searched, setSearched] = useState(false);
    const [cancelMsg, setCancelMsg] = useState("");
    const [error, setError] = useState("");

    const handleSearch = () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        setCancelMsg("");
        console.log("Looking up bookings for:", email);
        fetch(`/api/passengers?email=${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(data => {
                setBookings(data.bookings || []);
                setSearched(true);
            });
    }

    const handleCancel = (ref: string) => {
        const confirmed = window.confirm(`Cancel booking ${ref}?`);
        if (!confirmed) return;

        fetch(`/api/bookings/cancel?ref=${ref}`, {method: "DELETE"})
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setCancelMsg(`Booking ${ref} has been cancelled.`);
                    setBookings(prev => prev.filter(b => b.ref !== ref));
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

                <div className="bg-white p-4 mb-4 rounded">
                    <div className="p-3 mb-4 rounded font-bold text-white"
                        style={{backgroundColor: "black"}}>
                        Search your current bookings by entering your email address below ↓
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <label><b>Email address:</b></label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{border: "2px solid black", padding: "4px", flex: 1}}
                        />
                    </div>
                    <br/>
                    {error && <p className="text-red-600 mb-2">{error}</p>}
                    <button onClick={handleSearch} className="p-2 text-white rounded font-bold"
                        style={{backgroundColor: "#4b5563"}}>
                        FIND BOOKINGS
                    </button>
                </div>

                {cancelMsg && <p className="bg-white p-3 mb-3 rounded">{cancelMsg}</p>}

                {searched && bookings.length === 0 && (
                    <p className="bg-white p-4 rounded">No bookings found for {email}.</p>
                )}

                {bookings.map((b) => (
                    <div key={b.ref} className="bg-white p-4 mb-3 rounded">
                        <div className="p-3 mb-3 rounded font-bold text-white"
                            style={{backgroundColor: "black"}}>
                            Booking Reference: {b.ref}
                        </div>
                        <p><b>Flight:</b> {b.flightNo}</p>
                        <p><b>Route:</b> {b.orig} to {b.dest}</p>
                        <p><b>Aircraft:</b> {b.aircraft}</p>
                        <p><b>Departure:</b> {new Date(b.depDate).toLocaleString("en-NZ", {timeZone: "Pacific/Auckland"})}</p>
                        <p><b>Arrival:</b> {new Date(b.arrDate).toLocaleString("en-NZ", {timeZone: "Pacific/Auckland"})}</p>
                        <p><b>Price:</b> ${b.price}</p>
                        <br/>
                        <div style={{display: "flex", gap: "12px"}}>
                            <button onClick={() => handleCancel(b.ref)} className="p-2 text-white rounded font-bold"
                                style={{backgroundColor: "#4b5563"}}>
                                CANCEL BOOKING
                            </button>
                            <Link href="/search" className="p-2 text-white rounded font-bold"
                                style={{backgroundColor: "#4b5563"}}>
                                SEARCH FLIGHTS
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}