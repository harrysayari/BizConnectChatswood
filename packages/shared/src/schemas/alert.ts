import { z } from "zod";

export const GeoPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

export const AlertSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  polygon: GeoPolygonSchema,
  sent_at: z.string().datetime().nullable(),
  created_by: z.string().uuid().nullable(),
});

export type Alert = z.infer<typeof AlertSchema>;
export const CreateAlertSchema = AlertSchema.omit({ id: true, sent_at: true });
export type CreateAlert = z.infer<typeof CreateAlertSchema>;
