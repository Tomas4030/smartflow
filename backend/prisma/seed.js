const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const municipalities = [
  { name: "Albufeira", district: "Faro", email: "admin@albufeira.pt" },
  { name: "Faro", district: "Faro", email: "admin@faro.pt" },
  { name: "Lagos", district: "Faro", email: "admin@lagos.pt" },
  { name: "Portimão", district: "Faro", email: "admin@portimao.pt" }
];

const intersectionsByMunicipality = {
  Albufeira: [
    {
      name: "Rotunda dos Relógios",
      address: "Rotunda dos Relógios, Albufeira",
      lat: 37.0896,
      lng: -8.2504
    },
    {
      name: "Avenida dos Descobrimentos",
      address: "Av. dos Descobrimentos, Albufeira",
      lat: 37.0914,
      lng: -8.2478
    },
    {
      name: "Rua do Município",
      address: "Rua do Município, Albufeira",
      lat: 37.0891,
      lng: -8.2451
    },
    {
      name: "Avenida da Liberdade",
      address: "Av. da Liberdade, Albufeira",
      lat: 37.0882,
      lng: -8.2531
    },
    {
      name: "Rotunda da Oura",
      address: "Rotunda da Oura, Albufeira",
      lat: 37.0919,
      lng: -8.2274
    }
  ],

  Faro: [
    {
      name: "Rotunda do Hospital",
      address: "Hospital de Faro, Faro",
      lat: 37.0297,
      lng: -7.9297
    },
    {
      name: "Avenida Calouste Gulbenkian",
      address: "Av. Calouste Gulbenkian, Faro",
      lat: 37.0249,
      lng: -7.9322
    },
    {
      name: "Largo de São Francisco",
      address: "Largo de São Francisco, Faro",
      lat: 37.0146,
      lng: -7.9315
    },
    {
      name: "Avenida 5 de Outubro",
      address: "Av. 5 de Outubro, Faro",
      lat: 37.0215,
      lng: -7.9351
    },
    {
      name: "Rotunda do Teatro Municipal",
      address: "Teatro Municipal de Faro, Faro",
      lat: 37.0226,
      lng: -7.9486
    }
  ],

  Lagos: [
    {
      name: "Avenida dos Descobrimentos",
      address: "Av. dos Descobrimentos, Lagos",
      lat: 37.102,
      lng: -8.672
    },
    {
      name: "Rotunda da Marina",
      address: "Marina de Lagos, Lagos",
      lat: 37.1081,
      lng: -8.6738
    },
    {
      name: "Estrada da Ponta da Piedade",
      address: "Estrada da Ponta da Piedade, Lagos",
      lat: 37.0915,
      lng: -8.6701
    },
    {
      name: "Rua Infante de Sagres",
      address: "Rua Infante de Sagres, Lagos",
      lat: 37.1029,
      lng: -8.6781
    },
    {
      name: "Rotunda de São João",
      address: "Rotunda de São João, Lagos",
      lat: 37.1132,
      lng: -8.6754
    }
  ],

  Portimão: [
    {
      name: "Avenida 25 de Abril",
      address: "Av. 25 de Abril, Portimão",
      lat: 37.136,
      lng: -8.537
    },
    {
      name: "Rotunda do Hospital",
      address: "Hospital de Portimão, Portimão",
      lat: 37.1449,
      lng: -8.5456
    },
    {
      name: "Praia da Rocha",
      address: "Praia da Rocha, Portimão",
      lat: 37.1191,
      lng: -8.5378
    },
    {
      name: "Avenida V6",
      address: "Av. V6, Portimão",
      lat: 37.1318,
      lng: -8.5469
    },
    {
      name: "Rotunda da Marina",
      address: "Marina de Portimão, Portimão",
      lat: 37.1218,
      lng: -8.5294
    }
  ]
};

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  for (const item of municipalities) {
    const municipality = await prisma.municipality.upsert({
      where: {
        name: item.name
      },
      update: {
        district: item.district
      },
      create: {
        name: item.name,
        district: item.district
      }
    });

    await prisma.user.upsert({
      where: {
        email: item.email
      },
      update: {
        name: `Admin ${item.name}`,
        role: "admin",
        municipalityId: municipality.id
      },
      create: {
        name: `Admin ${item.name}`,
        email: item.email,
        passwordHash,
        role: "admin",
        municipalityId: municipality.id
      }
    });

    const intersections = intersectionsByMunicipality[item.name] || [];

    for (const intersection of intersections) {
      const existingIntersection = await prisma.intersection.findFirst({
        where: {
          name: intersection.name,
          municipalityId: municipality.id
        }
      });

      if (!existingIntersection) {
        await prisma.intersection.create({
          data: {
            municipalityId: municipality.id,
            name: intersection.name,
            address: intersection.address,
            lat: intersection.lat,
            lng: intersection.lng,
            status: "idle"
          }
        });
      }
    }
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