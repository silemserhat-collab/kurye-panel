const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Kurye Panel API çalışıyor!" });
});

// ── CUSTOMERS ──
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: { addresses: true }
    });
    res.json(customers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/customers", async (req, res) => {
  try {
    const customer = await prisma.customer.create({ data: req.body });
    res.json(customer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: { orders: true, addresses: true, conversations: true }
    });
    res.json(customer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── ORDERS ──
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true }
    });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const count = await prisma.order.count();
    const orderNo = `#${String(250000 + count + 1)}`;
    const order = await prisma.order.create({
      data: { ...req.body, orderNo }
    });
    io.emit("new_order", order);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: req.body
    });
    io.emit("order_updated", order);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── CONVERSATIONS ──
app.get("/api/conversations", async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      include: { customer: true, messages: { orderBy: { sentAt: "asc" }, take: 1 } }
    });
    res.json(conversations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { sentAt: "asc" }
    });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/conversations/:id/messages", async (req, res) => {
  try {
    const message = await prisma.message.create({
      data: { ...req.body, conversationId: req.params.id }
    });
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: new Date() }
    });
    io.emit("new_message", message);
    res.json(message);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── SOCKET.IO ──
io.on("connection", (socket) => {
  console.log("Kullanıcı bağlandı:", socket.id);
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Kurye Panel API ${PORT} portunda çalışıyor`);
});