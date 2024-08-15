import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

import routers from "./routers";

const app = express();
const PORT = parseInt(process.env.PORT as string);
const upload = multer();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/public")))
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routers())

app.listen(PORT, () => {
  console.log("Server running in " + PORT);
});
