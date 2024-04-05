import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { DeleteGroupDto, GroupDataDto, GroupDto } from "@reactive-resume/dto";
import { GROUPS_KEY } from "@/client/constants/query-keys";

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

      queryClient.invalidateQueries({ queryKey: GROUPS_KEY })
    },
  });

  return { deleteGroup: deleteGroupFn, loading, error };
};
