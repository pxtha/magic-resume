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
import { CreateGroupDto, InviteGroupDto, UpdateGroupDto } from "@reactive-resume/dto";

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
  findAllByUserId(@User("id") id: string, @User("email") email: string) {
    return this.groupService.findAllByUserId(id, email);
  }

  @Get("/all")
  @UseGuards(TwoFactorGuard)
  findAll(@User("id") id: string, @User("email") email: string) {
    return this.groupService.findAll(id, email);
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async createNewGroup(@User() user: UserEntity, @Body() createGroupDto: CreateGroupDto) {
    try {
      if (user.userPlus) {
        return await this.groupService.create(user.email, createGroupDto)
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
  async removeGroup(@Param("id") id: string) {
    return this.groupService.remove(id)
  }

  @Post("/invite")
  async inviteUser(@Body() inviteGroupDto: InviteGroupDto) {
    return this.groupService.inviteUser(inviteGroupDto)
  }

  @Get("/manage-user")
  @UseGuards(TwoFactorGuard)
  async findUserByGroup(@User() user: UserEntity) {
    return this.groupService.findUserByGroup(user)
  }
}
