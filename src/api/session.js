import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getSessionList = (args) => {
  return request({
    url: 'session/list',
    data: args,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getSessionCount = (args) => {
  return request({
    url: 'session/count',
    data: args,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const deleteSession = (args) => {
  return request({
    url: 'session/delete',
    data: args,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
