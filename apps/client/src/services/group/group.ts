import { GroupDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { GROUP_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchGroupDefault = async () => {
  const response = await axios.get<GroupDto, AxiosResponse<GroupDto>>("/group/default");

  return response.data;
};

export const useGroup = () => {
  const {
    error,
    isPending: loading,
    data: group,
  } = useQuery({
    queryKey: GROUP_KEY,
    queryFn: fetchGroupDefault,
  });

  return { group, loading, error };
};
