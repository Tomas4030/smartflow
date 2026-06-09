const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const municipalities = await prisma.municipality.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        district: true
      }
    });

    return res.json({
      data: municipalities
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;