import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		console.log(reqBody);
		const { name, email, password } = reqBody;

		const existedUser = await prisma.user.findFirst({
			where:{email: email}
		})
		if (existedUser)
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);

		const hashedPassword = await bcryptjs.hash(password, 10);

		const user = await prisma.user.create({
			data:{
				name: name,
				email: email,
				password: hashedPassword
			}
		});

		return NextResponse.json(
			{
				message: "User registered successfully",
				success: true,
				user,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}
