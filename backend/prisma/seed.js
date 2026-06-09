const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.detectionEvent.count();
  if (existing > 0) {
    console.log(`Skipping event seed — ${existing} events already exist.`);
    return;
  }

  const munByName = {};
  for (const name of ["Albufeira", "Faro", "Lagos", "Portimão"]) {
    munByName[name] = await prisma.municipality.findFirst({ where: { name } });
  }

  const find = (name, mun) =>
    prisma.intersection.findFirst({
      where: { name, municipalityId: munByName[mun].id },
    });

  const now  = new Date();
  const past = (daysAgo, hoursAgo = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d;
  };

  const events = [
    { name: "Rotunda dos Relógios",      mun: "Albufeira", triggeredBy: "camera", greenDurationS: 45, detectedAt: past(6),    resolvedAt: past(6, -1)  },
    { name: "Rotunda da Oura",           mun: "Albufeira", triggeredBy: "manual", greenDurationS: 30, detectedAt: past(5),    resolvedAt: past(5, -1)  },
    { name: "Rua do Município",          mun: "Albufeira", triggeredBy: "camera", greenDurationS: 60, detectedAt: past(4),    resolvedAt: past(4, -1)  },
    { name: "Avenida Calouste Gulbenkian", mun: "Faro",    triggeredBy: "camera", greenDurationS: 45, detectedAt: past(4),    resolvedAt: past(4, -1)  },
    { name: "Largo de São Francisco",    mun: "Faro",      triggeredBy: "manual", greenDurationS: 30, detectedAt: past(3),    resolvedAt: past(3, -1)  },
    { name: "Rotunda do Teatro Municipal", mun: "Faro",    triggeredBy: "camera", greenDurationS: 45, detectedAt: past(3),    resolvedAt: past(3, -1)  },
    { name: "Estrada da Ponta da Piedade", mun: "Lagos",   triggeredBy: "camera", greenDurationS: 60, detectedAt: past(2),    resolvedAt: past(2, -1)  },
    { name: "Rotunda de São João",       mun: "Lagos",     triggeredBy: "manual", greenDurationS: 30, detectedAt: past(2),    resolvedAt: past(2, -1)  },
    { name: "Rua Infante de Sagres",     mun: "Lagos",     triggeredBy: "camera", greenDurationS: 45, detectedAt: past(1),    resolvedAt: past(1, -1)  },
    { name: "Avenida 25 de Abril",       mun: "Portimão",  triggeredBy: "camera", greenDurationS: 45, detectedAt: past(1),    resolvedAt: past(1, -1)  },
    { name: "Praia da Rocha",            mun: "Portimão",  triggeredBy: "manual", greenDurationS: 30, detectedAt: past(0, 2), resolvedAt: null          },
    { name: "Rotunda dos Relógios",      mun: "Albufeira", triggeredBy: "camera", greenDurationS: 45, detectedAt: past(0, 1), resolvedAt: null          },
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

  const active = await prisma.detectionEvent.findMany({ where: { resolvedAt: null } });
  for (const e of active) {
    await prisma.intersection.update({
      where: { id: e.intersectionId },
      data:  { status: "priority" },
    });
  }

  console.log(`  ✓ Seeded ${events.length} detection events`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });