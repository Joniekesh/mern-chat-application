import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URL);
		console.log(
			`MongoDB Connection success: ${conn.connection.host}`.yellow.bold
				.underline
		);
	} catch (error) {
		console.log(error);
	}
};
