import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import rateLimit from "express-rate-limit";
import cors from "cors";
import logger from "./config/logger.js";
import morgan from "morgan";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import "dotenv/config";

const app = express();
const saltRounds = 10;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const morganFormat =
  process.env.NODE_ENV === "production"
    ? ':remote-addr :method :url :status :res[content-length] - :response-time ms ":user-agent"'
    : ':method :url :status :res[content-length] - :response-time ms ":user-agent"';

const taskRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each user to 10 request per minute
  message: "Too many requests, please try again later.",
});

const initApp = async () => {
  const db = await connectDB();

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(
      morgan(morganFormat, {
        stream: { write: (msg) => logger.info(msg.trim()) },
      })
    );
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(passport.initialize());

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [
          jwt_payload.id,
        ]);
        const user = result.rows[0];

        if (!user) return cb(null, false, { message: "User not found" });
        logger.info(`[auth] User ${jwt_payload.id} authenticated successfully`);
        return cb(null, user);
      } catch (err) {
        logger.error("Auth error:", err);
        return cb(err);
      }
    })
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "loginPassword" },
      async (email, password, cb) => {
        try {
          const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );

          if (result.rows.length === 0) {
            return cb(null, false, { message: "User not found" });
          }

          const user = result.rows[0];
          const storedHashedPassword = user.password_hash;

          const isMatch = await bcrypt.compare(password, storedHashedPassword);

          if (!isMatch) {
            return cb(null, false, { message: "Incorrect password" });
          }

          logger.info(`[auth] User ${user.id} authenticated successfully`);
          return cb(null, user);
        } catch (err) {
          logger.error(err);
          return cb(err);
        }
      }
    )
  );

  app.get(
    "/api/tasks",
    rateLimit,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const result = await db.query(
          `SELECT
          tasks.id AS task_id,
          tasks.title AS title,
          tasks.category AS category,
          task_entries.id AS entry_id,
          task_entries.time_spent_minutes AS duration,
          task_entries.created_at
        FROM
          tasks
        LEFT JOIN task_entries ON tasks.id = task_entries.task_id
        WHERE tasks.user_id = $1
        ORDER BY tasks.id, task_entries.created_at DESC`,
          [req.user.id]
        );

        logger.info(`User ${req.user.id} requested all tasks`);
        res.status(200).json(result.rows);
      } catch (err) {
        logger.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/api/tasks",
    rateLimit,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const { category, title, duration } = req.body;
      try {
        await db.query("BEGIN");
        const result = await db.query(
          "INSERT INTO tasks (user_id, title, category) VALUES ($1, $2, $3) RETURNING id",
          [req.user.id, title, category]
        );

        const { id: taskId } = result.rows[0];

        await db.query(
          "INSERT INTO task_entries (task_id, time_spent_minutes) VALUES ($1, $2)",
          [taskId, duration]
        );

        await db.query("COMMIT");

        logger.info(`User ${req.user.id} created task "${title}"`);
        res.status(200).send({ message: "Task added successfully!" });
      } catch (err) {
        await db.query("ROLLBACK");
        logger.error("Transaction failed:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post("/api/auth/register", rateLimit, async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.send("Email already exists. Try logging in");
      }
      // hash the password
      const hash = await bcrypt.hash(password, saltRounds);

      const result = await db.query(
        "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, hash, firstName, lastName]
      );

      const [user] = result.rows;
      const username = `${user.first_name} ${user.last_name}`;

      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      logger.info(`User ${user.id} registered}`);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username,
        },
        token,
      });
    } catch (err) {
      logger.error("Registration Error:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/api/auth/login", rateLimit, async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        logger.error("Auth error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });
      }

      const username = `${user.first_name} ${user.last_name}`;

      const payload = { id: user.id, email: user.email };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      logger.info(`User ${user.id} logged in`);
      res.status(200).json({
        message: "OK",
        user: {
          id: user.id,
          email: user.email,
          username,
        },
        token,
      });
    })(req, res, next);
  });

  app.put(
    "/api/tasks/:taskId/entries/:entryId",
    rateLimit,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const { taskId, entryId } = req.params;
      const { category, title, duration } = req.body;

      try {
        const result = await db.query(
          `
        SELECT tasks.id AS task_id,
          tasks.title AS title,
          tasks.category AS category,
          task_entries.id AS entry_id,
          task_entries.time_spent_minutes AS duration,
          task_entries.created_at 
        FROM
          tasks
        LEFT JOIN task_entries ON tasks.id = task_entries.task_id
        WHERE tasks.user_id = $1 AND tasks.id = $2 AND task_entries.id = $3
        ORDER BY tasks.id, task_entries.created_at DESC
        `,
          [req.user.id, taskId, entryId]
        );

        if (result.rowCount !== 1) {
          throw new Error("Expected exactly one matching task-entry pair.");
        }

        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ message: "Task not found or not authorized." });
        }

        const task = result.rows[0];

        const newCategory = category || task.category;
        const newTitle = title || task.title;
        const newDuration = duration || task.duration;

        const shouldUpdateTask =
          (newCategory !== undefined && newCategory !== task.category) ||
          (title !== undefined && title !== task.title);

        const shouldUpdateEntry =
          task.entry_id &&
          newDuration !== undefined &&
          newDuration !== null &&
          newDuration !== 0 &&
          newDuration !== task.duration;

        await db.query("BEGIN");

        if (shouldUpdateTask) {
          await db.query(
            `UPDATE tasks 
                      SET title = $1, category = $2
                      WHERE id = $3 AND (title IS DISTINCT FROM $1 OR
                      category IS DISTINCT FROM $2)`,
            [newTitle, newCategory, taskId]
          );
        }

        if (shouldUpdateEntry) {
          await db.query(
            `UPDATE task_entries
                      SET time_spent_minutes = $1
                      WHERE id = $2 AND (time_spent_minutes IS DISTINCT FROM $1)`,
            [newDuration, task.entry_id]
          );
        }

        await db.query("COMMIT");

        logger.info(`User ${req.user.id} Updated task ${newTitle}`);
        res.status(200).send({ message: "Task Updated Successfully!" });
      } catch (err) {
        logger.error(err);
        await db.query("ROLLBACK");
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.delete(
    "/api/tasks/:id",
    rateLimit,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const result = await db.query(
          "DELETE FROM tasks WHERE id = $1 RETURNING *",
          [req.params.id]
        );

        if (result.rows === 0) {
          return res.status(404).send({ message: "Task Not Found" });
        }

        const task = result.rows[0];

        logger.info(`User ${req.user.id} Deleted task ${task.title}`);
        res.status(200).send({
          status: "200 OK",
          message: "Task Deleted!",
        });
      } catch (err) {
        logger.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  return app;
};

export default initApp;
