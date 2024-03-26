import { CreateGroupDto, GroupDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createGroup = async (data: CreateGroupDto) => {
  const response = await axios.post<GroupDto, AxiosResponse<GroupDto>, CreateGroupDto>(
    "/group",
    data,
  );

  return response.data;
};

export const useCreateGroup = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createGroupFn,
  } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.setQueryData<GroupDto>(["group", { id: data.id }], data);

      queryClient.setQueryData<GroupDto[]>(["groups"], (cache) => {
        console.log(data, cache)
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createGroup: createGroupFn, loading, error };
};
