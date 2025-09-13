import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("API is Working Fine"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
