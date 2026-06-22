const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const mockIntersectionFindFirst = jest.fn();
const mockIntersectionCreate = jest.fn();

class MockDecimal {
  constructor(value) {
    this.value = value;
  }
}

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    intersection: {
      findFirst: mockIntersectionFindFirst,
      create: mockIntersectionCreate,
    },
  })),
  Prisma: { Decimal: MockDecimal },
}));

const app = require("../src/index");

function makeToken(role = "admin", municipalityId = "mun-1") {
  return jwt.sign(
    {
      sub: "user-1",
      email: "user@albufeira.pt",
      role,
      municipalityId,
    },
    "test-secret",
    { expiresIn: "1h" }
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

test("GET /api/intersections/:id — query is restricted to user's municipality", async () => {
  mockIntersectionFindFirst.mockResolvedValue(null);

  const res = await request(app)
    .get("/api/intersections/int-1")
    .set("Authorization", `Bearer ${makeToken("admin", "mun-1")}`);

  expect(res.status).toBe(404);
  expect(mockIntersectionFindFirst).toHaveBeenCalledWith({
    where: {
      id: "int-1",
      municipalityId: "mun-1",
    },
  });
});

test("POST /api/intersections — operator cannot create intersections", async () => {
  const res = await request(app)
    .post("/api/intersections")
    .set("Authorization", `Bearer ${makeToken("operator")}`)
    .send({
      name: "Av. Central",
      address: "Albufeira",
      lat: 37.09,
      lng: -8.25,
    });

  expect(res.status).toBe(403);
  expect(res.body).toEqual({ error: "Admin role required" });
  expect(mockIntersectionCreate).not.toHaveBeenCalled();
});

test("POST /api/intersections — rejects coordinates outside valid range", async () => {
  const res = await request(app)
    .post("/api/intersections")
    .set("Authorization", `Bearer ${makeToken("admin")}`)
    .send({
      name: "Av. Central",
      address: "Albufeira",
      lat: 95,
      lng: -181,
    });

  expect(res.status).toBe(400);
  expect(res.body).toEqual({
    error: "Validation failed",
    details: [
      "lat must be a number between -90 and 90",
      "lng must be a number between -180 and 180",
    ],
  });
  expect(mockIntersectionCreate).not.toHaveBeenCalled();
});

test("POST /api/intersections — valid admin request creates pending intersection in own municipality", async () => {
  mockIntersectionCreate.mockResolvedValue({
    id: "int-1",
    municipalityId: "mun-1",
    name: "Av. Central",
    address: "Albufeira",
    status: "pending",
  });

  const res = await request(app)
    .post("/api/intersections")
    .set("Authorization", `Bearer ${makeToken("admin", "mun-1")}`)
    .send({
      name: "Av. Central",
      address: "Albufeira",
      lat: 37.09,
      lng: -8.25,
    });

  expect(res.status).toBe(201);
  expect(res.body.data).toMatchObject({
    municipalityId: "mun-1",
    status: "pending",
  });
  expect(mockIntersectionCreate).toHaveBeenCalledWith({
    data: {
      municipalityId: "mun-1",
      name: "Av. Central",
      address: "Albufeira",
      lat: expect.any(MockDecimal),
      lng: expect.any(MockDecimal),
      status: "pending",
    },
  });
});
