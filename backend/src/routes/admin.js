const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
}

router.use(requireSuperAdmin);

// ── Municipalities ────────────────────────────────────────────

// GET /api/admin/municipalities
router.get("/municipalities", async (req, res, next) => {
  try {
    const municipalities = await prisma.municipality.findMany({
      include: { intersections: { select: { status: true } } },
      orderBy: { name: "asc" },
    });
    const data = municipalities.map((m) => ({
      id: m.id,
      name: m.name,
      district: m.district,
      createdAt: m.createdAt,
      total: m.intersections.length,
      pending: m.intersections.filter((i) => i.status === "pending").length,
      priority: m.intersections.filter((i) => i.status === "priority").length,
      offline: m.intersections.filter((i) => i.status === "offline").length,
    }));
    return res.json({ data });
  } catch (error) { return next(error); }
});

// POST /api/admin/municipalities
router.post("/municipalities", async (req, res, next) => {
  try {
    const { name, district, adminEmail, adminPassword } = req.body;
    if (!name || !district || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: "name, district, adminEmail and adminPassword are required" });
    }
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const municipality = await prisma.municipality.create({ data: { name, district } });
    const user = await prisma.user.create({
      data: {
        name: `Admin ${name}`,
        email: adminEmail,
        passwordHash,
        role: "admin",
        municipalityId: municipality.id,
      },
    });
    return res.status(201).json({ data: { ...municipality, admin: { email: user.email, name: user.name } } });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "Municipality or email already exists" });
    return next(error);
  }
});

// PUT /api/admin/municipalities/:id
router.put("/municipalities/:id", async (req, res, next) => {
  try {
    const { name, district } = req.body;
    const data = {};
    if (name) data.name = name;
    if (district) data.district = district;
    const municipality = await prisma.municipality.update({ where: { id: req.params.id }, data });
    return res.json({ data: municipality });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Municipality not found" });
    if (error.code === "P2002") return res.status(409).json({ error: "Municipality name already exists" });
    return next(error);
  }
});

// DELETE /api/admin/municipalities/:id
router.delete("/municipalities/:id", async (req, res, next) => {
  try {
    await prisma.municipality.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Municipality not found" });
    if (error.code === "P2003") return res.status(409).json({ error: "Cannot delete municipality with existing intersections or users" });
    return next(error);
  }
});

// ── Intersections ─────────────────────────────────────────────

// GET /api/admin/intersections
router.get("/intersections", async (req, res, next) => {
  try {
    const intersections = await prisma.intersection.findMany({
      include: { municipality: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: intersections });
  } catch (error) { return next(error); }
});

// GET /api/admin/intersections/pending
router.get("/intersections/pending", async (req, res, next) => {
  try {
    const intersections = await prisma.intersection.findMany({
      where: { status: "pending" },
      include: { municipality: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: intersections });
  } catch (error) { return next(error); }
});

// PUT /api/admin/intersections/:id/approve
router.put("/intersections/:id/approve", async (req, res, next) => {
  try {
    const intersection = await prisma.intersection.findUnique({ where: { id: req.params.id } });
    if (!intersection) return res.status(404).json({ error: "Intersection not found" });
    if (intersection.status !== "pending") return res.status(400).json({ error: "Only pending intersections can be approved" });
    const updated = await prisma.intersection.update({ where: { id: req.params.id }, data: { status: "idle" } });
    return res.json({ data: updated });
  } catch (error) { return next(error); }
});

// PUT /api/admin/intersections/:id/reject
router.put("/intersections/:id/reject", async (req, res, next) => {
  try {
    const intersection = await prisma.intersection.findUnique({ where: { id: req.params.id } });
    if (!intersection) return res.status(404).json({ error: "Intersection not found" });
    if (intersection.status !== "pending") return res.status(400).json({ error: "Only pending intersections can be rejected" });
    const updated = await prisma.intersection.update({ where: { id: req.params.id }, data: { status: "offline" } });
    return res.json({ data: updated });
  } catch (error) { return next(error); }
});

// ── History ───────────────────────────────────────────────────

// GET /api/admin/history — all detection events across all municipalities
router.get("/history", async (req, res, next) => {
  try {
    const events = await prisma.detectionEvent.findMany({
      include: {
        intersection: {
          select: { name: true, address: true, municipality: { select: { name: true } } },
        },
      },
      orderBy: { detectedAt: "desc" },
      take: 100,
    });
    return res.json({ data: events });
  } catch (error) { return next(error); }
});

module.exports = router;
