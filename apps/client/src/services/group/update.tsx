import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GroupDto, UpdateGroupDto } from "@reactive-resume/dto";

export const updateGroup = async (data: UpdateGroupDto) => {
  const response = await axios.patch<GroupDto, AxiosResponse<GroupDto>, UpdateGroupDto>(
    `/group/${data.id}`,
    data,
  );

  queryClient.setQueryData<GroupDto>(["group", { id: response.data.id }], response.data);

  queryClient.setQueryData<GroupDto[]>(["groups"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((group) => {
      if (group.id === response.data.id) return response.data;
      return group;
    });
  });

  return response.data;
};

export const debouncedUpdateGroup = debounce(updateGroup, 500);

export const useUpdateGroup = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateGroupFn,
  } = useMutation({
    mutationFn: updateGroup,
  });

  return { updateGroup: updateGroupFn, loading, error };
};
