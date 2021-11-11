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
      &nbsp;&nbsp;
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

      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>

      <Button @click="addPlatformInfo()"
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

      <template slot-scope="{ row, index }"
                slot="action">
        <Button type="primary"
                style="margin-right: 10px"
                @click="editPlatformBaseInfo(index)">基础</Button>

        <Button type="warning"
                style="margin-right: 10px"
                @click="editPlatformPowerInfo(index,'uiTree')">UI权限</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该Platform吗"
                @on-ok="deletePlatform(index)">
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

    <PlatformBaseConfig v-model="showBaseConfigWindows"
                        @commitSuccess="commitSuccess"
                        :tempPlatformInfo="modifyPlatformInfo"></PlatformBaseConfig>
    <PlatformPowerTree v-model="showPowerConfigWindows"
                       @commitSuccess="commitSuccess"
                       :project="projectName"
                       :platform="modifyPlatformInfo"></PlatformPowerTree>

  </div>
</template>
<script>
import { getPlatformList, getPlatformCount, deletePlatform } from '@/api/platform'
import expandRow from './table-expand.vue'
import gd from '@/config/gd'
import PlatformBaseConfig from './platform-base-config.vue'
import PlatformPowerTree from './platform-power-tree.vue'
export default {
  components: { expandRow, PlatformBaseConfig, PlatformPowerTree },

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
                platformInfo: params.row
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
          title: 'PlatformID',
          align: 'center',
          key: 'platformId',
          searchable: true,
          width: 250
        },

        {

          title: '名称',
          align: 'center',
          key: 'name',
          searchable: true
        },
        {

          title: '标识',
          align: 'center',
          key: 'tag',
          searchable: true,
          width: 120
        },
        {

          title: '操作',
          key: 'option',
          slot: 'action',
          width: 240,
          align: 'center'
        }
      ],
      total: 0,

      showBaseConfigWindows: false,
      showPowerConfigWindows: false,

      searchArgs: {
        curPageNum: 1,
        pageSize: 10,
        key: '',
        value: '',
        name: '',
        project: gd.projectArray[0].name
      },
      projectName: '',
      modifyPlatformInfo: {},
      attribute: 'uiTree'
    }
  },
  methods: {
    getSearchArgs () {
      let args = { curPageNum: this.searchArgs.curPageNum, pageSize: this.searchArgs.pageSize }

      if (this.searchArgs.key) {
        args[this.searchArgs.key] = this.searchArgs.value
      }
      if (this.searchArgs.project) {
        args.project = this.searchArgs.project
      }

      return args
    },
    getPlatformList () {
      this.loading = true

      const params = this.getSearchArgs()
      return getPlatformList(params).then(res => {
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

          this.tableData.forEach(platformInfo => {
            if (platformInfo.apiTree) {
              for (let id in platformInfo.apiTree) {
                let tree = platformInfo.apiTree[id]
                calcFatherLine(tree)
              }
            }
            if (platformInfo.uiTree) {
              for (let id in platformInfo.uiTree) {
                let tree = platformInfo.uiTree[id]
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
    getPlatformCount () {
      const params = this.getSearchArgs()
      return getPlatformCount(params).then(res => {
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
      this.getPlatformList()
    },
    addPlatformInfo () {
      this.showBaseConfigWindows = true
      this.modifyPlatformInfo = { authInfo: {} }
    },
    editPlatformBaseInfo (index) {
      this.modifyPlatformInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showBaseConfigWindows = true
    },

    editPlatformPowerInfo (index, attribute) {
      this.modifyPlatformInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showPowerConfigWindows = true
      this.attribute = attribute
    },
    changePageIndex (curPageNum) {
      this.searchArgs.curPageNum = curPageNum

      this.getPlatformList()
    },

    deletePlatform (index) {
      let key = this.tableData[index].platformId
      deletePlatform(key).then(res => {
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
      return Promise.all([this.getPlatformCount(), this.getPlatformList()]).then(() => {
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
