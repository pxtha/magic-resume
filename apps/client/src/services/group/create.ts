import { CreateGroupDto, GroupDataDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { GROUPS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createGroup = async (data: CreateGroupDto) => {
  const response = await axios.post<GroupDataDto, AxiosResponse<GroupDataDto>, CreateGroupDto>(
    "/group",
    data,
  );

  return response.data;
};

const updateCache = (array: GroupDataDto[], data: GroupDataDto): GroupDataDto[] => {
  const index = array.findIndex(v => v.groupId === data.group.parentGroup)
  if (index === -1) return array.map(v => (updateCache(v.children as GroupDataDto[], data))).flat();
  return array.map((v, i) => (index === i ? { ...v, children: [...v.children, data] } : v))
}

export const useCreateGroup = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createGroupFn,
  } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.setQueryData<GroupDataDto>(["group", { id: data.groupId }], data);

      queryClient.invalidateQueries({ queryKey: GROUPS_KEY })
      // queryClient.setQueryData<GroupDataDto[]>(GROUPS_KEY, (cache) => {
      //   if (!cache) return [data];

      //   if (!data.group.parentGroup)
      //     return [...cache, data];
      //   return updateCache(cache, data)
      // });
    },
  });

  return { createGroup: createGroupFn, loading, error };
};
