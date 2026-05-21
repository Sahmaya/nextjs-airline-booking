/*
    API route to search for scheduled flights between two airports within a specified date range
*/
import {ObjectId} from "mongodb";
import {connectDB} from "@/lib/mongodb";

interface EntryType {
    _id: ObjectId,
    flightNo: string,
    depDate: Date,
    arrDate: Date,
    seats_avail: boolean,
    price: number,
    aircraft: string,
}

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;

    const orig = params.get("orig");
    const dest = params.get("dest");
    const dt1 = new Date(params.get("date1") || "2026-06-01");
    const dt2 = new Date(params.get("date2") || "2026-06-30");

    const db = await connectDB();

    const origDoc = await db.collection("airports").findOne({code: orig});
    const destDoc = await db.collection("airports").findOne({code: dest});

    const schedules = await db.collection("schedules").find({
        orig: orig,
        dest: dest,
        depDate: {$gte: dt1, $lte: dt2}
    }).sort({depDate: 1}).toArray();

    const entries = [];
    for (const doc of schedules) {
        const avail = doc.bookings.length < doc.seats;
        const entry: EntryType = {
            _id: doc._id,
            flightNo: doc.flightNo,
            depDate: doc.depDate,
            arrDate: doc.arrDate,
            seats_avail: avail,
            price: doc.price,
            aircraft: doc.aircraft,
        };
        entries.push(entry);
    }

    return Response.json({
        orig: origDoc,
        dest: destDoc,
        entries: entries
    });
}