const express = require('express');
const prisma   = require('../prisma');

const router = express.Router();

router.get('/', async (req, res) => {
  const { intersectionId, date } = req.query;
  const { municipalityId }       = req.user;

  const where = {
    intersection: { municipalityId },
  };

  if (intersectionId) {
    where.intersectionId = intersectionId;
  }

  if (date) {
    const start = new Date(date);
    const end   = new Date(date);
    end.setDate(end.getDate() + 1);
    where.detectedAt = { gte: start, lt: end };
  }

  try {
    const events = await prisma.detectionEvent.findMany({
      where,
      include: {
        intersection: { select: { name: true, address: true } },
      },
      orderBy: { detectedAt: 'desc' },
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req, res) => {
  const { municipalityId } = req.user;

  try {
    const event = await prisma.detectionEvent.findFirst({
      where: {
        id:           req.params.id,
        intersection: { municipalityId },
      },
      include: {
        intersection: { select: { name: true, address: true } },
      },
    });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.post('/trigger', async (req, res) => {
  const { intersectionId, greenDurationS } = req.body;
  const { municipalityId }                 = req.user;

  if (!intersectionId || !greenDurationS) {
    return res.status(400).json({
      error: 'intersectionId and greenDurationS are required',
    });
  }

  if (typeof greenDurationS !== 'number' || greenDurationS <= 0) {
    return res.status(400).json({
      error: 'greenDurationS must be a positive number',
    });
  }

  try {
    const intersection = await prisma.intersection.findFirst({
      where: { id: intersectionId, municipalityId },
    });

    if (!intersection) {
      return res.status(403).json({
        error: 'Intersection not found or not in your municipality',
      });
    }

    const [event] = await prisma.$transaction([
      prisma.detectionEvent.create({
        data: {
          intersectionId,
          triggeredBy:   'manual',
          greenDurationS,
        },
      }),
      prisma.intersection.update({
        where: { id: intersectionId },
        data:  { status: 'priority' },
      }),
    ]);

    console.log(
      `[TRIGGER] intersectionId=${intersectionId} municipality=${municipalityId} at=${new Date().toISOString()}`
    );

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to trigger detection' });
  }
});

router.post('/:id/resolve', async (req, res) => {
  const { municipalityId } = req.user;

  try {
    const event = await prisma.detectionEvent.findFirst({
      where: {
        id:           req.params.id,
        intersection: { municipalityId },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.resolvedAt) {
      return res.status(400).json({ error: 'Event is already resolved' });
    }

    const [updatedEvent] = await prisma.$transaction([
      prisma.detectionEvent.update({
        where: { id: req.params.id },
        data:  { resolvedAt: new Date() },
      }),
      prisma.intersection.update({
        where: { id: event.intersectionId },
        data:  { status: 'idle' },
      }),
    ]);

    console.log(
      `[RESOLVE] intersectionId=${event.intersectionId} municipality=${municipalityId} at=${new Date().toISOString()}`
    );

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve event' });
  }
});

module.exports = router;