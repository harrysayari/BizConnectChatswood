import { z } from "zod";

export const GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  location: GeoPointSchema,
  trading_hours: z.record(z.string()).optional(),
  services: z.array(z.string()),
  verified_at: z.string().datetime().nullable(),
  last_heartbeat_at: z.string().datetime().nullable(),
});

export type Business = z.infer<typeof BusinessSchema>;
export const UpdateBusinessSchema = BusinessSchema.partial().omit({ id: true });
export type UpdateBusiness = z.infer<typeof UpdateBusinessSchema>;
