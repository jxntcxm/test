<template>
  <div>
    <div class="search-con search-con-top">
      <label>&nbsp;&nbsp;平台名:&nbsp;&nbsp;</label>
      <Input clearable
             placeholder="平台名"
             class="search-input"
             v-model="search.name" />

      <Button @click="handleSearch"
              class="search-btn"
              type="primary">
        <Icon type="search" />&nbsp;&nbsp;搜索</Button>
      <Button @click="showAdd"
              class="search-btn"
              type="success">
        <Icon type="search" />&nbsp;&nbsp;新增</Button>
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
                @click="editProjectBaseInfo(index)">修改</Button>

        <Poptip confirm
                transfer
                slot="extra"
                title="你确定删除该Project吗"
                @on-ok="deleteProject(index)">
          <Button type="error">删除</Button>
        </Poptip>

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
    <ProjectBaseConfig v-model="showProjectBaseConfig"
                       :tempProjectInfo="modifyProjectInfo"
                       @commitSuccess="commitSuccess"></ProjectBaseConfig>
  </div>
</template>
<script>
import { getProjectList, getProjectCount, deleteProject } from '@/api/project'
import gd from '@/config/gd'
import ProjectBaseConfig from './project-base-config.vue'

export default {
  components: { ProjectBaseConfig },

  data () {
    return {
      loading: true,
      tableData: [],
      opAction: '',
      modifyProjectInfo: null,
      tableColumns: [

        {
          title: '名字',
          align: 'center',
          key: 'name'
        },
        {
          title: '描述',
          align: 'center',
          key: 'desc'
        },

        {
          title: '创建类型',
          align: 'center',
          key: 'createType'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '更新时间 ',
          align: 'center',
          key: 'updateTime'
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
      showProjectBaseConfig: false,
      search: {
        pageSize: 10,
        curPageNum: 1,
        name: ''
      }

    }
  },
  methods: {

    getSearch () {
      let search = this.search
      return search
    },

    getProjectList () {
      this.loading = true

      return getProjectList(this.getSearch()).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object
          this.tableData = data || []
          gd.projectArray = data || []

          this.tableData.forEach(element => {
            element.createTime = element.createTime && new Date(element.createTime).toLocaleString()
            element.updateTime = element.updateTime && new Date(element.updateTime).toLocaleString()
          })
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    getProjectCount () {
      return getProjectCount(this.getSearch()).then(res => {
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
      this.getProjectList()
    },

    changePageIndex (curPageNum) {
      this.search.curPageNum = curPageNum
      this.getProjectList()
    },

    fetchData () {
      return Promise.all([this.getProjectCount(), this.getProjectList()]).then(() => {
      })
    },
    handleClear () {

    },
    deleteProject (index) {
      let key = this.tableData[index].name
      deleteProject(key).then(res => {
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
    handleSearch () {
      this.fetchData()
    },
    editProjectBaseInfo (index) {
      this.modifyProjectInfo = this.tableData[index]
      this.showProjectBaseConfig = true
    },
    showAdd () {
      this.modifyProjectInfo = null
      this.showProjectBaseConfig = true
    },
    commitSuccess () {
      this.fetchData()
    }
  },
  computed: {

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
