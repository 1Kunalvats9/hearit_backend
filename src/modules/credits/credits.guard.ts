import { FastifyReply, FastifyRequest } from "fastify";
import {CreditService} from "./credits.services";

export function requireCredits(action: string) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
        const userId = (req as any).user?.id;
        const { durationSeconds } = req.body as any;

        if (!userId) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        try {
            const cost = CreditService.calculateCost(action, durationSeconds);
            const balance = await CreditService.getBalance(userId);

            if (balance < cost) {
                return reply.status(402).send({
                    message: "Not enough credits",
                    required: cost,
                    balance
                });
            }
        } catch (err: any) {
            return reply.status(400).send({ message: err.message });
        }
    };
}
