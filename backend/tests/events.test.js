const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const mockIntersectionFindFirst = jest.fn();
const mockIntersectionUpdate = jest.fn();
const mockEventCreate = jest.fn();
const mockEventFindFirst = jest.fn();
const mockEventUpdate = jest.fn();
const mockTransaction = jest.fn();

jest.mock("../src/prisma", () => ({
  intersection: {
    findFirst: mockIntersectionFindFirst,
    update: mockIntersectionUpdate,
  },
  detectionEvent: {
    create: mockEventCreate,
    findFirst: mockEventFindFirst,
    update: mockEventUpdate,
  },
  $transaction: mockTransaction,
}));

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: { findUnique: jest.fn() },
  })),
}));

const app = require("../src/index");

function makeToken(municipalityId = "mun-1") {
  return jwt.sign(
    { sub: "user-1", email: "admin@albufeira.pt", name: "Admin", role: "admin", municipalityId },
    "test-secret",
    { expiresIn: "1h" }
  );
}

let consoleLogSpy;

beforeEach(() => {
  consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  consoleLogSpy.mockRestore();
  jest.clearAllMocks();
});

test("POST /api/events/trigger — valid intersectionId → 201 + event created, intersection status = priority", async () => {
  const intersection = { id: "int-1", municipalityId: "mun-1", status: "idle" };
  const event = { id: "evt-1", intersectionId: "int-1", triggeredBy: "manual", greenDurationS: 30 };
  const updatedIntersection = { ...intersection, status: "priority" };

  mockIntersectionFindFirst.mockResolvedValue(intersection);
  // create and update are called before $transaction receives their promises
  mockEventCreate.mockResolvedValue(event);
  mockIntersectionUpdate.mockResolvedValue(updatedIntersection);
  mockTransaction.mockImplementation((promises) => Promise.all(promises));

  const res = await request(app)
    .post("/api/events/trigger")
    .set("Authorization", `Bearer ${makeToken("mun-1")}`)
    .send({ intersectionId: "int-1", greenDurationS: 30 });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ intersectionId: "int-1", triggeredBy: "manual" });
  expect(mockIntersectionFindFirst).toHaveBeenCalledWith({
    where: { id: "int-1", municipalityId: "mun-1" },
  });
  expect(mockEventCreate).toHaveBeenCalledWith({
    data: {
      intersectionId: "int-1",
      triggeredBy: "manual",
      greenDurationS: 30,
    },
  });
  expect(mockIntersectionUpdate).toHaveBeenCalledWith({
    where: { id: "int-1" },
    data: { status: "priority" },
  });

  const log = JSON.parse(consoleLogSpy.mock.calls[0][0]);
  expect(log).toMatchObject({
    level: "info",
    event: "TRIGGER",
    intersectionId: "int-1",
    municipality: "mun-1",
  });
  expect(log.timestamp).toEqual(expect.any(String));
});

test("POST /api/events/trigger — intersection from wrong municipality → 403", async () => {
  mockIntersectionFindFirst.mockResolvedValue(null);

  const res = await request(app)
    .post("/api/events/trigger")
    .set("Authorization", `Bearer ${makeToken("mun-99")}`)
    .send({ intersectionId: "int-1", greenDurationS: 30 });

  expect(res.status).toBe(403);
  expect(res.body).toEqual({
    error: "Intersection not found or not in your municipality",
  });
  expect(mockTransaction).not.toHaveBeenCalled();
});

test("POST /api/events/:id/resolve — active event → 200 + intersection status = idle", async () => {
  const detectedAt = new Date("2026-06-22T10:00:00.000Z");
  const resolvedAt = new Date("2026-06-22T10:00:45.000Z");
  const event = {
    id: "evt-1",
    intersectionId: "int-1",
    detectedAt,
    resolvedAt: null,
  };
  const updatedEvent = { ...event, resolvedAt };

  mockEventFindFirst.mockResolvedValue(event);
  mockEventUpdate.mockResolvedValue(updatedEvent);
  mockIntersectionUpdate.mockResolvedValue({ id: "int-1", status: "idle" });
  mockTransaction.mockImplementation((promises) => Promise.all(promises));

  const res = await request(app)
    .post("/api/events/evt-1/resolve")
    .set("Authorization", `Bearer ${makeToken("mun-1")}`);

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    id: "evt-1",
    intersectionId: "int-1",
    resolvedAt: resolvedAt.toISOString(),
  });
  expect(mockEventFindFirst).toHaveBeenCalledWith({
    where: {
      id: "evt-1",
      intersection: { municipalityId: "mun-1" },
    },
  });
  expect(mockEventUpdate).toHaveBeenCalledWith({
    where: { id: "evt-1" },
    data: { resolvedAt: expect.any(Date) },
  });
  expect(mockIntersectionUpdate).toHaveBeenCalledWith({
    where: { id: "int-1" },
    data: { status: "idle" },
  });

  const log = JSON.parse(consoleLogSpy.mock.calls[0][0]);
  expect(log).toMatchObject({
    level: "info",
    event: "RESOLVE",
    intersectionId: "int-1",
    municipality: "mun-1",
    duration: 45,
  });
  expect(log.timestamp).toEqual(expect.any(String));
});
