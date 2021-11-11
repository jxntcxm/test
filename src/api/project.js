import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getProjectList = ({ name, pageSize, curPageNum, primary }) => {
  return request({
    url: 'project/list',
    data: { name, pageSize, curPageNum, primary },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getProjectCount = ({ name }) => {
  return request({
    url: 'project/count',
    data: { name },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const addProject = (projectInfo) => {
  return request({
    url: 'project/add',
    params: {
      auth: getToken()
    },
    data: projectInfo,
    method: 'post'
  })
}

export const updateProject = (projectInfo) => {
  return request({
    url: 'project/update',
    params: {
      auth: getToken()
    },
    data: projectInfo,
    method: 'post'
  })
}

export const deleteProject = (name) => {
  return request({
    url: 'project/delete',
    params: {
      auth: getToken()
    },
    data: { name },
    method: 'post'
  })
}
