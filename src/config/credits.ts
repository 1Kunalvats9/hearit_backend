export enum CreditAction {
    AI_GENERATE = "ai_generate",
    STEM_SEPARATE = "stem_separate"
}

export const CREDIT_COSTS = {
    [CreditAction.AI_GENERATE]: {
        creditsPerSecond: 0.1
    },
    [CreditAction.STEM_SEPARATE]: {
        creditsPerSecond: 1 / 30
    }
};
