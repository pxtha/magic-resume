import {
  Injectable
} from "@nestjs/common";
import { CreateGroupDto, UpdateGroupDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";



@Injectable()
export class GroupService {

  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  findAllByUserId(userId: string) {
    return this.prisma.userOnGroup.findMany({
      where: { userId },
    });
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
    const resumeInGroup = await this.prisma.resume.findFirst({
      where: {
        groupId: id
      }
    })

    if (resumeInGroup) {

      return this.prisma.group.update({
        where: {
          id
        },
        data: {
          deleteAt: new Date()
        }
      })
    }

    return this.prisma.group.delete({
      where: {
        id
      },
    })
  }
}
