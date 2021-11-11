<template>
  <div>
    <div class="search-con search-con-top">
      <label>&nbsp;&nbsp;切换平台&nbsp;&nbsp;</label>
      <Select v-model="searchArgs.project"
              @on-change="handleSearch"
              class="search-status">
        <Option :value='item.name'
                :key="item.name"
                v-for="item in gd.projectArray">{{item.name}}</Option>

      </Select>&nbsp;&nbsp;
      <Select v-model="searchArgs.key"
              class="search-col">
        <Option v-for="item in tableColumns"
                v-if="item.searchable"
                :value="item.key"
                :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear"
             clearable
             placeholder="输入关键字搜索"
             class="search-input"
             v-model="searchArgs.value" />
      <label>&nbsp;&nbsp;状态:&nbsp;&nbsp;</label>
      <Select v-model="searchArgs.status"
              class="search-status">
        <Option :value='0'>全部</Option>
        <Option :value='1'>禁用</Option>
        <Option :value='2'>正常</Option>
      </Select>
      <label>&nbsp;&nbsp;注册时间:&nbsp;&nbsp;</label>
      <DatePicker type="datetime"
                  placeholder="注册起始时间"
                  :value="searchArgs.startTime"
                  @on-change="searchArgs.startTime=$event"
                  style="width: 180px"></DatePicker>
      ~
      <DatePicker type="datetime"
                  placeholder="注册结束时间"
                  :value="searchArgs.endTime"
                  @on-change="searchArgs.endTime=$event"
                  style="width: 180px"></DatePicker>
      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>

      <Button @click="addUserInfo()"
              class="new-btn"
              type="success">
        &nbsp;&nbsp;新增</Button>
    </div>

    <Table :data="tableData"
           height="550"
           :loading="loading"
           :columns="tableColumns"
           stripe
           border>
      <template slot-scope="{ row }"
                slot="status">

        <i-switch :loading="row.statusCommiting"
                  size="large"
                  @on-change="prohibitUser(row)"
                  :value="row.status===1">
          <span slot="open">正常</span>
          <span slot="close">禁用</span>
        </i-switch>

      </template>
      <template slot-scope="{ row, index }"
                slot="action">
        <Button type="primary"
                style="margin-right: 10px"
                @click="editUserInfo(index)">基本信息</Button>
        <Button type="primary"
                style="margin-right: 10px"
                @click="editRoleInfo(index)">角色配置</Button>
        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该User吗"
                @on-ok="deleteUser(index)">
          <Button type="error">删除</Button>
        </Poptip>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total"
              :current="searchArgs.curPageNum"
              :page-size="searchArgs.pageSize"
              show-total
              show-elevator
              show-sizer
              transfer
              @on-page-size-change="changePageSize"
              @on-change="changePageIndex"></Page>
      </div>
    </div>

    <UserInfoConfig v-model="showConfigWindows"
                    :title="`基本信息修改`"
                    :project="projectName"
                    @commitSuccess="commitSuccess"
                    :userInfo="modifyUserInfo"></UserInfoConfig>

    <RoleInfoConfig v-model="showRoleWindows"
                    :title="`角色配置`"
                    :project="projectName"
                    :roleInfo="modifyRoleInfo"></RoleInfoConfig>

  </div>
</template>
<script>
import { getUserList, getUserCount, prohibitUser, deleteUser } from '@/api/user'
import expandRow from './table-expand.vue'
import gd from '@/config/gd'
import UserInfoConfig from './user-info-config.vue'
import RoleInfoConfig from './role-info-config.vue'
export default {
  components: { expandRow, UserInfoConfig, RoleInfoConfig },

  data () {
    return {
      gd: gd,
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
          title: '平台',
          align: 'center',
          key: 'project',
          minWidth: 100
        },
        {
          title: '用户ID',
          align: 'center',
          key: 'userId',
          searchable: true,
          width: 250
        },
        {
          width: 100,
          title: '状态',
          align: 'center',
          key: 'status',
          slot: 'status'
        },
        {
          title: '账号',
          align: 'center',
          key: 'account',
          searchable: true,
          minWidth: 100
        },
        {
          title: '名称',
          align: 'center',
          key: 'name',
          searchable: true,
          minWidth: 100
        },
        {
          title: '权限等级',
          align: 'center',
          key: 'powerLevel',
          searchable: true,
          width: 100
        },
        {
          title: '账号组',
          align: 'center',
          key: 'group',
          searchable: true,
          width: 100
        },
        {
          title: '手机',
          align: 'center',
          key: 'phone',
          searchable: true,
          width: 120
        },
        {
          title: '注册时间',
          align: 'center',
          key: 'regTime',
          width: 150
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

      showConfigWindows: false,
      showRoleWindows: false,

      searchArgs: {
        key: 'name',
        value: '',
        status: 0,
        startTime: null,
        endTime: null,
        curPageNum: 1,
        pageSize: 10,
        project: gd.projectArray[0].name
      },

      projectName: gd.projectArray[0].name,

      modifyUserInfo: {},
      modifyRoleInfo: {}
    }
  },
  computed: {
  },
  methods: {
    getSearchArgs () {
      let args = {
        pageSize: this.searchArgs.pageSize,
        curPageNum: this.searchArgs.curPageNum
      }

      if (this.searchArgs.value !== '') {
        args[this.searchArgs.key] = this.searchArgs.value
      }

      if (this.searchArgs.status === 1) {
        args.status = 0
      } else if (this.searchArgs.status === 2) {
        args.status = 1
      }
      if (this.searchArgs.startTime) {
        args.startTime = this.searchArgs.startTime
      }

      if (this.searchArgs.endTime) {
        args.endTime = this.searchArgs.endTime
      }
      if (this.searchArgs.project) {
        args.project = this.searchArgs.project
      }

      return args
    },
    getUserList () {
      this.loading = true

      return getUserList(this.getSearchArgs()).then(res => {
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
    getUserCount () {
      return getUserCount(this.getSearchArgs()).then(res => {
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
      this.searchArgs.pageSize = pageSize
      this.getUserList()
    },
    addUserInfo () {
      this.projectName = this.searchArgs.project
      this.showConfigWindows = true
      this.modifyUserInfo = { authInfo: {} }
    },
    editUserInfo (index) {
      this.modifyUserInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showConfigWindows = true
    },
    editRoleInfo (index) {
      this.modifyRoleInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showRoleWindows = true
    },
    changePageIndex (curPageNum) {
      this.searchArgs.curPageNum = curPageNum

      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.getUserList()
    },
    prohibitUser (row) {
      let userId = row.userId
      let status = row.status
      status = status === 1 ? 0 : 1
      row.statusCommiting = true
      prohibitUser(userId, status).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          row.status = status
          row.statusCommiting = false
          this.$Message.info('修改成功')
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },
    deleteUser (index) {
      let userId = this.tableData[index].userId

      deleteUser(userId).then(res => {
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
      return Promise.all([this.getUserCount(), this.getUserList()]).then(() => {
        this.projectName = this.searchArgs.project
      })
    },
    handleClear () {

    },
    commitSuccess () {
      this.fetchData()
    },
    handleSearch () {
      this.searchArgs.curPageNum = 1
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
