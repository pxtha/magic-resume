import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { DeleteGroupDto, GroupDataDto, GroupDto } from "@reactive-resume/dto";

export const deleteGroup = async (data: DeleteGroupDto) => {
  const response = await axios.delete<GroupDto, AxiosResponse<GroupDto>, DeleteGroupDto>(
    `/group/${data.id}`,
  );

  return response.data;
};

export const useDeleteGroup = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteGroupFn,
  } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["group", data.id] });

      queryClient.setQueryData<GroupDataDto[]>(["groups"], (cache) => {
        if (!cache) return [];
        return cache.filter((value) => value.groupId !== data.id);
      });
    },
  });

  return { deleteGroup: deleteGroupFn, loading, error };
};
