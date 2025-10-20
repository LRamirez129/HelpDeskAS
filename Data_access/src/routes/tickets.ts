import { Router } from "express";
import { authRequired, rbac } from "../auth/middleware";
import { ListTicketsQuerySchema, TicketIdParamSchema } from "../schemas/tickets";
import { listTickets } from "../dao/ticketsRead";
import { getTicketDetail } from "../dao/ticketsDetail";
import type { JWTPayload } from "../auth/jwt";
import { listTicketComments, listTicketAttachments } from "../dao/ticketsExtras";

const router = Router();

// Lista (con RBAC: USER/TECH/ADMIN; el DAO aplica filtros por rol)
router.get("/", authRequired, rbac("USER", "TECH", "ADMIN"), async (req, res) => {
  const parsed = ListTicketsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Parámetros inválidos", details: parsed.error.flatten() });
  }

  const viewer = (req as any).user as JWTPayload;
  const data = await listTickets(parsed.data, viewer);
  return res.json({ ok: true, ...data });
});

// Detalle
router.get("/:id", authRequired, async (req, res) => {
  const parse = TicketIdParamSchema.safeParse(req.params);
  if (!parse.success) return res.status(400).json({ error: "Parámetro inválido" });

  const { id } = parse.data;
  const viewer = (req as any).user as JWTPayload;

  try {
    const ticket = await getTicketDetail(id, viewer);
    if (!ticket) return res.status(404).json({ error: "No encontrado" });

    return res.json({
      ok: true,
      ticket,
      comments: [],
      attachments: [],
      history: [],
    });
  } catch (e: any) {
    console.error("[ROUTE] GET /tickets/:id error:", e?.message || e);
    return res.status(500).json({ error: "Error interno" });
  }
});

router.get("/:id/comments", authRequired, async (req, res) => {
  const parse = TicketIdParamSchema.safeParse(req.params);
  if (!parse.success) return res.status(400).json({ error: "Parámetro inválido" });

  const { id } = parse.data;
  const viewer = (req as any).user;

  try {
    const comments = await listTicketComments(id);
    return res.json({ ok: true, items: comments });
  } catch (e: any) {
    /*if (e?.status === 403) return res.status(403).json({ error: "Prohibido" });
    console.error("[ROUTE] GET /tickets/:id/comments error:", e?.message || e);*/
    console.error("[ROUTE] GET /tickets/:id/comments error:", e?.message || e);
    return res.status(500).json({ error: "Error interno" });
  }
});


router.get("/:id/attachments", authRequired, async (req, res) => {
  const parsed = TicketIdParamSchema.safeParse(req.params);
  if (!parsed.success) return res.status(400).json({ error: "Parámetro inválido" });

  const { id } = parsed.data;

  try {
    const files = await listTicketAttachments(id); // 👈 SOLO el id
    return res.json({ ok: true, attachments: files });
  } catch (e: any) {
    console.error("[ROUTE] GET /tickets/:id/attachments error:", e?.message || e);
    return res.status(500).json({ error: "Error interno" });
  }
});

export default router;
