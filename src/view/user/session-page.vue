<template>
  <div>
    <div class="search-con search-con-top">
      <label>&nbsp;&nbsp;Token:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="Token"
             class="search-input"
             v-model="search.token" />
      <label>&nbsp;&nbsp;UserId:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="userId"
             class="search-input"
             v-model="search.userId" />
      <label>&nbsp;&nbsp;账号:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="account"
             class="search-input"
             v-model="search.account" />
      <label>&nbsp;&nbsp;platformId:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="platformId"
             class="search-input"
             v-model="search.platformId" />
      <label>&nbsp;&nbsp;请求来源:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="请求来源"
             class="search-input"
             v-model="search.requestSource" />
      <label>&nbsp;&nbsp;创建时间:&nbsp;&nbsp;</label>
      <DatePicker type="datetime"
                  placeholder="创建起始时间"
                  :value="search.startTime"
                  @on-change="search.startTime=$event"
                  style="width: 180px"></DatePicker>
      ~
      <DatePicker type="datetime"
                  placeholder="创建结束时间"
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
                slot="expireIndex">
        {{new Date(row.expireIndex).toLocaleString()}}
      </template>
      <template slot-scope="{ row, index }"
                slot="action">
        <Button type="primary"
                style="margin-right: 10px"
                @click="sessionView(index)">查看详情</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该Session吗"
                @on-ok="deleteSession(index)">
          <Button type="error">删除</Button>
        </Poptip>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total"
              :current="curPageNum"
              :page-size="pageSize"
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
import { deleteSession, getSessionList, getSessionCount } from '@/api/session'
import expandRow from './table-expand.vue'

export default {
  components: { expandRow },

  data () {
    return {
      loading: true,
      tableData: [],
      tableColumns: [
        {
          type: 'expand',
          width: 60,
          title: '详情',
          align: 'center',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                userInfo: params.row
              }
            })
          }
        },
        {
          title: 'token',
          align: 'center',
          key: 'token',
          width: 290
        },

        {
          title: 'userId',
          align: 'center',
          key: 'userId',
          width: 250
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          width: 150
        },
        {
          title: '平台ID',
          align: 'center',
          key: 'platformId',
          searchable: true,
          width: 250
        },
        {
          title: '权限等级',
          align: 'center',
          key: 'powerLevel',
          searchable: true,
          width: 100
        },
        {
          title: '请求来源',
          align: 'center',
          key: 'requestSource',
          searchable: true,
          width: 100
        },
        {
          title: '过期时间',
          align: 'center',
          slot: 'expireIndex',
          width: 180
        },
        {
          title: '操作',
          key: 'option',
          slot: 'action',
          width: 280,
          align: 'center'
        }
      ],
      total: 0,
      curPageNum: 1,
      pageSize: 10,
      value: false,
      search: {}
    }
  },
  computed: {
  },
  methods: {
    getSearchArgs () {
      this.search.primary = true
      this.search.curPageNum = this.curPageNum
      this.search.pageSize = this.pageSize
      console.log(this.search)
      return this.search
    },
    getSessionList () {
      this.loading = true

      return getSessionList(this.getSearchArgs()).then(res => {
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
    getSessionCount () {
      return getSessionCount(this.getSearchArgs()).then(res => {
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
      this.pageSize = pageSize
      this.getSessionList()
    },

    changePageIndex (curPageNum) {
      this.curPageNum = curPageNum

      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.getSessionList()
    },
    // session查看
    sessionView (index) {
      // todo
      // 不加这个  下面的 modal 的render只会在第一次被调用， 后面都用缓存了， 不懂是不是bug
      // 但加了这个， 他remove好像有做动画效果， 需要时间， 如果在remove期间， 新的modal出来了， 又会被remove最后调用 的hide给hide住了，
      // remove经测试大概 350ms， 所以做下小优化
      this.$Modal.remove()
      let constDelayMs = 350
      let startTime = Date.now()
      this.loading = true
      let token = this.tableData[index].token
      getSessionList({ token: token, primary: false }).then(res => {
        this.loading = false
        let data = res.data
        if (data.errcode === '0') {
          data = data.object

          if (data.length > 0) {
            // 解决上面 modal remove后的bug
            let delay = Date.now() - startTime
            // console.log(startTime, delay)
            if (delay < constDelayMs) {
              delay = constDelayMs - delay
            } else {
              delay = 0
            }

            setTimeout(() => {
              this.$Modal.success({
                title: 'session信息查看',
                render: (h) => {
                  // todo
                  // 这边会被执行两次， 不懂为什么重复渲染了， 留着这个
                  // console.log('aa')
                  return h('div', { 'style': { 'max-height': '600px', 'overflow-y': 'auto' } }, [h('pre', {}, JSON.stringify(data[0], null, 4))]
                  )
                },

                width: '1000',
                scrollable: true,
                closable: true
              })
            }, delay)
          } else {
            this.$Message.error('没有数据')
          }
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    deleteSession (index) {
      let token = this.tableData[index].token

      deleteSession({ token }).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.fetchData()
          this.$Message.info('删除成功')
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },

    fetchData () {
      return Promise.all([this.getSessionCount(), this.getSessionList()]).then(() => {

      })
    },
    handleClear () {

    },

    handleSearch () {
      this.fetchData()
    }
  },
  mounted () {
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
      width: 150px;
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
