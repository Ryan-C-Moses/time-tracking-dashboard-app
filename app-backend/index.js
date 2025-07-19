import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import "dotenv/config";

const app = express();
const PORT = 3000;
const saltRounds = 10;

const db = await connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.get("/", (req, res) => {
  res.json("Hello from the backend of the Time Tracking Dashboard App");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.get("/api/auth/logout", (req, res) => {
  res.send({
    message: "Logout of application",
  });
});

app.get("/api/tasks", (req, res) => {
  res.send({
    message: "Get all task",
  });
});

app.put("/api/tasks/:id", (req, res) => {
  res.send({
    message: "Update a task",
  });
});

app.post("/api/tasks", (req, res) => {
  res.send({
    message: "Create a task",
  });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.send("Email already exists. Try logging in");
    }
    // hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hash, firstName, lastName]
    );

    console.log(result.rows);
    const [user] = result.rows;
    const username = `${user.first_name} ${user.last_name}`;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username,
      },
      // token: generateJwtToken(newUser),
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, loginPassword } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result.rows[0];
    const storedHashedPassword = user.password_hash;

    const isMatch = await bcrypt.compare(loginPassword, storedHashedPassword);

    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    if (result) {
      const username = `${user.first_name} ${user.last_name}`;

      res.status(200).json({
        message: "OK",
        user: {
          id: user.id,
          email: user.email,
          username,
        },
        // token: generateJwtToken(newUser),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  res.send({
    message: "Deleting a task",
  });
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
