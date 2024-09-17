import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

const router = express.Router();

router.get("/", async (req: any, res: Response) => {
    const pool = req.pool;
    const filters = req.query;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        let users;

        if (Object.keys(filters).length === 0) {
            users = await User.findAll(pool);
        } else {
            users = await User.findAllFiltered(
                pool,
                Number(filters.page),
                Number(filters.pageSize)
            );
        }

        res.status(200).json(users);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

export default router;
