const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const municipalities = [
    { name: "Albufeira", district: "Faro", email: "admin@albufeira.pt" },
    { name: "Faro", district: "Faro", email: "admin@faro.pt" },
    { name: "Lagos", district: "Faro", email: "admin@lagos.pt" },
    { name: "Portimão", district: "Faro", email: "admin@portimao.pt" }
  ];

  for (const item of municipalities) {
    const municipality = await prisma.municipality.upsert({
      where: {
        name: item.name
      },
      update: {},
      create: {
        name: item.name,
        district: item.district
      }
    });

    await prisma.user.upsert({
      where: {
        email: item.email
      },
      update: {},
      create: {
        name: `Admin ${item.name}`,
        email: item.email,
        passwordHash,
        role: "admin",
        municipalityId: municipality.id
      }
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });