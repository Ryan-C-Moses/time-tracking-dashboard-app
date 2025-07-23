import connectDB from "../config/db.js";
import fs from "fs";
import path from "path";
import logger from "../config/logger.js";

const createTestData = async () => {
  let db = null;
  try {
    logger.info("Reading SQL Files...");
    const sqlQueries = readSQLFiles();
    logger.info("Completed Reading SQL Files");

    logger.verbose("Test DB Started !");
    db = await connectDB();

    await handleDBQueries(db, sqlQueries);
    logger.info("Task Completed");
  } catch (err) {
    logger.error(err);
    throw new Error("Script error");
  } finally {
    if (db) {
      await db.query("ROLLBACK");
      await db.end();
      logger.verbose("Database connection closed");
    }
  }
};

const readSQLFiles = () => {

  const createTableSQL = fs.readFileSync(
    "./queries/create_tables.sql",
    "utf8"
  );
  const insertUsersSQL = fs.readFileSync("./queries/insert_users.sql", "utf8");
  const insertTaskAndEntries = fs.readFileSync(
    "./queries/seed_task_and_entries.sql",
    "utf8"
  );

  return [createTableSQL, insertUsersSQL, insertTaskAndEntries];
};

const handleDBQueries = async (db, [sql1, sql2, sql3]) => {
  await db.query("BEGIN");

  logger.info("Create Tables...");
  await db.query(sql1);

  logger.info("Insert Users...");
  await db.query(sql2);

  logger.info("Insert Task and Entries");
  await db.query(sql3);

  await db.query("COMMIT");
};

await createTestData();
