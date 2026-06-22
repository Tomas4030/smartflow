const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const mockCitizenCreate = jest.fn();
const mockCitizenFindUnique = jest.fn();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    citizen: {
      create: mockCitizenCreate,
      findUnique: mockCitizenFindUnique,
    },
  })),
}));

const app = require("../src/index");

const PASSWORD = "password";
let passwordHash;

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 4);
});

afterEach(() => {
  jest.clearAllMocks();
});

function citizenToken() {
  return jwt.sign(
    { sub: "citizen-1", email: "client@example.com", type: "citizen" },
    "test-secret",
    { expiresIn: "1h" }
  );
}

test("POST /api/citizens/login — valid credentials → citizen token", async () => {
  mockCitizenFindUnique.mockResolvedValue({
    id: "citizen-1",
    name: "Ana",
    email: "client@example.com",
    passwordHash,
  });

  const res = await request(app)
    .post("/api/citizens/login")
    .send({ email: "client@example.com", password: PASSWORD });

  expect(res.status).toBe(200);
  expect(res.body.user).toEqual({
    id: "citizen-1",
    name: "Ana",
    email: "client@example.com",
    type: "citizen",
  });

  const payload = jwt.verify(res.body.token, "test-secret");
  expect(payload).toMatchObject({
    sub: "citizen-1",
    email: "client@example.com",
    type: "citizen",
  });
});

test("POST /api/citizens/register — duplicate email → 409", async () => {
  mockCitizenCreate.mockRejectedValue({ code: "P2002" });

  const res = await request(app)
    .post("/api/citizens/register")
    .send({
      name: "Ana",
      email: "client@example.com",
      password: PASSWORD,
    });

  expect(res.status).toBe(409);
  expect(res.body).toEqual({ error: "Email already registered" });
});

test("GET /api/citizens/me — internal user token cannot access citizen profile", async () => {
  const internalToken = jwt.sign(
    {
      sub: "user-1",
      email: "admin@albufeira.pt",
      role: "admin",
      municipalityId: "mun-1",
    },
    "test-secret",
    { expiresIn: "1h" }
  );

  const res = await request(app)
    .get("/api/citizens/me")
    .set("Authorization", `Bearer ${internalToken}`);

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ error: "Citizen access required" });
  expect(mockCitizenFindUnique).not.toHaveBeenCalled();
});

test("GET /api/citizens/me — authenticated citizen never receives passwordHash", async () => {
  mockCitizenFindUnique.mockResolvedValue({
    id: "citizen-1",
    name: "Ana",
    email: "client@example.com",
    passwordHash,
    bloodType: "A+",
  });

  const res = await request(app)
    .get("/api/citizens/me")
    .set("Authorization", `Bearer ${citizenToken()}`);

  expect(res.status).toBe(200);
  expect(res.body.data).toMatchObject({
    id: "citizen-1",
    email: "client@example.com",
    bloodType: "A+",
  });
  expect(res.body.data).not.toHaveProperty("passwordHash");
});
