import { z } from "zod";
import { GeoPointSchema } from "./business.js";

export const IssueCategorySchema = z.enum([
  "street_lighting",
  "graffiti",
  "illegal_dumping",
  "road_damage",
  "other",
]);

export const IssueStatusSchema = z.enum(["open", "in_progress", "resolved"]);

export const IssueSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  category: IssueCategorySchema,
  description: z.string().min(1),
  status: IssueStatusSchema,
  location: GeoPointSchema,
  resolved_at: z.string().datetime().nullable(),
});

export type Issue = z.infer<typeof IssueSchema>;
export type IssueCategory = z.infer<typeof IssueCategorySchema>;
export type IssueStatus = z.infer<typeof IssueStatusSchema>;
export const CreateIssueSchema = IssueSchema.omit({ id: true, status: true, resolved_at: true });
export type CreateIssue = z.infer<typeof CreateIssueSchema>;
