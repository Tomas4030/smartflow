const request = require("supertest");
const bcrypt = require("bcryptjs");

// Mock PrismaClient used directly in auth route
const mockFindUnique = jest.fn();
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: { findUnique: mockFindUnique },
  })),
}));

const app = require("../src/index");

const PASSWORD = "password";
let passwordHash;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  passwordHash = await bcrypt.hash(PASSWORD, 4);
});

afterEach(() => {
  jest.clearAllMocks();
});

const fakeUser = () => ({
  id: "user-1",
  email: "admin@albufeira.pt",
  name: "Admin Albufeira",
  role: "admin",
  municipalityId: "mun-1",
  passwordHash,
  municipality: { name: "Albufeira" },
});

test("POST /api/auth/login — valid credentials → 200 + token", async () => {
  mockFindUnique.mockResolvedValue(fakeUser());

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@albufeira.pt", password: PASSWORD });

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    user: {
      id: "user-1",
      email: "admin@albufeira.pt",
      municipalityId: "mun-1",
      municipality: "Albufeira",
    },
  });
  expect(res.body.token).toEqual(expect.any(String));
  expect(mockFindUnique).toHaveBeenCalledWith({
    where: { email: "admin@albufeira.pt" },
    include: { municipality: true },
  });
});

test("POST /api/auth/login — wrong password → 401", async () => {
  mockFindUnique.mockResolvedValue(fakeUser());

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@albufeira.pt", password: "wrong" });

  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: "Invalid credentials" });
});

test("POST /api/auth/login — unknown user → 401", async () => {
  mockFindUnique.mockResolvedValue(null);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "nobody@example.com", password: PASSWORD });

  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: "Invalid credentials" });
});
