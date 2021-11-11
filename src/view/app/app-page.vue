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

      </Select>
      <Select v-model="searchArgs.key"
              class="search-col">
        <Option v-for="item in tableColumns"
                v-if="item.searchable"
                :value="item.searchKey || item.key"
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

      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>

      <Button @click="addAppInfo()"
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
                  @on-change="prohibitApp(row)"
                  :value="row.status===1">
          <span slot="open">正常</span>
          <span slot="close">禁用</span>
        </i-switch>

      </template>
      <template slot-scope="{ row }"
                slot="secret">

        <Button type="primary"
                style="margin-right: 10px"
                @click="lookSecret(row)">查看密钥</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定重置密钥吗"
                @on-ok="resetSecret(row)">
          <Button type="error"
                  style="margin-right: 10px">重置密钥</Button>
        </Poptip>

      </template>
      <template slot-scope="{ row, index }"
                slot="action">
        <Button type="primary"
                style="margin-right: 10px"
                @click="editAppBaseInfo(index)">基础</Button>
        <Button type="warning"
                style="margin-right: 10px"
                @click="editAppPowerInfo(index,'apiTree')">接口权限</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该App吗"
                @on-ok="deleteApp(index)">
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

    <AppBaseConfig v-model="showBaseConfigWindows"
                   @commitSuccess="commitSuccess"
                   :tempAppInfo="modifyAppInfo"></AppBaseConfig>
    <AppPowerTree v-model="showPowerConfigWindows"
                  @commitSuccess="commitSuccess"
                  :appInfo="modifyAppInfo"
                  :attribute="attribute"></AppPowerTree>

  </div>
</template>
<script>
import { getAppList, getAppCount, prohibitApp, deleteApp, resetSecret, getSecret } from '@/api/appInfo'
import expandRow from './table-expand.vue'
import AppBaseConfig from './app-base-config.vue'
import AppPowerTree from './app-power-tree.vue'
import gd from '@/config/gd'
export default {
  components: { expandRow, AppBaseConfig, AppPowerTree },

  data () {
    return {
      loading: true,
      gd: gd,
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
                appInfo: params.row
              }
            })
          }
        },
        {
          title: '平台',
          align: 'center',
          key: 'project',
          width: 150
        },
        {
          title: 'Key',
          align: 'center',
          key: 'key',
          searchable: true,
          width: 250
        },
        {
          width: 100,
          title: '状态',
          align: 'center',
          slot: 'status'
        },
        {

          title: '名称',
          align: 'center',
          key: 'name',
          searchable: true,
          minWidth: 200
        },
        {
          minWidth: 220,
          title: '访问标识',
          align: 'center',
          key: 'domain',
          searchable: true,
          searchKey: 'appDomain'
        },

        {

          title: '操作',
          key: 'option',
          slot: 'action',
          width: 250,
          align: 'center'
        },
        {
          width: 300,
          title: '密钥操作',
          align: 'center',
          slot: 'secret'
        }
      ],
      total: 0,

      showBaseConfigWindows: false,
      showPowerConfigWindows: false,

      searchArgs: {
        key: 'key',
        value: '',
        status: 0,
        allowAll: 0,
        startTime: null,
        endTime: null,
        curPageNum: 1,
        pageSize: 10,
        project: gd.projectArray[0].name
      },

      modifyAppInfo: {},
      attribute: 'apiTree'
    }
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
      if (this.searchArgs.project) {
        args.project = this.searchArgs.project
      }

      return args
    },
    getAppList () {
      this.loading = true

      return getAppList(this.getSearchArgs()).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object
          this.tableData = data || []

          let calcFatherLine = (tree, fatherLine = []) => {
            tree.fatherLine = JSON.parse(JSON.stringify(fatherLine))
            tree.fatherLine.push(tree.id)

            for (let id in tree.children) {
              let child = tree.children[id]
              calcFatherLine(child, tree.fatherLine)
            }
          }

          this.tableData.forEach(appInfo => {
            if (appInfo.apiTree) {
              for (let id in appInfo.apiTree) {
                let tree = appInfo.apiTree[id]
                calcFatherLine(tree)
              }
            }
            if (appInfo.uiTree) {
              for (let id in appInfo.uiTree) {
                let tree = appInfo.uiTree[id]
                calcFatherLine(tree)
              }
            }
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    getAppCount () {
      return getAppCount(this.getSearchArgs()).then(res => {
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
      this.getAppList()
    },
    addAppInfo () {
      this.showBaseConfigWindows = true
      this.modifyAppInfo = { authInfo: {} }
    },
    editAppBaseInfo (index) {
      this.modifyAppInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showBaseConfigWindows = true
    },

    editAppPowerInfo (index, attribute) {
      this.modifyAppInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showPowerConfigWindows = true
      this.attribute = attribute
    },
    changePageIndex (curPageNum) {
      this.searchArgs.curPageNum = curPageNum

      this.getAppList()
    },

    lookSecret (appInfo) {
      let key = appInfo.key

      getSecret(key).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          const title = '获取密钥成功'
          const content = `<p>${data.object.secret}</p>`
          this.$Modal.success({
            title: title,
            content: content
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },
    resetSecret (appInfo) {
      var ok = true
      if (ok) {
        alert('为了开发环境、测试环境、生产环境一致， 这边暂不支持重置， 有需求找管理员')
        return
      }
      let key = appInfo.key

      resetSecret(key).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          const title = '重置密钥成功'
          const content = `<p>${data.object.secret}</p>`
          this.$Modal.success({
            title: title,
            content: content
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },
    prohibitApp (appInfo) {
      let key = appInfo.key
      let status = appInfo.status
      status = status === 1 ? 0 : 1

      appInfo.statusCommiting = true
      prohibitApp(key, status).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          appInfo.status = status
          this.$Message.info('修改成功')
          appInfo.statusCommiting = false
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },
    deleteApp (index) {
      let key = this.tableData[index].key
      deleteApp(key).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.$Message.info('删除成功')
          this.fetchData()
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },

    fetchData () {
      return Promise.all([this.getAppCount(), this.getAppList()]).then(() => {

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
      width: 200px;
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
