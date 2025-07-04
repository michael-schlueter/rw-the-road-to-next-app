import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    emailVerified: true,
  },
  {
    username: "user",
    email: "schluet0r4life@gmail.com",
    emailVerified: true,
  },
];

const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket from DB.",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
    private: false,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket from DB.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
    private: false,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket from DB.",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
    private: false,
  },
];

const comments = [
  { content: "First comment from DB." },
  { content: "Second comment from DB." },
  { content: "Third comment from DB." },
];

async function seed() {
  const t0 = performance.now();
  console.log("DB Seed: Started ...");

  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.membership.deleteMany();

  //   for (const ticket of tickets) {
  //     await prisma.ticket.create({
  //         data: ticket,
  //     });
  //   }

  //   const promises = tickets.map((ticket) => prisma.ticket.create({
  //     data: ticket,
  //   }))

  //   await Promise.all(promises);

  const passwordHash = await hash("geheimnis");

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      passwordHash,
    })),
  });

  const dbOrganization = await prisma.organization.create({
    data: {
      name: "Organization 1",
    },
  });

  await prisma.membership.createMany({
    data: [
      {
        userId: dbUsers[0].id,
        organizationId: dbOrganization.id,
        isActive: true,
        membershipRole: "ADMIN",
      },
      {
        userId: dbUsers[1].id,
        organizationId: dbOrganization.id,
        isActive: false,
        membershipRole: "MEMBER",
      },
    ],
  });

  const dbTickets = await prisma.ticket.createManyAndReturn({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
      organizationId: dbOrganization.id,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      ...comment,
      ticketId: dbTickets[0].id,
      userId: dbUsers[1].id,
    })),
  });

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${t1 - t0}ms)`);
}

seed();
