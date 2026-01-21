import {FastifyReply, FastifyRequest} from "fastify";
import {env} from "../../config/env";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: any, res: FastifyReply){
    const header = req.headers.authorization;
    if (!header) return res.status(401).send({ message: "Unauthorized" });

    const token = header.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as any;
        req.user = { id: decoded.userId };
    } catch {
        return res.status(401).send({ message: "Invalid token" });
    }
}