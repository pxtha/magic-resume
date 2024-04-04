import {
  Injectable
} from "@nestjs/common";
import { CreateGroupDto, InviteGroupDto, UpdateGroupDto, UserDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";
import get from "lodash.get";

@Injectable()
export class GroupService {

  constructor(
    private readonly prisma: PrismaService,
  ) {
  }


  nest<T>(items: T[], id = null, link = "group.parentGroup"): T[] {
    const groupKey: string = "groupId"
    return items
      .filter((item) => get(item, link) === id)
      .map((item) => ({ ...item, children: this.nest(items, get(item, groupKey)) }));
  }

  findGroupDefault(userId: string) {
    return this.prisma.group.findFirstOrThrow({
      where: {
        name: {
          equals: `default_group_${userId}`
        }
      }
    })
  }

  async findAllByUserId(userId: string, email: string) {
    const parentGroups = await this.prisma.userOnGroup.findMany({
      include: {
        group: true
      },
      where: {
        email,
        group: {
          deleteAt: null,
          NOT: {
            name: `default_group_${userId}`
          }
        }
      },
    });

    return this.nest(parentGroups)
  }

  async findAll(userId: string, email: string) {
    const groups = await this.prisma.userOnGroup.findMany({
      include: {
        group: true
      },
      where: {
        email,
        group: {
          deleteAt: null,
          NOT: {
            name: `default_group_${userId}`,
          }
        }
      },
    });

    const removedGroups = await this.prisma.group.findMany({
      where: {
        NOT: {
          deleteAt: null
        }
      }
    });

    return groups.filter(group => !removedGroups.find(v => v.id === group.group.parentGroup));
  }

  async create(email: string, createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.create({
      data: {
        name: createGroupDto.name ?? "",
        parentGroup: createGroupDto.parentGroup,
        users: {
          create: [{
            email,
            role: "owner"
          }]
        }
      },
    });
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.prisma.group.update({
      where: {
        id
      },
      data: {
        name: updateGroupDto.name,
      }
    })

    return group;
  }

  async remove(id: string) {
    return this.prisma.group.delete({
      where: {
        id
      }
    })
  }

  async inviteUser(inviteGroupDto: InviteGroupDto) {
    const { groupId, email } = inviteGroupDto;
    const found = await this.prisma.userOnGroup.findFirst({
      where: {
        groupId,
        email,
      }
    });


    if (found) {
      if (!found.deletedAt) {
        return this.prisma.userOnGroup.delete({
          where: {
            id: found.id
          },
        })
      }
      return this.prisma.userOnGroup.update({
        where: {
          id: found.id
        },
        data: {
          deletedAt: null
        }
      })
    }

    return this.prisma.userOnGroup.create({
      data: {
        groupId,
        role: "user",
        email,
      },
    });
  }

  async findUserByGroup(user: UserDto) {

    const groups = await this.findAll(user.id, user.email)

    const userOnGroup = await this.prisma.userOnGroup.findMany({
      where: {
        role: "user",
        deletedAt: null
      },
      include: { group: true }
    })

    return userOnGroup.filter(user => groups.find(group => group.groupId === user.groupId))
  }
}
