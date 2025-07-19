import pg from pg;
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

        db.connect();
    } catch (err) {
       console.log(err);
       throw new Error('Cannot connect with database\n' + error.stack);
    }
};

export default connectDB;