import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const groupSchema = z.object({
  id: idSchema,
  name: z.string().min(3).max(255),
  parentGroup: z.string().nullable(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
  deleteAt: z.date().or(z.dateString()).nullable(),
});

export class GroupDto extends createZodDto(groupSchema) { }
