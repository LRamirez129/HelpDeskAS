import { Router } from "express";
import bcrypt from "bcryptjs";
//import { LoginSchema } from "../schemas/auth";
import { JWTPayload, setAuthCookie, signAuthToken, clearAuthCookie } from "../auth/jwt";
import { authRequired, rbac } from "../auth/middleware";


// imports necesarios arriba del archivo:
import { z } from "zod";
import { findUserByEmail } from "../dao/users";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validación fallida", details: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  try {
    const dbUser = await findUserByEmail(email);
    if (!dbUser || dbUser.activo !== "S") return res.status(401).json({ error: "Credenciales inválidas" });    
    if (!dbUser.passHash) {
      console.warn(`[AUTH] Usuario sin PASS_HASH: ${dbUser.email}`);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, dbUser.passHash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const tokenPayload: JWTPayload = {
    sub: String(dbUser.id),
    email: dbUser.email,
    role: dbUser.role,
    };
    const token = signAuthToken(tokenPayload);
    setAuthCookie(res, token);

    // Lo que enviamos al FE (con id numérico):
    const safeUser = { id: dbUser.id, email: dbUser.email, role: dbUser.role };
    return res.json({ ok: true, user: safeUser });

    //return res.json({ ok: true, user: payload });
    } catch (e: any) {
    console.error("[AUTH] Login error:", e?.message || e);
    return res.status(500).json({ error: "Error interno" });
    }
});


// export default router;  // ← esto ya lo tienes al final del archivo


router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get("/me", authRequired, (req, res) => {
  const user = (req as any).user as JWTPayload; // lo puso el middleware al validar el JWT
  // Derivamos id desde sub (string) para el FE:
  const me = { id: Number(user.sub), email: user.email, role: user.role };
  res.json({ ok: true, user: me });
});

// Solo ADMIN
router.get("/admin-only", authRequired, rbac("ADMIN"), (_req, res) => {
  res.json({ ok: true, who: "ADMIN only" });
});

// TECH o ADMIN
router.get("/tech-or-admin", authRequired, rbac("TECH", "ADMIN"), (_req, res) => {
  res.json({ ok: true, who: "TECH or ADMIN" });
});

export default router;
