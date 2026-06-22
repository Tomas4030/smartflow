const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const mockIntersectionFindUnique = jest.fn();
const mockIntersectionUpdate = jest.fn();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    intersection: {
      findUnique: mockIntersectionFindUnique,
      update: mockIntersectionUpdate,
    },
  })),
}));

const app = require("../src/index");

function makeToken(role) {
  return jwt.sign(
    {
      sub: "user-1",
      email: `${role}@smartflow.pt`,
      role,
      municipalityId: "mun-1",
    },
    "test-secret",
    { expiresIn: "1h" }
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

test("GET /api/admin/intersections — municipal admin is denied", async () => {
  const res = await request(app)
    .get("/api/admin/intersections")
    .set("Authorization", `Bearer ${makeToken("admin")}`);

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ error: "Super admin access required" });
});

test("PUT /api/admin/intersections/:id/approve — pending intersection becomes idle", async () => {
  mockIntersectionFindUnique.mockResolvedValue({
    id: "int-1",
    status: "pending",
  });
  mockIntersectionUpdate.mockResolvedValue({
    id: "int-1",
    status: "idle",
  });

  const res = await request(app)
    .put("/api/admin/intersections/int-1/approve")
    .set("Authorization", `Bearer ${makeToken("superadmin")}`);

  expect(res.status).toBe(200);
  expect(res.body.data).toMatchObject({ id: "int-1", status: "idle" });
  expect(mockIntersectionUpdate).toHaveBeenCalledWith({
    where: { id: "int-1" },
    data: { status: "idle" },
  });
});

test("PUT /api/admin/intersections/:id/approve — non-pending intersection is unchanged", async () => {
  mockIntersectionFindUnique.mockResolvedValue({
    id: "int-1",
    status: "priority",
  });

  const res = await request(app)
    .put("/api/admin/intersections/int-1/approve")
    .set("Authorization", `Bearer ${makeToken("superadmin")}`);

  expect(res.status).toBe(400);
  expect(res.body).toEqual({
    error: "Only pending intersections can be approved",
  });
  expect(mockIntersectionUpdate).not.toHaveBeenCalled();
});
