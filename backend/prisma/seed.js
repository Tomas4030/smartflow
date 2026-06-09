const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ── Static data ───────────────────────────────────────────────

const municipalities = [
  { name: "Albufeira", district: "Faro", email: "admin@albufeira.pt" },
  { name: "Faro",      district: "Faro", email: "admin@faro.pt"      },
  { name: "Lagos",     district: "Faro", email: "admin@lagos.pt"     },
  { name: "Portimão",  district: "Faro", email: "admin@portimao.pt"  },
];

const intersectionsByMunicipality = {
  Albufeira: [
    { name: "Rotunda dos Relógios",       address: "Rotunda dos Relógios, Albufeira",      lat: 37.0896, lng: -8.2504 },
    { name: "Avenida dos Descobrimentos", address: "Av. dos Descobrimentos, Albufeira",    lat: 37.0914, lng: -8.2478 },
    { name: "Rua do Município",           address: "Rua do Município, Albufeira",          lat: 37.0891, lng: -8.2451 },
    { name: "Avenida da Liberdade",       address: "Av. da Liberdade, Albufeira",          lat: 37.0882, lng: -8.2531 },
    { name: "Rotunda da Oura",            address: "Rotunda da Oura, Albufeira",           lat: 37.0919, lng: -8.2274 },
  ],
  Faro: [
    { name: "Rotunda do Hospital",        address: "Hospital de Faro, Faro",               lat: 37.0297, lng: -7.9297 },
    { name: "Avenida Calouste Gulbenkian",address: "Av. Calouste Gulbenkian, Faro",        lat: 37.0249, lng: -7.9322 },
    { name: "Largo de São Francisco",     address: "Largo de São Francisco, Faro",         lat: 37.0146, lng: -7.9315 },
    { name: "Avenida 5 de Outubro",       address: "Av. 5 de Outubro, Faro",               lat: 37.0215, lng: -7.9351 },
    { name: "Rotunda do Teatro Municipal",address: "Teatro Municipal de Faro, Faro",       lat: 37.0226, lng: -7.9486 },
  ],
  Lagos: [
    { name: "Avenida dos Descobrimentos", address: "Av. dos Descobrimentos, Lagos",        lat: 37.1020, lng: -8.6720 },
    { name: "Rotunda da Marina",          address: "Marina de Lagos, Lagos",               lat: 37.1081, lng: -8.6738 },
    { name: "Estrada da Ponta da Piedade",address: "Estrada da Ponta da Piedade, Lagos",  lat: 37.0915, lng: -8.6701 },
    { name: "Rua Infante de Sagres",      address: "Rua Infante de Sagres, Lagos",         lat: 37.1029, lng: -8.6781 },
    { name: "Rotunda de São João",        address: "Rotunda de São João, Lagos",           lat: 37.1132, lng: -8.6754 },
  ],
  Portimão: [
    { name: "Avenida 25 de Abril",        address: "Av. 25 de Abril, Portimão",            lat: 37.1360, lng: -8.5370 },
    { name: "Rotunda do Hospital",        address: "Hospital de Portimão, Portimão",       lat: 37.1449, lng: -8.5456 },
    { name: "Praia da Rocha",             address: "Praia da Rocha, Portimão",             lat: 37.1191, lng: -8.5378 },
    { name: "Avenida V6",                 address: "Av. V6, Portimão",                     lat: 37.1318, lng: -8.5469 },
    { name: "Rotunda da Marina",          address: "Marina de Portimão, Portimão",         lat: 37.1218, lng: -8.5294 },
  ],
};

// ── Helpers ───────────────────────────────────────────────────

