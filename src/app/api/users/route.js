import connectDB from "@/db/connectDB";
import User from "@/model/User";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // connect to the database
        await connectDB();
        // get all users from the database
        const users = await User.find();
        //return users as a JSON response with status code 200

        return new NextResponse(JSON.stringify(users), {status: 200});
} catch (error) {
        //return error as a JSON response with status code 500
        return new NextResponse(JSON.stringify(error), {status: 500});
}
    };

    