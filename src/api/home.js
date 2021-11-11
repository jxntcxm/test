import request from '@/libs/api.request'

import { getToken } from '@/libs/util'
//
export const getHomeArgs = () => {
  return request({
    url: 'admin/homeArgs',
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

export const getConfig = () => {
  return request({
    url: 'admin/config',
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

export const updateConfig = (config) => {
  return request({
    url: 'admin/updateConfig',
    params: {
      auth: getToken()
    },
    data: config,
    method: 'POST'
  })
}
