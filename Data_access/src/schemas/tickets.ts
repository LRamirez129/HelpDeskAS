import { z } from "zod";

/**
 * Query params para listar tickets.
 *  - page/pageSize: paginación
 *  - estadoFinal: 'S' | 'N' | null -> si null, no filtra por finalizados
 *  - search/categoria/subcategoria/tecnico: filtros (opcionales, los iremos usando)
 */
export const ListTicketsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  estadoFinal: z.enum(['S','N']).optional(),
  search: z.string().trim().min(1).optional(),
  categoria: z.string().trim().min(1).optional(),
  subcategoria: z.string().trim().min(1).optional(),
  tecnico: z.string().trim().min(1).optional(),
});

export type ListTicketsQuery = z.infer<typeof ListTicketsQuerySchema>;

export const TicketIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export type TicketIdParam = z.infer<typeof TicketIdParamSchema>;

