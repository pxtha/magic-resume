import { z } from "zod";

// import { skillSchema, defaultSkill } from "./skill";
import { defaultItem, itemSchema } from "../shared";

// Schema
export const cmcSkillSchema = itemSchema.extend({
  name: z.string(),
  description: z.string(),
  level: z.number().min(0).max(5).default(1),
  keywords: z.array(z.string()).default([]),
  levelOfKeywords: z.array(z.string()).default([])
});

export const cmcSubSkillSchema = itemSchema.extend({
  keyword: z.string(),
  levelOfKeyword: z.number().min(0).max(5).default(1),
});
// Type
export type CmcSkill = z.infer<typeof cmcSkillSchema>;
export type CmcSubSkill = z.infer<typeof cmcSubSkillSchema>;

// Defaults
export const defaultCmcSkill: CmcSkill = {
  ...defaultItem,
  name: "",
  description: "",
  level: 1,
  keywords: [],
  levelOfKeywords: []
};
export const defaultSubCmcSkill: CmcSubSkill = {
  ...defaultItem,
  keyword: "",
  levelOfKeyword: 1
};
