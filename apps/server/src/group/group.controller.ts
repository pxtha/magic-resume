import { User } from "@/server/user/decorators/user.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";
import { CreateGroupDto, UpdateGroupDto } from "@reactive-resume/dto";

import { ErrorMessage } from "@reactive-resume/utils";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { GroupService } from "./group.service";

@ApiTags("Group")
@Controller("group")
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) { }

  @Get("/default")
  @UseGuards(TwoFactorGuard)
  findDefault(@User("id") id: string) {
    return this.groupService.findGroupDefault(id);
  }

  @Get()
  @UseGuards(TwoFactorGuard)
  findAllByUserId(@User("id") id: string) {
    return this.groupService.findAllByUserId(id);
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async createNewGroup(@User() user: UserEntity, @Body() createGroupDto: CreateGroupDto) {
    try {
      if (user.userPlus) {
        return await this.groupService.create(user.id, createGroupDto)
      }
      return new InternalServerErrorException(ErrorMessage.InvalidUserPlus)
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(":id")
  async updateGroup(
    @Param("id") id: string,
    @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto)
  }

  @Delete(":id")
  async removeGroup(@Param("id") id: string,) {
    return this.groupService.remove(id)
  }
}
