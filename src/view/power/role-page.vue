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

      <label>&nbsp;&nbsp;名称:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="输入角色名搜索"
             class="search-input"
             v-model="searchArgs.name" />
      <label>&nbsp;&nbsp;Tag:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="输入Tag搜索"
             class="search-input"
             v-model="searchArgs.tag" />
      <label>&nbsp;&nbsp;状态:&nbsp;&nbsp;</label>
      <Select v-model="searchArgs.status"
              clearable
              placeholder="全部"
              class="search-status">
        <Option :value='0'>禁用</Option>
        <Option :value='1'>正常</Option>
      </Select>
      <!-- <label>&nbsp;&nbsp;基础:&nbsp;&nbsp;</label>
      <Select v-model="searchArgs.isBase"
              clearable
              placeholder="全部"
              class="search-status">
        <Option :value='1'>基础角色</Option>
        <Option :value='0'>非基础角色</Option>
      </Select> -->

      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>

      <Button @click="addRoleInfo()"
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
                  @on-change="prohibitRole(row)"
                  :value="row.status===1">
          <span slot="open">正常</span>
          <span slot="close">禁用</span>
        </i-switch>

      </template>
      <template slot-scope="{ row }"
                slot="isBase">

        <i-switch :loading="row.basicCommiting"
                  size="large"
                  title="用户默认拥有的角色，叫基础角色"
                  @on-change="basicRole(row)"
                  :value="row.isBase">
          <span slot="open">基础</span>
          <span slot="close">非基</span>
        </i-switch>

      </template>

      <template slot-scope="{ row, index }"
                slot="action">
        <Button type="primary"
                style="margin-right: 10px"
                @click="editRoleInfo(index)">编辑</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该Role吗"
                @on-ok="deleteRole(index)">
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

    <RoleConfig v-model="showConfigWindows"
                :appMap="appMap"
                @commitSuccess="commitSuccess"
                :tempRoleInfo="modifyRoleInfo"></RoleConfig>

  </div>
</template>
<script>
import { getRoleList, deleteRoleArray, getRoleCount, prohibitRole, basicRole } from '@/api/data'
import { getAppListPrimary } from '@/api/appInfo'
import gd from '@/config/gd'
import expandRow from './table-expand.vue'
import RoleConfig from './role-config.vue'
export default {
  components: { expandRow, RoleConfig },

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
                role: params.row
              }
            })
          }
        },
        {
          title: '平台',
          align: 'center',
          key: 'project',
          width: 100
        },
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          searchable: true,
          width: 100
        },
        {
          width: 100,
          title: '状态',
          align: 'center',
          key: 'status',
          slot: 'status'
        },
        // {
        //   width: 100,
        //   title: '是否基础',
        //   align: 'center',
        //   key: 'isBase',
        //   slot: 'isBase'
        // },
        {
          title: '名称',
          align: 'center',
          key: 'name',
          searchable: true
        },
        {
          title: '标签',
          align: 'center',
          key: 'tag',
          searchable: true
        },
        {

          title: '操作',
          key: 'option',
          slot: 'action',
          align: 'center',
          width: 180
        }
      ],
      total: 0,

      showConfigWindows: false,

      appMap: {},

      searchArgs: {
        appKey: null,
        name: '',
        status: null,
        curPageNum: 1,
        pageSize: 10,
        project: gd.projectArray[0].name
      },
      modifyRoleInfo: {},
      tree: [
        {
          title: '权限树配置',
          expand: true,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '100px'
                  },
                  on: {
                    click: () => { this.append(data) }
                  }
                })
              ])
            ])
          },
          children: [

          ]
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
    }
  },
  methods: {
    getSearchArgs () {
      let args = JSON.parse(JSON.stringify(this.searchArgs))

      if (this.searchArgs.isBase != null) {
        args.isBase = this.searchArgs.isBase === 1
      }

      return args
    },
    getRoleList () {
      this.loading = true

      return getRoleList(this.getSearchArgs()).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object || []
          this.tableData = data

          let calcFatherLine = (tree, fatherLine = []) => {
            tree.fatherLine = JSON.parse(JSON.stringify(fatherLine))
            tree.fatherLine.push(tree.id)

            for (let id in tree.children) {
              let child = tree.children[id]
              calcFatherLine(child, tree.fatherLine)
            }
          }

          this.tableData && this.tableData.forEach(appInfo => {
            if (!appInfo.apiTree) {
              return
            }

            for (let id in appInfo.apiTree) {
              let tree = appInfo.apiTree[id]
              calcFatherLine(tree)
            }
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    getRoleCount () {
      return getRoleCount(this.getSearchArgs()).then(res => {
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
      this.getRoleList()
    },
    addRoleInfo () {
      this.showConfigWindows = true
      this.modifyRoleInfo = {}
    },
    editRoleInfo (index) {
      this.modifyRoleInfo = JSON.parse(JSON.stringify(this.tableData[index]))
      this.showConfigWindows = true
    },
    changePageIndex (curPageNum) {
      this.searchArgs.curPageNum = curPageNum

      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.getRoleList()
    },
    prohibitRole (row) {
      let id = row.id
      let status = row.status
      status = status === 1 ? 0 : 1
      row.statusCommiting = true
      prohibitRole(id, status).then(res => {
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
    basicRole (row) {
      let id = row.id
      let isBase = !row.isBase

      row.basicCommiting = true
      basicRole(id, isBase).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          row.isBase = isBase
          row.basicCommiting = false
          this.$Message.info('修改成功')
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },
    deleteRole (index) {
      let id = this.tableData[index].id
      deleteRoleArray([id]).then(res => {
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

    getAppListPrimary () {
      getAppListPrimary().then(res => {
        let data = res.data
        if (data.errcode === '0') {
          let arr = data.object || []
          this.appMap = {}

          arr && arr.forEach(v => {
            this.appMap[v.key] = v
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    },

    fetchData () {
      return Promise.all([this.getRoleCount(), this.getRoleList()]).then(() => {

      })
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
    this.getAppListPrimary()
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
      width: 180px;
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
