import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

//create express app and http server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/", (req, res) => {
  res.send("API working");
});

await connectDB()
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
