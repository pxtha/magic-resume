import { createZodDto } from "nestjs-zod/dto";
import { groupSchema } from "./group";

export const createGroupSchema = groupSchema.partial().pick({
  name: true,
  parentGroup: true,
});

export class CreateGroupDto extends createZodDto(createGroupSchema) { }
