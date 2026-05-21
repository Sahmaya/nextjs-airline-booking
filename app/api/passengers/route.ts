/*
    API route to get all of a passengers booked flights
*/
import {connectDB} from "@/lib/mongodb";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const email = params.get("email");

    if (!email) {
        return Response.json({error: "Email required"}, {status: 400});
    }

    const db = await connectDB();

    const schedules = await db.collection("schedules").find(
        {"bookings.email": {$regex: new RegExp(`^${email}$`, "i")}}
    ).sort({depDate: 1}).toArray();

    const results = [];
    for (const s of schedules) {
        const booking = s.bookings.find((b: {email: string}) => b.email === email);
        if (booking) {
            results.push({
                ref: booking.ref,
                firstName: booking.firstName,
                lastName: booking.lastName,
                flightNo: s.flightNo,
                orig: s.orig,
                dest: s.dest,
                depDate: s.depDate,
                arrDate: s.arrDate,
                aircraft: s.aircraft,
                price: s.price,
            });
        }
    }

    return Response.json({email: email, bookings: results});
}