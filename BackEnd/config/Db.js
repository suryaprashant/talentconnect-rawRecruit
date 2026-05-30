import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DB_URL;

console.log(url);
const DB_NAME = process.env.DB_NAME;
console.log(DB_NAME);
const Connection = async () => {
    try {
        await mongoose.connect(url, { dbName: DB_NAME });
        console.log('connected successfully');
        return true;
    } catch (error) {
        console.log('failed to connect reason:', error);
        return false;
    }
}
export default Connection;