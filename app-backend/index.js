import express from "express";

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json("Hello from the backend of the Time Tracking Dashboard App");
})

app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
