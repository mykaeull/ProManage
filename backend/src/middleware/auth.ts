import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET as string,
        (err: unknown, decoded: any) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Failed to authenticate token" });

            req.userId = decoded?.userId;
            next();
        }
    );
};
