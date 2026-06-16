const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

const ADMIN_STATUSES = ["priority", "offline", "pending"];
const SUPERADMIN_STATUSES = ["idle", ...ADMIN_STATUSES];

function isAdmin(req) {
  return req.user?.role === "admin" || req.user?.role === "superadmin";
}

function isSuperAdmin(req) {
  return req.user?.role === "superadmin";
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: "Admin role required" });
  }
  return next();
}

function validateIntersectionPayload(payload, isUpdate = false, allowedStatuses = SUPERADMIN_STATUSES) {
  const errors = [];

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || typeof payload.name !== "string") {
      errors.push("name is required");
    }
  }

  if (!isUpdate || payload.address !== undefined) {
    if (!payload.address || typeof payload.address !== "string") {
      errors.push("address is required");
    }
  }

  if (!isUpdate || payload.lat !== undefined) {
    const lat = Number(payload.lat);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      errors.push("lat must be a number between -90 and 90");
    }
  }

  if (!isUpdate || payload.lng !== undefined) {
    const lng = Number(payload.lng);
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      errors.push("lng must be a number between -180 and 180");
    }
  }

  if (payload.status !== undefined && !allowedStatuses.includes(payload.status)) {
    errors.push(`status must be one of: ${allowedStatuses.join(", ")}`);
  }

  return errors;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const intersections = await prisma.intersection.findMany({
      where: {
        municipalityId: req.user.municipalityId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      data: intersections
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const intersection = await prisma.intersection.findFirst({
      where: {
        id: req.params.id,
        municipalityId: req.user.municipalityId
      }
    });

    if (!intersection) {
      return res.status(404).json({
        error: "Intersection not found"
      });
    }

    return res.json({
      data: intersection
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const errors = validateIntersectionPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    const intersection = await prisma.intersection.create({
      data: {
        municipalityId: req.user.municipalityId,
        name: req.body.name,
        address: req.body.address,
        lat: new Prisma.Decimal(req.body.lat),
        lng: new Prisma.Decimal(req.body.lng),
        status: req.body.status || "pending"
      }
    });

    return res.status(201).json({
      data: intersection
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const allowedStatuses = isSuperAdmin(req) ? SUPERADMIN_STATUSES : ADMIN_STATUSES;
    const errors = validateIntersectionPayload(req.body, true, allowedStatuses);

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    const existingIntersection = await prisma.intersection.findFirst({
      where: {
        id: req.params.id,
        municipalityId: req.user.municipalityId
      }
    });

    if (!existingIntersection) {
      return res.status(404).json({
        error: "Intersection not found"
      });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.address !== undefined) updateData.address = req.body.address;
    if (req.body.lat !== undefined) updateData.lat = new Prisma.Decimal(req.body.lat);
    if (req.body.lng !== undefined) updateData.lng = new Prisma.Decimal(req.body.lng);
    if (req.body.status !== undefined) updateData.status = req.body.status;

    const intersection = await prisma.intersection.update({
      where: {
        id: req.params.id
      },
      data: updateData
    });

    return res.json({
      data: intersection
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const existingIntersection = await prisma.intersection.findFirst({
      where: {
        id: req.params.id,
        municipalityId: req.user.municipalityId
      }
    });

    if (!existingIntersection) {
      return res.status(404).json({
        error: "Intersection not found"
      });
    }

    await prisma.intersection.delete({
      where: {
        id: req.params.id
      }
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;