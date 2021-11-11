import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const backup = (tables) => {
  return request({
    url: 'admin/backup',
    data: { tables },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
