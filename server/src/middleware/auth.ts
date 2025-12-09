import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    user: {
        id: number;
        username: string;
    }
}

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload["user"];
    }
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers["authtoken"] as string;

        if (!token) {
            return res.status(401).send("No Token!");
        }

        const decoded = jwt.verify(token, "jwtsecret") as JwtPayload;

        req.user = decoded.user;

        next();
    }
    catch (err) {
        console.error(err);

        res.status(500).send("Token Invalid!");
    }
}

export default auth;