import {
  Injectable
} from "@nestjs/common";
import { CreateGroupDto, UpdateGroupDto } from "@reactive-resume/dto";
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

  async findAllByUserId(userId: string) {
    const parentGroups = await this.prisma.userOnGroup.findMany({
      include: {
        group: true
      },
      where: {
        userId,
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

  async create(userId: string, createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.create({
      data: {
        name: createGroupDto.name ?? "",
        parentGroup: createGroupDto.parentGroup,
        users: {
          create: [{
            userId,
            role: "owner"
          }]
        }
      },
    });

    const found = await this.prisma.userOnGroup.findUniqueOrThrow({
      include: {
        group: true
      },
      where: {
        userId_groupId: {
          groupId: group.id,
          userId
        }
      },
    });

    return this.nest([found], get(found, "group.parentGroup" as string))[0];
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
    return this.prisma.group.update({
      where: {
        id
      },
      data: {
        deleteAt: new Date()
      }
    })
  }
}
