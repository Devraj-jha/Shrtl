import type { Plan } from "@prisma/client";

export const PLANS = {
  FREE: {
    key: "FREE",
    name: "Free",
    priceMonthly: 0,
    maxActiveLinks: 25,
    maxClicksPerMonth: 1000,
    customSlugs: false,
    csvExport: false,
  },
  PRO: {
    key: "PRO",
    name: "Pro",
    priceMonthly: 9,
    maxActiveLinks: Infinity,
    maxClicksPerMonth: Infinity,
    customSlugs: true,
    csvExport: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function planLimits(plan: Plan) {
  return PLANS[plan];
}