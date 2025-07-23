import connectDB from "../config/db";
import fs from "fs";
import logger from "../config/logger";

const createFakeTestData = async () => {
  try {
    logger.info("Reading SQL Files...");

    const createTableSQL = fs.readFileSync(
      "../queries/create_tables.sql",
      "utf8"
    );
    const insertUsersSQL = fs.readFileSync(
      "../queries/insert_users.sql",
      "utf8"
    );
    const insertTaskAndEntries = fs.readFileSync(
      "../queries/seed_task_and_entries.sql",
      "utf8"
    );

    logger.info("Completed Reading SQL Files");

    logger.verbose("Test DB Started !");
    const db = await connectDB();

    logger.info("Create Tables...");
    await db.query(createTableSQL);

    logger.info("Insert Users...");
    await db.query(insertUsersSQL);

    logger.info("Insert Task and Entries");
    await db.query(insertTaskAndEntries);

    logger.info("Task Completed");
  } catch (err) {
    logger.error(err);
    throw new Error("Script error");
  } finally {
    if (db) {
      await db.end();
      logger.verbose("Database connection closed");
    }
  }
};

createFakeTestData();
