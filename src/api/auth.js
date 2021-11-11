import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getAuthFailList = (args) => {
  return request({
    url: 'auth/failList',
    data: args,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getAuthFailCount = (args) => {
  return request({
    url: 'auth/failCount',
    data: args,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
