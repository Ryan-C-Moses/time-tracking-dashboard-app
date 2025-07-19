import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db";


const app = express();
const PORT = 3000;
const saltRounds = 10;

connectDB();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
  res.json("Hello from the backend of the Time Tracking Dashboard App");
})

app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
