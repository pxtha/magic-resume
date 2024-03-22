import { createZodDto } from "nestjs-zod/dto";

import { groupSchema } from "./group";

export const updateGroupSchema = groupSchema.partial().pick({
  name: true,
});

export class UpdateGroupDto extends createZodDto(updateGroupSchema) { }
