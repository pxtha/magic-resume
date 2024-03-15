import { z } from "zod";

import { defaultItem, defaultUrl, itemSchema, urlSchema } from "../shared";

// Schema
export const projectSchema = itemSchema.extend({
  name: z.string().min(1),
  description: z.string(),
  size: z.number(),
  responsibilities: z.string(),
  programmingLanguage: z.string(),
  tools: z.string(),
  date: z.string(),
  platform: z.string(),
  technologies: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()).default([]),
  url: urlSchema,
});

// Type
export type Project = z.infer<typeof projectSchema>;

// Defaults
export const defaultProject: Project = {
  ...defaultItem,
  name: "",
  description: "",
  size: 0,
  platform: "",
  programmingLanguage: "",
  responsibilities: "",
  technologies: "",
  tools: "",
  date: "",
  summary: "",
  keywords: [],
  url: defaultUrl,
};
