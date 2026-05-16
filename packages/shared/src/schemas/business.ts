import { z } from "zod";

export const GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().regex(/^\+\d{7,15}$/, "Phone must be E.164 format (e.g. +61400000000)"),
  address: z.string().min(1),
  location: GeoPointSchema,
  trading_hours: z.record(z.string()).optional(),
  services: z.array(z.string()),
  verified_at: z.string().datetime().nullable(),
  last_heartbeat_at: z.string().datetime().nullable(),
});

export type Business = z.infer<typeof BusinessSchema>;
export const UpdateBusinessSchema = BusinessSchema
  .partial()
  .omit({ id: true, verified_at: true, last_heartbeat_at: true })
  .refine((b) => Object.keys(b).length > 0, { message: "Body must contain at least one field" });
export type UpdateBusiness = z.infer<typeof UpdateBusinessSchema>;
