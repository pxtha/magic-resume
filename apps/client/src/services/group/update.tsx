import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GroupDto, UpdateGroupDto } from "@reactive-resume/dto";
import { GROUPS_KEY } from "@/client/constants/query-keys";

export const updateGroup = async (data: UpdateGroupDto) => {
  const response = await axios.patch<GroupDto, AxiosResponse<GroupDto>, UpdateGroupDto>(
    `/group/${data.id}`,
    data,
  );

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
    onSuccess(data) {
      queryClient.setQueryData<GroupDto>(["group", { id: data.id }], data);

      queryClient.invalidateQueries({ queryKey: GROUPS_KEY })
    },
  });

  return { updateGroup: updateGroupFn, loading, error };
};
