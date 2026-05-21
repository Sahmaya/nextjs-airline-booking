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

    const result = await db.collection("schedules").updateOne(
        {"bookings.ref": ref},
        {$pull: {bookings: {ref: ref}}} as any
    );

    if (result.matchedCount === 0) {
        return Response.json({error: "Booking not found"}, {status: 404});
    }

    await db.collection("passengers").updateOne(
        {bookingRefs: ref},
        {$pull: {bookingRefs: ref}}
    );

    return Response.json({message: "Booking cancelled", ref: ref});
}
