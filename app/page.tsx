/*
    Creating the landing page for the Dairy Flat Airways booking app.
*/
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-pink-200">
            <main className="p-5 bg-black text-white">
                <h1 className="text-2xl tracking-widest uppercase"
                    style={{WebkitTextStroke: "1px white", color: "black"}}>
                    DAIRY FLAT AIRWAYS
                </h1>
            </main>

            <div className="p-6">
                <h2 className="text-xl mb-6 text-black font-bold">Welcome to Dairy Flat Airways!</h2>

                <div style={{display: "flex", gap: "12px", marginBottom: "32px"}}>
                    <Link href="/search" className="p-4 text-white text-center rounded font-bold"
                        style={{backgroundColor: "#4b5563"}}>
                        SEARCH FLIGHTS
                    </Link>
                    <Link href="/mybookings" className="p-4 text-white text-center rounded font-bold"
                        style={{backgroundColor: "#4b5563"}}>
                        VIEW MY BOOKINGS
                    </Link>
                </div>

                <div style={{width: "100%"}}>
                    <p className="font-bold text-black mb-2">Daily Services</p>
                    <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid black", marginBottom: "24px"}}>
                        <thead>
                            <tr style={{backgroundColor: "black", color: "white"}}>
                                <th style={{padding: "10px 16px", border: "1px solid black", textAlign: "left"}}>Route</th>
                                <th style={{padding: "10px 16px", border: "1px solid black", textAlign: "left"}}>Days</th>
                                <th style={{padding: "10px 16px", border: "1px solid black", textAlign: "left"}}>Times</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{backgroundColor: "white"}}>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Dairy Flat &nbsp; ↔ &nbsp; Rotorua</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Monday to Friday</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>7:00 am &amp; 4:00 pm</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="font-bold text-black mb-2">Weekly Services</p>
                    <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid black"}}>
                        <thead>
                            <tr style={{backgroundColor: "black", color: "white"}}>
                                <th style={{padding: "10px 16px", border: "1px solid black", textAlign: "left"}}>Route</th>
                                <th style={{padding: "10px 16px", border: "1px solid black", textAlign: "left"}}>Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{backgroundColor: "white"}}>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Dairy Flat &nbsp; ↔ &nbsp; Sydney</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Friday</td>
                            </tr>
                            <tr style={{backgroundColor: "#f3f4f6"}}>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Dairy Flat &nbsp; ↔ &nbsp; Lake Tekapo</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Monday</td>
                            </tr>
                            <tr style={{backgroundColor: "white"}}>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Dairy Flat &nbsp; ↔ &nbsp; Great Barrier Island</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Monday, Wednesday, Friday</td>
                            </tr>
                            <tr style={{backgroundColor: "#f3f4f6"}}>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Dairy Flat &nbsp; ↔ &nbsp; Chatham Islands</td>
                                <td style={{padding: "10px 16px", border: "1px solid black"}}>Tuesday, Friday</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}