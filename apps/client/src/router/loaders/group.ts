import { GroupDto } from "@reactive-resume/dto";
import { LoaderFunction, redirect } from "react-router-dom";

import { queryClient } from "@/client/libs/query-client";
import { fetchGroups } from "@/client/services/group/groups";
import { fetchResumes } from "@/client/services/resume";

export const groupLoader: LoaderFunction<GroupDto> = async ({ params }) => {
  try {
    const pathname = (params["*"])?.split("/") ?? [];
    const id = pathname[pathname.length - 1] ?? "";

    const resumes = await queryClient.fetchQuery({
      queryKey: ["resumes"],
      queryFn: () => fetchResumes({ groupId: id }),
    });

    const groups = await queryClient.fetchQuery({
      queryKey: ["groups"],
      queryFn: () => fetchGroups(),
    });

    const filterGroups = groups.filter(v => v.groupId === id)

    return { resumes, filterGroups };
  } catch (error) {
    return redirect("/dashboard");
  }
};
