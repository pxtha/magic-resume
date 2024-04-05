import { createZodDto } from "nestjs-zod/dto";

import { groupSchema } from "./group";

export const deleteGroupSchema = groupSchema.partial().pick({
  id: true
});

export class DeleteGroupDto extends createZodDto(deleteGroupSchema) {}
