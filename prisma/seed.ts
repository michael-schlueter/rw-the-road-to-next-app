import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket from DB.",
    status: "DONE" as const,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket from DB.",
    status: "OPEN" as const,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket from DB.",
    status: "IN_PROGRESS" as const,
  },
];

async function seed() {
  const t0 = performance.now();
  console.log("DB Seed: Started ...");

  await prisma.ticket.deleteMany();

//   for (const ticket of tickets) {
//     await prisma.ticket.create({
//         data: ticket,
//     });
//   }

//   const promises = tickets.map((ticket) => prisma.ticket.create({
//     data: ticket,
//   }))

//   await Promise.all(promises);

  await prisma.ticket.createMany({
    data: tickets,
  });

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${t1 - t0}ms)`);
}

seed();
