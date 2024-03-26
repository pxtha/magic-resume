import { ResumeDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

export const fetchResumes = async (data: { groupId?: string }) => {
  let response;

  if (data.groupId) {
    response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>(`/resume?groupId=${data.groupId}`);
  }
  else {
    response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>(`/resume`);
  }

  return response.data;
};

export const useResumes = (groupId?: string) => {
  const {
    error,
    isPending: loading,
    refetch,
    data: resumes,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => fetchResumes({ groupId }),
    
  });

  return { resumes, loading, error, refetch };
};
