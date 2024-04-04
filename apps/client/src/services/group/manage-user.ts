import { GroupDataDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { useMemo } from "react";
import dayjs from "dayjs";

export const userInGroup = async () => {
  const response = await axios.get<GroupDataDto[], AxiosResponse<GroupDataDto[]>>("/group/manage-user");

  return response.data;
};

export const useUserInGroup = () => {
  const {
    error,
    isPending: loading,
    data: users,
  } = useQuery({
    queryKey: ["user-group"],
    queryFn: userInGroup,
  });

  const data = useMemo(() => {
    if (!users) return []
    return users.map(v => (
      {
        id: v.groupId,
        name: v.group.name,
        email: v.email,
        joinedAt: dayjs().to(v.createdAt)
      }
    ))
  }, [users])

  return { users: data, loading, error };
};