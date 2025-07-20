import pg from "pg";
import logger from "./logger.js";
import "dotenv/config"

const connectDB = async () => {
    try {
        const db = new pg.Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        await db.connect();

        logger.info("Database connection established")
        return db;
    } catch (err) {
       console.error(err);
       throw new Error('Cannot connect with database\n' + error.stack);
    }
};

export default connectDB;