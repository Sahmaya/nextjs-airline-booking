/*
    API route to make a booking on a scheduled flight.
*/
import {ObjectId} from "mongodb";
import {connectDB} from "@/lib/mongodb";

export async function POST(request: Request) {
    const body = await request.json();
    const {scheduleId, firstName, lastName, email} = body;

    if (!scheduleId || !firstName || !lastName || !email) {
        return Response.json({error: "Missing required fields"}, {status: 400});
    }

    const db = await connectDB();

    const schedule = await db.collection("schedules").findOne({_id: new ObjectId(scheduleId)});

    if (!schedule) {
        return Response.json({error: "Flight not found"}, {status: 404});
    }

    if (schedule.bookings.length >= schedule.seats) {
        return Response.json({error: "Flight is full"}, {status: 400});
    }

    const ref = "DF" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const booking = {
        ref: ref,
        firstName: firstName,
        lastName: lastName,
        email: email,
        bookedAt: new Date(),
    };

    await db.collection("schedules").updateOne(
        {_id: new ObjectId(scheduleId)},
        {$push: {bookings: booking}}
    );

    await db.collection("passengers").updateOne(
        {email: email},
        {$set: {firstName: firstName, lastName: lastName, email: email},
         $push: {bookingRefs: ref}},
        {upsert: true}
    );

    return Response.json({
        ref: ref,
        firstName: firstName,
        lastName: lastName,
        email: email,
        flightNo: schedule.flightNo,
        orig: schedule.orig,
        dest: schedule.dest,
        depDate: schedule.depDate,
        arrDate: schedule.arrDate,
        aircraft: schedule.aircraft,
        price: schedule.price,
    }, {status: 201});
}
