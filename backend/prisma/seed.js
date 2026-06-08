const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Municipalities ─────────────────────────────────────────
  const albufeira = await prisma.municipality.upsert({
    where:  { id: 'mun-albufeira' },
    update: {},
    create: { id: 'mun-albufeira', name: 'Albufeira', district: 'Faro' },
  });

  const faro = await prisma.municipality.upsert({
    where:  { id: 'mun-faro' },
    update: {},
    create: { id: 'mun-faro', name: 'Faro', district: 'Faro' },
  });

  console.log('  ✓ Municipalities');

  // ── Intersections — Albufeira ──────────────────────────────
  const intersections = await Promise.all([
    prisma.intersection.upsert({
      where:  { id: 'int-alb-1' },
      update: {},
      create: {
        id:             'int-alb-1',
        municipalityId: albufeira.id,
        name:           'Rotunda da N269',
        address:        'EN269, Albufeira',
        lat:            37.0850,
        lng:            -8.2537,
        status:         'idle',
      },
    }),
    prisma.intersection.upsert({
      where:  { id: 'int-alb-2' },
      update: {},
      create: {
        id:             'int-alb-2',
        municipalityId: albufeira.id,
        name:           'Cruzamento EN125 / EN395',
        address:        'EN125, Albufeira',
        lat:            37.0891,
        lng:            -8.2502,
        status:         'idle',
      },
    }),
    prisma.intersection.upsert({
      where:  { id: 'int-alb-3' },
      update: {},
      create: {
        id:             'int-alb-3',
        municipalityId: albufeira.id,
        name:           'Rotunda do Lidl',
        address:        'Rua do Município, Albufeira',
        lat:            37.0943,
        lng:            -8.2512,
        status:         'idle',
      },
    }),

    // ── Intersections — Faro ─────────────────────────────────
    prisma.intersection.upsert({
      where:  { id: 'int-far-1' },
      update: {},
      create: {
        id:             'int-far-1',
        municipalityId: faro.id,
        name:           'Rotunda do Mercado',
        address:        'Av. da República, Faro',
        lat:            37.0194,
        lng:            -7.9322,
        status:         'idle',
      },
    }),
    prisma.intersection.upsert({
      where:  { id: 'int-far-2' },
      update: {},
      create: {
        id:             'int-far-2',
        municipalityId: faro.id,
        name:           'Cruzamento da Universidade',
        address:        'Campus Universitário, Faro',
        lat:            37.0162,
        lng:            -7.9358,
        status:         'idle',
      },
    }),
  ]);

  console.log('  ✓ Intersections');

  const now  = new Date();
  const past = (daysAgo, hoursAgo = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d;
  };

  const eventData = [
    { id: 'evt-1',  intersectionId: 'int-alb-1', triggeredBy: 'camera', greenDurationS: 45, detectedAt: past(6),     resolvedAt: past(6, -1) },
    { id: 'evt-2',  intersectionId: 'int-alb-2', triggeredBy: 'manual', greenDurationS: 30, detectedAt: past(5),     resolvedAt: past(5, -1) },
    { id: 'evt-3',  intersectionId: 'int-alb-3', triggeredBy: 'camera', greenDurationS: 60, detectedAt: past(5),     resolvedAt: past(5, -1) },
    { id: 'evt-4',  intersectionId: 'int-far-1', triggeredBy: 'camera', greenDurationS: 45, detectedAt: past(4),     resolvedAt: past(4, -1) },
    { id: 'evt-5',  intersectionId: 'int-far-2', triggeredBy: 'manual', greenDurationS: 30, detectedAt: past(4),     resolvedAt: past(4, -1) },
    { id: 'evt-6',  intersectionId: 'int-alb-1', triggeredBy: 'camera', greenDurationS: 45, detectedAt: past(3),     resolvedAt: past(3, -1) },
    { id: 'evt-7',  intersectionId: 'int-alb-2', triggeredBy: 'camera', greenDurationS: 60, detectedAt: past(2),     resolvedAt: past(2, -1) },
    { id: 'evt-8',  intersectionId: 'int-far-1', triggeredBy: 'manual', greenDurationS: 30, detectedAt: past(2),     resolvedAt: past(2, -1) },
    { id: 'evt-9',  intersectionId: 'int-alb-3', triggeredBy: 'camera', greenDurationS: 45, detectedAt: past(1),     resolvedAt: past(1, -1) },
    { id: 'evt-10', intersectionId: 'int-far-2', triggeredBy: 'camera', greenDurationS: 60, detectedAt: past(1),     resolvedAt: past(1, -1) },
    { id: 'evt-11', intersectionId: 'int-alb-1', triggeredBy: 'manual', greenDurationS: 30, detectedAt: past(0, 2),  resolvedAt: null },
    { id: 'evt-12', intersectionId: 'int-far-1', triggeredBy: 'camera', greenDurationS: 45, detectedAt: past(0, 1),  resolvedAt: null },
  ];

  for (const data of eventData) {
    await prisma.detectionEvent.upsert({
      where:  { id: data.id },
      update: {},
      create: data,
    });
  }


  await prisma.intersection.update({ where: { id: 'int-alb-1' }, data: { status: 'priority' } });
  await prisma.intersection.update({ where: { id: 'int-far-1' }, data: { status: 'priority' } });

  console.log('  ✓ Detection events (12 total — 2 active, 10 resolved)');
  console.log('\nDone! 🌱');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());