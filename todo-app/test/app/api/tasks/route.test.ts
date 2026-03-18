import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = vi.hoisted(() => ({
  task: {
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

const { GET, PUT, DELETE } = await import("@/app/api/tasks/[id]/route");

function createRequest(
  method: string,
  options: { userId?: string; body?: Record<string, unknown> } = {}
) {
  const headers = new Headers();
  if (options.userId) {
    headers.set("x-user-id", options.userId);
  }

  const init: RequestInit = { method, headers };
  if (options.body) {
    init.body = JSON.stringify(options.body);
  }

  return new NextRequest("http://localhost:3000/api/tasks/task-1", init);
}

const routeContext = { params: Promise.resolve({ id: "task-1" }) };

describe("GET /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when x-user-id is missing", async () => {
    const req = createRequest("GET");
    const res = await GET(req, routeContext);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 404 when task not found", async () => {
    mockPrisma.task.findFirst.mockResolvedValue(null);
    const req = createRequest("GET", { userId: "user-1" });
    const res = await GET(req, routeContext);
    expect(res.status).toBe(404);
  });

  it("returns task on success", async () => {
    const task = { id: "task-1", title: "Test", labels: [] };
    mockPrisma.task.findFirst.mockResolvedValue(task);
    const req = createRequest("GET", { userId: "user-1" });
    const res = await GET(req, routeContext);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.task).toEqual(task);
  });
});

describe("PUT /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when x-user-id is missing", async () => {
    const req = createRequest("PUT", { body: { title: "New" } });
    const res = await PUT(req, routeContext);
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    mockPrisma.task.findFirst.mockResolvedValue(null);
    const req = createRequest("PUT", {
      userId: "user-1",
      body: { title: "New" },
    });
    const res = await PUT(req, routeContext);
    expect(res.status).toBe(404);
  });

  it("updates and returns the task", async () => {
    const existing = { id: "task-1", title: "Old" };
    const updated = { id: "task-1", title: "New", labels: [] };
    mockPrisma.task.findFirst.mockResolvedValue(existing);
    mockPrisma.task.update.mockResolvedValue(updated);

    const req = createRequest("PUT", {
      userId: "user-1",
      body: { title: "New" },
    });
    const res = await PUT(req, routeContext);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.task.title).toBe("New");
  });
});

describe("DELETE /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when x-user-id is missing", async () => {
    const req = createRequest("DELETE");
    const res = await DELETE(req, routeContext);
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    mockPrisma.task.findFirst.mockResolvedValue(null);
    const req = createRequest("DELETE", { userId: "user-1" });
    const res = await DELETE(req, routeContext);
    expect(res.status).toBe(404);
  });

  it("deletes and returns success", async () => {
    mockPrisma.task.findFirst.mockResolvedValue({ id: "task-1" });
    mockPrisma.task.delete.mockResolvedValue({ id: "task-1" });

    const req = createRequest("DELETE", { userId: "user-1" });
    const res = await DELETE(req, routeContext);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
