import { GroupDataDto, GroupDto } from "@reactive-resume/dto";
import { LoaderFunction, redirect } from "react-router-dom";

import { queryClient } from "@/client/libs/query-client";
import { fetchGroups } from "@/client/services/group/groups";
import { fetchResumes } from "@/client/services/resume";

export type Breadcrum = {
  id: string;
  name: string
}

export const groupLoader: LoaderFunction<GroupDto> = async ({ params }) => {
  try {
    const pathname = (params["*"])?.split("/") ?? [];
    const id = pathname[pathname.length - 1] ?? "";
    const breadcrum: Breadcrum[] = [];

    const resumes = await queryClient.fetchQuery({
      queryKey: ["resumes", id],
      queryFn: () => fetchResumes({ groupId: id }),
    });

    const groups = await queryClient.fetchQuery({
      queryKey: ["groups"],
      queryFn: () => fetchGroups(),
    });

    const nest = (array: GroupDataDto[]): GroupDataDto[] => {
      return array.map(v => {

        pathname.forEach(path => {
          if (path === v.group.id) breadcrum.push({ id: v.groupId, name: v.group.name })
        })

        if (v.groupId === id) {
          return v.children
        }
        return nest(v.children as GroupDataDto[])
      }).flat() as GroupDataDto[]
    }

    return { resumes, groups: nest(groups), breadcrum };
  } catch (error) {
    return redirect("/dashboard");
  }
};
