import { GroupDataDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { GROUPS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchGroups = async () => {
  const response = await axios.get<GroupDataDto[], AxiosResponse<GroupDataDto[]>>("/group");

  return response.data;
};

export const useGroups = () => {
  const {
    error,
    isPending: loading,
    data: groups,
  } = useQuery({
    queryKey: GROUPS_KEY,
    queryFn: fetchGroups,
  });

  return { groups, loading, error };
};

export const fetchAllGroups = async () => {
  const response = await axios.get<GroupDataDto[], AxiosResponse<GroupDataDto[]>>("/group/all");

  return response.data;
};

export const useAllGroups = () => {
  const {
    error,
    isPending: loading,
    data: groups,
  } = useQuery({
    queryKey: GROUPS_KEY.concat("all"),
    queryFn: fetchAllGroups,
  });

  return { groups, loading, error };
};
