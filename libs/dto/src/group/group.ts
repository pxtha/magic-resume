import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>
}>

export const groupSchema = z.object({
  id: idSchema,
  name: z.string().min(3).max(255),
  parentGroup: z.string().nullable(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
  deleteAt: z.date().or(z.dateString()).nullable(),
});

export class GroupDto extends createZodDto(groupSchema) { }

// Schema
export const groupBaseDataSchema = z.object({
  role: z.enum(["owner", "admin", "user"]).default("user"),
  email: z.string(),
  groupId: idSchema,
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
  group: groupSchema,
}).deepPartial();


type GroupBase = z.infer<typeof groupBaseDataSchema> & {
  children: GroupBase[];
};

export const groupDataSchema: z.ZodType<GroupBase> = groupBaseDataSchema.extend({
  children: z.lazy(() => groupDataSchema.array()),
});

export class GroupDataSchemaDto extends createZodDto(groupDataSchema) { }
export type GroupDataDto = DeepRequired<GroupDataSchemaDto>
