/*
    Seed route to populate the database with airports and flight schedules.
    Run once by visiting /api/seed in the browser.
*/
import {connectDB} from "@/lib/mongodb";

const airports = [
    {code: "NZNE", name: "Dairy Flat Airport", region: "Auckland, New Zealand", tz: "Pacific/Auckland"},
    {code: "YSSY", name: "Sydney Airport", region: "Sydney, Australia", tz: "Australia/Sydney"},
    {code: "NZRO", name: "Rotorua Airport", region: "Rotorua, New Zealand", tz: "Pacific/Auckland"},
    {code: "NZGB", name: "Claris Airport", region: "Great Barrier Island, New Zealand", tz: "Pacific/Auckland"},
    {code: "NZCI", name: "Tuuta Airport", region: "Chatham Islands, New Zealand", tz: "Pacific/Chatham"},
    {code: "NZTL", name: "Lake Tekapo Aerodrome", region: "Lake Tekapo, New Zealand", tz: "Pacific/Auckland"},
];

const prices: Record<string, number> = {
    "NZNE-YSSY": 450, "YSSY-NZNE": 450,
    "NZNE-NZRO": 120, "NZRO-NZNE": 120,
    "NZNE-NZGB": 95,  "NZGB-NZNE": 95,
    "NZNE-NZCI": 280, "NZCI-NZNE": 280,
    "NZNE-NZTL": 220, "NZTL-NZNE": 220,
};

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function makeDate(base: Date, hour: number, minute: number): Date {
    const d = new Date(base);
    d.setUTCHours(hour, minute, 0, 0);
    return d;
}

function generateSchedules() {
    const schedules = [];
    const startDate = new Date("2026-06-01T00:00:00.000Z");

    for (let week = 0; week < 8; week++) {
        const monday    = addDays(startDate, week * 7 + 0);
        const tuesday   = addDays(startDate, week * 7 + 1);
        const wednesday = addDays(startDate, week * 7 + 2);
        const thursday  = addDays(startDate, week * 7 + 3);
        const friday    = addDays(startDate, week * 7 + 4);
        const saturday  = addDays(startDate, week * 7 + 5);
        const sunday    = addDays(startDate, week * 7 + 6);

        // Sydney weekly
        schedules.push({flightNo:"DF101", orig:"NZNE", dest:"YSSY", depDate:makeDate(friday,22,0),   arrDate:makeDate(saturday,3,0),  seats:6, aircraft:"SyberJet SJ30i",  price:prices["NZNE-YSSY"], bookings:[]});
        schedules.push({flightNo:"DF102", orig:"YSSY", dest:"NZNE", depDate:makeDate(sunday,4,0),    arrDate:makeDate(sunday,7,0),    seats:6, aircraft:"SyberJet SJ30i",  price:prices["YSSY-NZNE"], bookings:[]});

        // Rotorua twice daily Mon-Fri
        for (const day of [monday, tuesday, wednesday, thursday, friday]) {
            schedules.push({flightNo:"DF201", orig:"NZNE", dest:"NZRO", depDate:makeDate(day,19,0),  arrDate:makeDate(day,19,45), seats:4, aircraft:"Cirrus SF50", price:prices["NZNE-NZRO"], bookings:[]});
            schedules.push({flightNo:"DF202", orig:"NZRO", dest:"NZNE", depDate:makeDate(day,20,30), arrDate:makeDate(day,21,15), seats:4, aircraft:"Cirrus SF50", price:prices["NZRO-NZNE"], bookings:[]});
            schedules.push({flightNo:"DF203", orig:"NZNE", dest:"NZRO", depDate:makeDate(day,4,0),   arrDate:makeDate(day,4,45),  seats:4, aircraft:"Cirrus SF50", price:prices["NZNE-NZRO"], bookings:[]});
            schedules.push({flightNo:"DF204", orig:"NZRO", dest:"NZNE", depDate:makeDate(day,5,30),  arrDate:makeDate(day,6,15),  seats:4, aircraft:"Cirrus SF50", price:prices["NZRO-NZNE"], bookings:[]});
        }

        // Great Barrier Island
        for (const day of [monday, wednesday, friday]) {
            schedules.push({flightNo:"DF301", orig:"NZNE", dest:"NZGB", depDate:makeDate(day,21,0), arrDate:makeDate(day,21,45), seats:4, aircraft:"Cirrus SF50", price:prices["NZNE-NZGB"], bookings:[]});
        }
        for (const day of [tuesday, thursday, saturday]) {
            schedules.push({flightNo:"DF302", orig:"NZGB", dest:"NZNE", depDate:makeDate(day,21,0), arrDate:makeDate(day,21,45), seats:4, aircraft:"Cirrus SF50", price:prices["NZGB-NZNE"], bookings:[]});
        }

        // Chatham Islands
        for (const day of [tuesday, friday]) {
            schedules.push({flightNo:"DF401", orig:"NZNE", dest:"NZCI", depDate:makeDate(day,20,0),  arrDate:makeDate(day,22,45), seats:5, aircraft:"HondaJet Elite", price:prices["NZNE-NZCI"], bookings:[]});
        }
        for (const day of [wednesday, saturday]) {
            schedules.push({flightNo:"DF402", orig:"NZCI", dest:"NZNE", depDate:makeDate(day,0,15),  arrDate:makeDate(day,3,0),   seats:5, aircraft:"HondaJet Elite", price:prices["NZCI-NZNE"], bookings:[]});
        }

        // Lake Tekapo
        schedules.push({flightNo:"DF501", orig:"NZNE", dest:"NZTL", depDate:makeDate(monday,20,0),  arrDate:makeDate(monday,21,30),   seats:5, aircraft:"HondaJet Elite", price:prices["NZNE-NZTL"], bookings:[]});
        schedules.push({flightNo:"DF502", orig:"NZTL", dest:"NZNE", depDate:makeDate(tuesday,23,0), arrDate:makeDate(wednesday,0,30), seats:5, aircraft:"HondaJet Elite", price:prices["NZTL-NZNE"], bookings:[]});
    }

    return schedules;
}

export async function GET() {
    const db = await connectDB();

    await db.collection("airports").deleteMany({});
    await db.collection("schedules").deleteMany({});

    await db.collection("airports").insertMany(airports);
    const schedules = generateSchedules();
    await db.collection("schedules").insertMany(schedules);

    return Response.json({
        message: "Seed complete",
        airports: airports.length,
        schedules: schedules.length
    });
}