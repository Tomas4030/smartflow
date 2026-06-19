const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Middleware: citizen auth via JWT
function requireCitizen(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  try {
    const payload = jwt.verify(authHeader.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (payload.type !== "citizen") return res.status(403).json({ error: "Citizen access required" });
    req.citizen = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// POST /api/citizens/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email and password are required" });

    const passwordHash = await bcrypt.hash(password, 10);
    const citizen = await prisma.citizen.create({
      data: { name, email, passwordHash, phone: phone || null },
    });

    const token = jwt.sign({ sub: citizen.id, email: citizen.email, type: "citizen" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.status(201).json({ token, user: { id: citizen.id, name: citizen.name, email: citizen.email, type: "citizen" } });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "Email already registered" });
    return next(error);
  }
});

// POST /api/citizens/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const citizen = await prisma.citizen.findUnique({ where: { email } });
    if (!citizen) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, citizen.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: citizen.id, email: citizen.email, type: "citizen" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token, user: { id: citizen.id, name: citizen.name, email: citizen.email, type: "citizen" } });
  } catch (error) { return next(error); }
});

// GET /api/citizens/me
router.get("/me", requireCitizen, async (req, res, next) => {
  try {
    const citizen = await prisma.citizen.findUnique({ where: { id: req.citizen.id } });
    if (!citizen) return res.status(404).json({ error: "Citizen not found" });
    const { passwordHash, ...data } = citizen;
    return res.json({ data });
  } catch (error) { return next(error); }
});

// PUT /api/citizens/profile
router.put("/profile", requireCitizen, async (req, res, next) => {
  try {
    const { name, phone, address, addressFloor, addressDoor, lat, lng, age, bloodType, conditions, allergies, medication, emergencyName, emergencyPhone, notes } = req.body;
    const updated = await prisma.citizen.update({
      where: { id: req.citizen.id },
      data: { name, phone, address, addressFloor, addressDoor, lat: lat ? parseFloat(lat) : null, lng: lng ? parseFloat(lng) : null, age: age ? parseInt(age) : null, bloodType, conditions, allergies, medication, emergencyName, emergencyPhone, notes },
    });
    const { passwordHash, ...data } = updated;
    return res.json({ data });
  } catch (error) { return next(error); }
});

// POST /api/citizens/sos
router.post("/sos", requireCitizen, async (req, res, next) => {
  try {
    const citizen = await prisma.citizen.findUnique({ where: { id: req.citizen.id } });
    if (!citizen) return res.status(404).json({ error: "Citizen not found" });

    // Pick a random intersection to simulate ambulance route
    const intersections = await prisma.intersection.findMany({ where: { status: "idle" }, take: 10 });
    const intersection = intersections.length > 0 ? intersections[Math.floor(Math.random() * intersections.length)] : null;

    // Build simulated call transcript
    const transcript = `Chamada simulada para o 112:\n\nOlá, esta é uma chamada automática do sistema SmartFlow SOS.\n\nO cidadão ${citizen.name} acionou um pedido de emergência médica.\n\nDados médicos:\n- Idade: ${citizen.age || "Não indicada"} anos\n- Tipo de sangue: ${citizen.bloodType || "Não indicado"}\n- Doenças: ${citizen.conditions || "Nenhuma registada"}\n- Alergias: ${citizen.allergies || "Nenhuma registada"}\n- Medicação: ${citizen.medication || "Nenhuma registada"}\n\nLocalização aproximada:\n${citizen.address || "Não disponível"}.\n\nContacto de emergência:\n${citizen.emergencyName || "Não indicado"} — ${citizen.emergencyPhone || "Não indicado"}.\n\nUma ambulância foi simulada e o sistema SmartFlow foi ativado para preparar os cruzamentos no percurso.`;

    // Create emergency request
    const emergency = await prisma.emergencyRequest.create({
      data: {
        citizenId: citizen.id,
        intersectionId: intersection?.id || null,
        status: "simulated_call",
        callTranscript: transcript,
      },
    });

    // If intersection found, set it to priority and create a DetectionEvent
    let smartflowEvent = null;
    if (intersection) {
      await prisma.intersection.update({ where: { id: intersection.id }, data: { status: "priority" } });
      const event = await prisma.detectionEvent.create({
        data: {
          intersectionId: intersection.id,
          triggeredBy: "sos",
          greenDurationS: 120,
        },
      });
      smartflowEvent = { eventId: event.id, intersection: intersection.name, municipality: intersection.municipalityId, status: "priority" };
    }

    return res.status(201).json({
      message: "Emergência simulada criada com sucesso.",
      status: "simulated_call",
      callTranscript: transcript,
      emergency: { id: emergency.id, createdAt: emergency.createdAt },
      smartflowEvent,
    });
  } catch (error) { return next(error); }
});

// GET /api/citizens/emergencies
router.get("/emergencies", requireCitizen, async (req, res, next) => {
  try {
    const emergencies = await prisma.emergencyRequest.findMany({
      where: { citizenId: req.citizen.id },
      include: { intersection: { select: { name: true, address: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: emergencies });
  } catch (error) { return next(error); }
});

module.exports = router;
