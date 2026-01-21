import {Prisma} from "@prisma/client";
import {prisma} from "../../common/db/prisma";
import {CREDIT_COSTS} from "../../config/credits";

export class CreditService {
    static async getBalance(userId: string): Promise<number> {
        const result = await prisma.creditTransaction.aggregate({
            where: {userId},
            _sum:{credits: true}
        })
        return result._sum.credits ?? 0;
    }

    static calculateCost(action: string, durationSeconds ?: number){
        const config = CREDIT_COSTS[action as keyof typeof CREDIT_COSTS];

        if (!config) {
            throw new Error(`Unknown credit action: ${action}`);
        }

        if (!durationSeconds) {
            throw new Error("Duration required for credit calculation");
        }

        return Number(
            (durationSeconds * config.creditsPerSecond).toFixed(2)
        );
    }

    static async deductCredits(
        userId: string,
        action: string,
        durationSeconds: number,
        costUsd?: number,
        metadata?: Prisma.InputJsonValue
    ) {
        const cost = this.calculateCost(action, durationSeconds);
        const balance = await this.getBalance(userId);

        if (balance < cost) {
            throw new Error("Insufficient credits");
        }

        await prisma.creditTransaction.create({
            data: {
                userId,
                type: "spend",
                action,
                credits: -cost,
                costUsd,
                metadata
            }
        });

        return cost;
    }
}