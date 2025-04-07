import connectDB from "@/db/connectDB";
import Product from "@/model/Product";

import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // connect to the database
        await connectDB();
        // get all users from the database
        const products = await Product.find();
        //return users as a JSON response with status code 200

        return new NextResponse(JSON.stringify(products), {status: 200});
} catch (error) {
        //return error as a JSON response with status code 500
        return new NextResponse(JSON.stringify(error), {status: 500});
}
    };