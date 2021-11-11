import request from '@/libs/api.request'
import { getToken } from '@/libs/util'
export const getRouterReq = (access) => {
  return request({
    url: 'get_router',
    params: {
      access,
      auth: getToken()
    },
    method: 'get'
  })
}
