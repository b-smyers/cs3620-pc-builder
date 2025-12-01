import { NotFound } from "./lib/api-response";
import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import apiRoutes from "./routes/api.route";

const app = express();
app.set("trust proxy", 1);
app.use(cors({credentials: true,}));
app.use(bodyParser.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 7 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// Routes
app.use("/api", apiRoutes);

// Serve custom 404
app.use("/api", (req: Request, res: Response) => {
  res.status(404).json(NotFound("Unknown endpoint"));
});

export default app;
