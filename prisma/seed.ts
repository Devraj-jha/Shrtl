import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* eslint-disable no-console */

async function main() {
  const mk = await prisma.user.upsert({
    where: { email: "demo@waypoint.dev" },
    update: {},
    create: {
      email: "demo@waypoint.dev",
      name: "Harbour Master",
      plan: "PRO",
      links: {
        create: [
          {
            slug: "sail",
            longUrl: "https://news.ycombinator.com/item?id=41212752",
            title: "Sailing the open web",
            clicks: {
              create: [
                {
                  timestamp: new Date(Date.now() - 86400000 * 6),
                  country: "US",
                  device: "desktop",
                  referrer: "https://news.ycombinator.com/",
                },
                {
                  timestamp: new Date(Date.now() - 86400000 * 4),
                  country: "GB",
                  device: "mobile",
                  referrer: "https://x.com/",
                },
                {
                  timestamp: new Date(Date.now() - 86400000 * 2),
                  country: "DE",
                  device: "desktop",
                },
                {
                  timestamp: new Date(Date.now() - 3600000 * 5),
                  country: "IN",
                  device: "mobile",
                  referrer: "https://www.google.com/",
                },
              ],
            },
          },
          {
            slug: "charts",
            longUrl: "https://www.wikipedia.org/",
            title: "Charting the unknown",
            clicks: {
              create: [
                {
                  timestamp: new Date(Date.now() - 86400000 * 3),
                  country: "CA",
                  device: "desktop",
                  referrer: "https://duckduckgo.com/",
                },
                {
                  timestamp: new Date(Date.now() - 86400000),
                  country: "JP",
                  device: "mobile",
                },
              ],
            },
          },
        ],
      },
    },
    include: { links: true },
  });

  const count = await prisma.click.count();
  console.log(`Seeded demo user ${mk.email} with ${mk.links.length} waypoints.`);
  console.log(`Total tracked clicks: ${count}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });