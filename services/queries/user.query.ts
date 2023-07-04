import { useQuery } from "react-query";
import { apiUser } from "services/apiAction/apiUser";
import { IParamGetUserInfo } from "services/types/user";

export const userQuery = {
  getInfoUser: (params: IParamGetUserInfo) => {
    return useQuery({
      queryKey: ['get-info-user', params],
      queryFn: () => apiUser.getUserInfo(params).then((response) => response.data),
    })
  }
};