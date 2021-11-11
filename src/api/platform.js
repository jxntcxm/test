import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getPlatformInfo = (platformId) => {
  return request({
    url: 'platform/info',
    params: {
      auth: getToken()
    },
    data: { platformId },
    method: 'POST'
  })
}
export const deleteUITree = ({ platformId, fatherLine }) => {
  return request({
    url: 'platform/deleteUITree',
    params: {
      auth: getToken()
    },
    data: { platformId, fatherLine },
    method: 'POST'
  })
}
export const addUITree = (platformId, fatherLine, uiTree) => {
  return request({
    url: 'platform/addUITree',
    params: {
      auth: getToken()
    },
    data: { platformId, fatherLine, uiTree },
    method: 'POST'
  })
}
export const updateUITree = (platformId, fatherLine, uiTree) => {
  return request({
    url: 'platform/updateUITree',
    params: {
      auth: getToken()
    },
    data: { platformId, fatherLine, uiTree },
    method: 'POST'
  })
}

export const getPlatformList = ({ pageSize, curPageNum, name, platformId, tag, project }) => {
  return request({
    url: 'platform/list',
    data: { pageSize, curPageNum, name, platformId, tag, project },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const getPlatformListPrimary = () => {
  return request({
    url: 'platform/list',
    data: { primary: true },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getPlatformCount = ({ name, platformId, tag, project }) => {
  return request({
    url: 'platform/count',
    data: { name, platformId, tag, project },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const addPlatform = (platformInfo) => {
  return request({
    url: 'platform/add',
    params: {
      auth: getToken()
    },
    data: platformInfo,
    method: 'post'
  })
}

export const updatePlatform = (platformInfo) => {
  return request({
    url: 'platform/updateBase',
    params: {
      auth: getToken()
    },
    data: platformInfo,
    method: 'post'
  })
}

export const deletePlatform = (platformId) => {
  return request({
    url: 'platform/delete',
    params: {
      auth: getToken()
    },
    data: { platformId },
    method: 'post'
  })
}
