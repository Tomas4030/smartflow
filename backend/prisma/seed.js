const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const municipalities = [
    { name: "Albufeira", district: "Faro", email: "admin@albufeira.pt" },
    { name: "Faro",      district: "Faro", email: "admin@faro.pt" },
    { name: "Lagos",     district: "Faro", email: "admin@lagos.pt" },
    { name: "Portimão",  district: "Faro", email: "admin@portimao.pt" },
  ];

  const munByName = {};
  for (const item of municipalities) {
    const municipality = await prisma.municipality.upsert({
      where:  { name: item.name },
      update: {},
      create: { name: item.name, district: item.district },
    });
    munByName[item.name] = municipality;

    await prisma.user.upsert({
      where:  { email: item.email },
      update: {},
      create: {
        name:           `Admin ${item.name}`,
        email:          item.email,
        passwordHash,
        role:           "admin",
        municipalityId: municipality.id,
      },
    });
  }

  const intersections = [
    { name: "Rotunda da N269",            address: "EN269, Albufeira",            lat: 37.0850, lng: -8.2537, mun: "Albufeira" },
    { name: "Cruzamento EN125 / EN395",   address: "EN125, Albufeira",            lat: 37.0891, lng: -8.2502, mun: "Albufeira" },
    { name: "Rotunda do Lidl",            address: "Rua do Município, Albufeira", lat: 37.0943, lng: -8.2512, mun: "Albufeira" },
    { name: "Rotunda do Mercado",         address: "Av. da República, Faro",      lat: 37.0194, lng: -7.9322, mun: "Faro" },
    { name: "Cruzamento da Universidade", address: "Campus Universitário, Faro",  lat: 37.0162, lng: -7.9358, mun: "Faro" },
  ];

  const intByName = {};
  for (const item of intersections) {
    let intersection = await prisma.intersection.findFirst({
      where: { name: item.name, municipalityId: munByName[item.mun].id },
    });
    if (!intersection) {
      intersection = await prisma.intersection.create({
        data: {
          name:           item.name,
          address:        item.address,
          lat:            item.lat,
          lng:            item.lng,
          status:         "idle",
          municipalityId: munByName[item.mun].id,
        },
      });
    }
    intByName[item.name] = intersection;
  }

  const existing = await prisma.detectionEvent.count();
  if (existing === 0) {
    const now  = new Date();
    const past = (daysAgo, hoursAgo = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(d.getHours() - hoursAgo);
      return d;
    };

    const events = [
      { intersection: "Rotunda da N269",            triggeredBy: "camera", greenDurationS: 45, detectedAt: past(6), resolvedAt: past(6, -1) },
      { intersection: "Cruzamento EN125 / EN395",   triggeredBy: "manual", greenDurationS: 30, detectedAt: past(5), resolvedAt: past(5, -1) },
      { intersection: "Rotunda do Lidl",            triggeredBy: "camera", greenDurationS: 60, detectedAt: past(5), resolvedAt: past(5, -1) },
      { intersection: "Rotunda do Mercado",         triggeredBy: "camera", greenDurationS: 45, detectedAt: past(4), resolvedAt: past(4, -1) },
      { intersection: "Cruzamento da Universidade", triggeredBy: "manual", greenDurationS: 30, detectedAt: past(4), resolvedAt: past(4, -1) },
      { intersection: "Rotunda da N269",            triggeredBy: "camera", greenDurationS: 45, detectedAt: past(3), resolvedAt: past(3, -1) },
      { intersection: "Cruzamento EN125 / EN395",   triggeredBy: "camera", greenDurationS: 60, detectedAt: past(2), resolvedAt: past(2, -1) },
      { intersection: "Rotunda do Mercado",         triggeredBy: "manual", greenDurationS: 30, detectedAt: past(2), resolvedAt: past(2, -1) },
      { intersection: "Rotunda do Lidl",            triggeredBy: "camera", greenDurationS: 45, detectedAt: past(1), resolvedAt: past(1, -1) },
      { intersection: "Cruzamento da Universidade", triggeredBy: "camera", greenDurationS: 60, detectedAt: past(1), resolvedAt: past(1, -1) },
      { intersection: "Rotunda da N269",            triggeredBy: "manual", greenDurationS: 30, detectedAt: past(0, 2), resolvedAt: null },
      { intersection: "Rotunda do Mercado",         triggeredBy: "camera", greenDurationS: 45, detectedAt: past(0, 1), resolvedAt: null },
    ];

    for (const e of events) {
      await prisma.detectionEvent.create({
        data: {
          intersectionId: intByName[e.intersection].id,
          triggeredBy:    e.triggeredBy,
          greenDurationS: e.greenDurationS,
          detectedAt:     e.detectedAt,
          resolvedAt:     e.resolvedAt,
        },
      });
    }

    await prisma.intersection.update({ where: { id: intByName["Rotunda da N269"].id },    data: { status: "priority" } });
    await prisma.intersection.update({ where: { id: intByName["Rotunda do Mercado"].id }, data: { status: "priority" } });
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