const now  = new Date();
const past = (daysAgo, hoursAgo = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d;
};

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  // ── Municipalities + users + intersections (Tomás — 3.1 & 3.2) ──
  const munById = {};

  for (const item of municipalities) {
    const municipality = await prisma.municipality.upsert({
      where:  { name: item.name },
      update: { district: item.district },
      create: { name: item.name, district: item.district },
    });
    munById[item.name] = municipality;

    await prisma.user.upsert({
      where:  { email: item.email },
      update: { name: `Admin ${item.name}`, role: "admin", municipalityId: municipality.id },
      create: { name: `Admin ${item.name}`, email: item.email, passwordHash, role: "admin", municipalityId: municipality.id },
    });

    for (const intersection of intersectionsByMunicipality[item.name] || []) {
      const existing = await prisma.intersection.findFirst({
        where: { name: intersection.name, municipalityId: municipality.id },
      });
      if (!existing) {
        await prisma.intersection.create({
          data: {
            municipalityId: municipality.id,
            name:    intersection.name,
            address: intersection.address,
            lat:     intersection.lat,
            lng:     intersection.lng,
            status:  "idle",
          },
        });
      }
    }
  }

  console.log("  ✓ Municipalities, users and intersections seeded");

  // ── Detection events (Lucas — 3.3) ──────────────────────────
  const existingEvents = await prisma.detectionEvent.count();
  if (existingEvents > 0) {
    console.log(`  · Skipping events — ${existingEvents} already exist`);
  } else {
    // Look up intersection by name + municipality (handles duplicate names across municipalities)
    const find = (name, munName) =>
      prisma.intersection.findFirst({
        where: { name, municipalityId: munById[munName].id },
      });

    // Using only unambiguous intersection names (no cross-municipality duplicates)
    const events = [
      { name: "Rotunda dos Relógios",        mun: "Albufeira", triggeredBy: "camera", greenDurationS: 45, detectedAt: past(6),    resolvedAt: past(6, -1)  },
      { name: "Rotunda da Oura",             mun: "Albufeira", triggeredBy: "manual", greenDurationS: 30, detectedAt: past(5),    resolvedAt: past(5, -1)  },
      { name: "Rua do Município",            mun: "Albufeira", triggeredBy: "camera", greenDurationS: 60, detectedAt: past(4),    resolvedAt: past(4, -1)  },
      { name: "Avenida Calouste Gulbenkian", mun: "Faro",      triggeredBy: "camera", greenDurationS: 45, detectedAt: past(4),    resolvedAt: past(4, -1)  },
      { name: "Largo de São Francisco",      mun: "Faro",      triggeredBy: "manual", greenDurationS: 30, detectedAt: past(3),    resolvedAt: past(3, -1)  },
      { name: "Rotunda do Teatro Municipal", mun: "Faro",      triggeredBy: "camera", greenDurationS: 45, detectedAt: past(3),    resolvedAt: past(3, -1)  },
      { name: "Estrada da Ponta da Piedade", mun: "Lagos",     triggeredBy: "camera", greenDurationS: 60, detectedAt: past(2),    resolvedAt: past(2, -1)  },
      { name: "Rotunda de São João",         mun: "Lagos",     triggeredBy: "manual", greenDurationS: 30, detectedAt: past(2),    resolvedAt: past(2, -1)  },
      { name: "Rua Infante de Sagres",       mun: "Lagos",     triggeredBy: "camera", greenDurationS: 45, detectedAt: past(1),    resolvedAt: past(1, -1)  },
      { name: "Avenida 25 de Abril",         mun: "Portimão",  triggeredBy: "camera", greenDurationS: 45, detectedAt: past(1),    resolvedAt: past(1, -1)  },
      { name: "Praia da Rocha",              mun: "Portimão",  triggeredBy: "manual", greenDurationS: 30, detectedAt: past(0, 2), resolvedAt: null          },
      { name: "Rotunda dos Relógios",        mun: "Albufeira", triggeredBy: "camera", greenDurationS: 45, detectedAt: past(0, 1), resolvedAt: null          },
    ];

    for (const e of events) {
      const intersection = await find(e.name, e.mun);
      if (!intersection) {
        console.warn(`  ⚠️  Intersection not found: "${e.name}" (${e.mun}) — skipping`);
        continue;
      }
      await prisma.detectionEvent.create({
        data: {
          intersectionId: intersection.id,
          triggeredBy:    e.triggeredBy,
          greenDurationS: e.greenDurationS,
          detectedAt:     e.detectedAt,
          resolvedAt:     e.resolvedAt,
        },
      });
    }

    // Reflect active events on their intersections
    const active = await prisma.detectionEvent.findMany({ where: { resolvedAt: null } });
    for (const e of active) {
      await prisma.intersection.update({
        where: { id: e.intersectionId },
        data:  { status: "priority" },
      });
    }

    console.log(`  ✓ ${events.length} detection events seeded`);
  }

  console.log("\nSeed completed ✓");
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });