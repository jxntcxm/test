<template>
  <div>
    <div class="search-con search-con-top">
      <label>&nbsp;&nbsp;用户ID:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="用户ID"
             class="search-input"
             v-model="search.userId" />
      <label>&nbsp;&nbsp;微服务:&nbsp;&nbsp;</label>
      <Select v-model="search.appDomain"
              placeholder="全部"
              class="search-input">
        <Option :value="''">全部</Option>
        <Option :value="appInfo.domain"
                :key="key"
                v-for="(appInfo,key) in appInfoArray">{{appInfo.domain}}</Option>
      </Select>
      <label>&nbsp;&nbsp;平台ID:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="用户ID"
             class="search-input"
             v-model="search.platformId" />
      <label>&nbsp;&nbsp;命名空间:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="用户ID"
             class="search-input"
             v-model="search.space" />
      <label>&nbsp;&nbsp;操作时间:&nbsp;&nbsp;</label>

      <DatePicker type="datetime"
                  placeholder="操作起始时间"
                  :value="search.startTime"
                  @on-change="search.startTime=$event"
                  style="width: 180px"></DatePicker>
      ~
      <DatePicker type="datetime"
                  placeholder="操作结束时间"
                  :value="search.endTime"
                  @on-change="search.endTime=$event"
                  style="width: 180px"></DatePicker>
      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>

    </div>

    <Table :data="tableData"
           height="550"
           :loading="loading"
           :columns="tableColumns"
           stripe
           border>
      <template slot-scope="{ row }"
                slot="authUrl">
        {{row.appDomain+row.authUrl }}

      </template>

    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total"
              :current="search.curPageNum"
              :page-size="search.pageSize"
              show-total
              show-elevator
              show-sizer
              transfer
              @on-page-size-change="changePageSize"
              @on-change="changePageIndex"></Page>
      </div>
    </div>

  </div>
</template>
<script>
import { getAuthFailList, getAuthFailCount } from '@/api/auth'
import { getAppListPrimary } from '@/api/appInfo'
import expandRow from './table-expand.vue'

export default {
  components: { expandRow },

  data () {
    return {
      loading: true,
      tableData: [],
      opAction: '',
      tableColumns: [
        {
          type: 'expand',
          width: 60,
          title: '详情',
          align: 'center',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                record: params.row
              }
            })
          }
        },
        {
          title: '插入时间',
          align: 'center',
          key: 'createTime',
          width: 150
        },
        {
          title: '鉴权路径',
          slot: 'authUrl',
          width: 250
        },
        {
          title: '命名空间',
          key: 'space',
          width: 200
        },
        {
          title: '用户ID',
          align: 'center',
          key: 'userId',
          width: 250
        },
        {
          title: '平台ID',
          align: 'center',
          key: 'platformID',
          width: 250
        },

        {
          title: '请求来源',
          key: 'requestSource',
          width: 100
        },

        {
          title: 'Token',
          key: 'token'

        }
      ],
      total: 0,

      search: {
        pageSize: 10,
        curPageNum: 1,
        userId: '',
        userType: '',
        table: '',
        opType: '',
        startTime: '',
        endTime: ''
      },
      appInfoArray: []
    }
  },
  methods: {

    getRecordDesc (record) {
      let desc = ``

      let id
      let arrName = 'id'
      if (record.table === 'user') {
        arrName = 'userId'
      } else if (record.table === 'appInfo') {
        arrName = 'key'
      } else if (record.table === 'platform') {
        arrName = 'platformId'
      }

      switch (record.opType) {
        case 'add':
          id = record.content[arrName]
          break
        case 'delete':
          id = (record.content[arrName] && record.content[arrName].$in && record.content[arrName].$in[0]) || record.content[arrName]
          break
        case 'update':
          id = record.content.query[arrName]
      }
      desc += ` id:${id}`
      return desc
    },

    getSearch () {
      let search = this.search
      search.table = ''
      search.opType = ''
      if (this.opAction !== '') {
        let split = this.opAction.split('-')
        search.opType = split[0]
        search.table = split[1]
      }
      return search
    },

    getAuthFailList () {
      this.loading = true

      return getAuthFailList(this.getSearch()).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object
          this.tableData = data
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    getAuthFailCount () {
      return getAuthFailCount(this.getSearch()).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          data = data.object
          this.total = data.count
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },

    changePageSize (pageSize) {
      this.search.pageSize = pageSize
      this.getAuthFailList()
    },

    changePageIndex (curPageNum) {
      this.search.curPageNum = curPageNum
      this.getAuthFailList()
    },

    fetchData () {
      return Promise.all([this.getAuthFailCount(), this.getAuthFailList()]).then(() => {

      })
    },
    handleClear () {

    },

    handleSearch () {
      this.fetchData()
    }
  },
  computed: {
    opTypeMap () {
      let m = {}
      for (let opTypeKey in this.opTypeDesc) {
        for (let tableKey in this.tableDesc) {
          m[opTypeKey + '-' + tableKey] = this.opTypeDesc[opTypeKey] + '-' + this.tableDesc[tableKey]
        }
      }

      return m
    }
  },
  mounted () {
    getAppListPrimary().then(res => {
      let data = res.data
      if (data.errcode === '0') {
        data = data.object
        this.appInfoArray = data
      } else {
        this.$Message.error(data.errmsg)
      }
    }).catch(e => {
      this.$Message.error(e.toString())
    })
    return this.fetchData()
  }
}
</script>
<style  lang="less">
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 100px;
    }

    &-status {
      display: inline-block;
      width: 100px;
      margin-left: 2px;
    }
    &-input {
      display: inline-block;
      width: 130px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 5px;
    }
  }
  .new-btn {
    margin-left: 5px;
  }
}
</style>
