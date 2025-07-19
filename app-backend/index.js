import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import "dotenv/config";

const app = express();
const PORT = 3000;
const saltRounds = 10;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const db = await connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
      return cb(null, user);
    } catch (err) {
      console.error("Auth error:", err);
      return cb(err);
    }
  })
);

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "loginPassword" },
    async (email, password, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);

        if (result.rows.length === 0) {
          return cb(null, false, { message: "User not found" });
        }

        const user = result.rows[0];
        const storedHashedPassword = user.password_hash;

        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
          return cb(null, false, { message: "Incorrect password" });
        }

        return cb(null, user);
      } catch (err) {
        console.error(err);
        return cb(err);
      }
    }
  )
);

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json("Hello from the backend of the Time Tracking Dashboard App");
});

app.get(
  "/api",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Hello from backend!" });
  }
);

app.get(
  "/api/auth/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Logout of application",
      user: req.user,
    });
  }
);

app.get(
  "/api/tasks",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Get all task",
    });
  }
);

app.put(
  "/api/tasks/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Update a task",
    });
  }
);

app.post(
  "/api/tasks",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Create a task",
    });
  }
);

app.post("/api/auth/register", async (req, res) => {
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
    console.error("Registration Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!user) {
      return res.status(401).json({ message: info?.message || "Login failed" });
    }

    const username = `${user.first_name} ${user.last_name}`;

    const payload = { id: user.id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

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

app.delete(
  "/api/tasks/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      message: "Deleting a task",
    });
  }
);

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
