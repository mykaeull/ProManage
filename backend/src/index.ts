import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/project";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/user";
import { verifyToken } from "./middleware/auth";
import pool from "./db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).pool = pool;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/users", verifyToken, usersRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
