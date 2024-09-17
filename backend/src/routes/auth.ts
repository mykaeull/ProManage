import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req: any, res: Response) => {
    const pool = req.pool;

    const { username, password } = req.body;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        const user = await User.findByUsername(pool, username);

        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );
        res.status(201).json({ token, id: user.id, role: user.role });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.post("/register", async (req: any, res: Response) => {
    const pool = req.pool;
    const { username, password, email, role } = req.body;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        const user = new User(username, password, email, role);
        const userId = await User.save(pool, user);

        const token = jwt.sign(
            { userId: username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );

        res.status(201).json({
            id: userId,
            name: username,
            email,
            role,
            token,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message === "Username already exists") {
                res.status(409).json({ error: "Username already exists" });
            } else {
                res.status(400).json({ error: err.message });
            }
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

export default router;
