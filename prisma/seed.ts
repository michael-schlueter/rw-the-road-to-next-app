import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket from DB.",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket from DB.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket from DB.",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
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
