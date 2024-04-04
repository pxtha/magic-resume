import { GroupDataDto, InviteGroupDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const inviteGroup = async (payload: InviteGroupDto) => {
  const response = await axios.post<GroupDataDto, AxiosResponse<GroupDataDto>, InviteGroupDto>(
    `/group/invite`,
    payload,
  );

  return response.data;
};

export const useInviteGroup = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: inviteGroupFn,
  } = useMutation({
    mutationFn: inviteGroup,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-group"] })
    }
  });

  return { inviteGroup: inviteGroupFn, loading, error };
};