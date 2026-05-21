/*
    API route to cancel a booking by reference
*/

import {connectDB} from "@/lib/mongodb";

export async function DELETE(request: Request) {
    const params = new URL(request.url).searchParams;
    const ref = params.get("ref");

    if (!ref) {
        return Response.json({error: "Booking reference required"}, {status: 400});
    }

    const db = await connectDB();

    const result = await (db.collection("schedules") as any).updateOne(
        {"bookings.ref": ref},
        {$pull: {bookings: {ref: ref}}}
    );

    if (result.matchedCount === 0) {
        return Response.json({error: "Booking not found"}, {status: 404});
    }

    await (db.collection("passengers") as any).updateOne(
        {bookingRefs: ref},
        {$pull: {bookingRefs: ref}}
    );

    return Response.json({message: "Booking cancelled", ref: ref});
}