import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getRecordList = ({ userId, pageSize, curPageNum, userType, table, opType, startTime, endTime }) => {
  return request({
    url: 'record/list',
    data: { userId, pageSize, curPageNum, userType, table, opType, startTime, endTime },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getRecordCount = ({ userId, userType, table, opType, startTime, endTime }) => {
  return request({
    url: 'record/count',
    data: { userId, userType, table, opType, startTime, endTime },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
