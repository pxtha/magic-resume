import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const inviteGroupSchema = z.object({
  groupId: z.string(),
  email: z.string()
});

export class InviteGroupDto extends createZodDto(inviteGroupSchema) { }
