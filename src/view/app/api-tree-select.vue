<template>

  <div>

    <template v-if="this.powerLevelSelect">
      <Tree :data="tree"
            ref="tree"
            @on-check-change="onCheckChange"
            @on-toggle-expand="onToggleExpand"
            :render="renderContent"></Tree>
    </template>
    <template v-else>
      <Modal :mask-closable="false"
             v-model="showAPITreeSelect"
             @on-ok="selectApiTreeFinish"
             width="800">
        <h1>&nbsp;&nbsp;切换平台&nbsp;&nbsp;</h1>
        <Select v-model="projectName"
                @on-change="handleSelect"
                class="search-status">
          <Option value='all'>全部</Option>
          <Option :value='item.name'
                  :key="item.name"
                  v-for="item in gd.projectArray">{{item.name}}</Option>

        </Select>
        <div style="height:400px;overflow-y:auto">
          <h1>{{ title }}</h1>
          <Tree :data="tree"
                ref="tree"
                show-checkbox
                :render="renderContent"></Tree>
        </div>
      </Modal>
    </template>

  </div>

</template>
<script>
import { getAppList, setAPIOpen } from '@/api/appInfo'
import gd from '@/config/gd'
export default {
  name: 'api-tree-select',
  components: {

  },
  props: {
    project: String,
    apiTreeIdArray: Object,
    appInfo: Object,

    powerLevelSelect: Boolean, // 是否是权限选择模式
    checkBoxDisabled: Boolean,
    powerLevelSelectDisabled: Boolean
  },
  data () {
    return {
      gd: gd,
      dataFormated: false,
      checkedIds: [],
      treeData: {},
      showAPITreeSelect: false,
      extendMap: {},
      title: 'API权限选择',
      needReload: false, // 是否需要重新载入appInfo

      projectName: ''
    }
  },
  created () {
  },
  methods: {
    showDialog (data) {
      if (data != null) {
        this.title = data.title + '-API权限'
        this.getCheckedIds(data.relyAPI || {})
      }

      this.showAPITreeSelect = true
    },

    handleSelect () {
      this.needReload = true
    },
    getCheckedIds (val) {
      this.checkedIds = []
      if (val) {
        for (const v in val) {
          this.checkedIds = this.checkedIds.concat(val[v])
        }
        console.log(this.checkedIds)
      }
    },
    async formatTreeData () {
      let treeData
      if (!this.appInfo || this.needReload) {
        const param = {
          pageSize: 1000,
          curPageNum: 1
        }
        if (this.projectName) param.project = this.projectName
        const { data } = await getAppList(param)
        treeData = data.object
      }
      this.treeData = this.appInfo || treeData

      const ret = {
        id: 0,
        name: '全部',
        children: {},
        isMenu: true,
        expand: true

      }
      for (const k in this.treeData) {
        const tmp = this.treeData[k]
        const key = tmp.key
        const name = tmp.name
        const children = tmp.apiTree
        const path = tmp.domain
        ret.children[key] = {
          id: key,
          key: key,
          name: name,
          isMenu: true,
          children: children,
          path: path,
          project: tmp.project
        }
      }
      this.treeData = ret
      this.dataFormated = true
      this.needReload = false
    },
    renderContent (h, { root, node, data }) {
      let iconType = 'ios-folder'

      if (!data.children || data.children.length === 0) {
        iconType = 'ios-paper'
      }
      if (data.id === data.key) {
        iconType = 'logo-vimeo'
      }
      data.fullPath = data.fullPath || ''
      let lastIndex = data.fullPath.lastIndexOf('/')
      if (lastIndex === -1) {
        lastIndex = data.fullPath.length
      }
      let preFullPath = data.fullPath.substr(0, lastIndex)
      let leftFullPath = data.fullPath.substr(lastIndex, data.fullPath.length)
      let hArray = [
        h('Icon', {
          props: {
            type: iconType
          },
          style: {
            marginRight: '8px'
          }
        }),
        h('span', data.title),
        h('span', {
          style: {
            float: 'right',
            color: 'red'
          }
        }, leftFullPath),
        h('span', {
          style: {
            float: 'right',
            color: '#aaaaaa'
          }
        }, preFullPath)
      ]

      if (this.powerLevelSelect && (!node.children || node.children.length === 0) && data.id !== data.key) {
        hArray.splice(2, 0, h('RadioGroup',

          {
            style: {
              float: 'right',
              marginLeft: '8px'
            },
            on: { 'on-change': (value) => { this.onCheckChange(data, value) } },
            props: { size: 'small', type: 'button', value: data.powerLevel }
          },
          [
            h('Radio', { props: { label: 2, disabled: data.powerLevelSelectDisabled } }, '公开'),
            h('Radio', { props: { label: 1, disabled: data.powerLevelSelectDisabled } }, '登录就有'),
            h('Radio', { props: { label: 0, disabled: data.powerLevelSelectDisabled } }, '登录角色校验')
          ]))
      }

      return h('label', {
        style: {
          cursor: 'pointer'
        },
        on: {
          click: (event) => {
            // 阻止 事件冒泡
            // event.stopPropagation()
            // 阻止该元素默认的 keyup 事件
            // event.preventDefault()
            data.expand = !data.expand
          }
        }
      }, [
        h('span', {
          style: {
            display: 'inline-block',
            width: '90%'
          }
        }, [
          h('span', hArray)
        ])
      ])
    },
    getSelect () {
      let checkedNodes = this.$refs['tree'].getCheckedAndIndeterminateNodes()

      let treeIdObject = {}

      checkedNodes.forEach(element => {
        if (element.id != null && !element.isMenu) {
          if (!treeIdObject[element.key]) treeIdObject[element.key] = []
          if (typeof element.id === 'number') {
            treeIdObject[element.key].push(element.id)
          }
        }
      })

      return treeIdObject
    },
    selectApiTreeFinish () {
      this.$emit('callback', this.getSelect())
    },
    onToggleExpand (node) {
      this.extendMap[node.id] = node.expand
    },
    onCheckChange (node, powerLevel) {
      if (!this.powerLevelSelect) {
        return
      }

      let key = node.key
      let fatherLine = node.fatherLine

      setAPIOpen(key, fatherLine, powerLevel).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.$Notice.success({
            title: '提交数据成功'
          })

          node.powerLevel = powerLevel
        } else {
          console.log(data.errmsg)
          this.$Notice.warning({ title: '提交数据失败', desc: data.errmsg })
        }
      }).catch(e => {
        this.$Notice.error({ title: '提交数据失败', desc: e })
      })
    }
  },
  watch: {
    apiTreeIdArray: {
      handler (val, oldVal) {
        this.getCheckedIds(val)
      },
      immediate: true,
      deep: true
    },
    project (value) {
      this.needReload = true
      this.projectName = value
    }
  },
  computed: {
    tree () {
      if (!this.dataFormated || this.needReload) this.formatTreeData()
      let handleTree = (father, tree, treeArray) => {
        let node = {
          title: tree.name,
          id: tree.id || (father && father.key),
          path: tree.path,
          method: tree.method,
          isMenu: tree.isMenu,
          disableCheckbox: this.checkBoxDisabled,
          powerLevelSelectDisabled: this.powerLevelSelectDisabled,
          expand: this.extendMap[tree.id],
          key: (father ? father.key : tree.id),
          powerLevel: tree.powerLevel,
          fullPath: (father ? father.fullPath : '') + '/' + tree.path,
          children: [
          ]
        }

        if (this.checkedIds && this.checkedIds.includes(tree.id) && !tree.isMenu) {
          node.checked = true
        }

        if (father != null) {
          node.fatherLine = father.fatherLine.concat(node.id)
        } else {
          node.fatherLine = []
        }

        treeArray.push(node)
        treeArray.sort((a, b) => { return a.fullPath > b.fullPath })

        for (var id in tree.children) {
          handleTree(node, tree.children[id], node.children)
        }

        if ((this.powerLevelSelect && !this.checkBoxDisabled && node.children.length > 0) || tree.key) {
          node.disableCheckbox = true
        }
      }
      let children = []

      for (var id in this.treeData.children) {
        handleTree(null, this.treeData.children[id], children)
      }

      return [
        {
          disableCheckbox: this.checkBoxDisabled,
          title: this.treeData.name,
          expand: true,
          render: (h, { root, node, data }) => {
            return h('label', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: (event) => {
                  // 阻止 事件冒泡
                  event.stopPropagation()
                  // 阻止该元素默认的 keyup 事件
                  event.preventDefault()
                  data.expand = !data.expand
                }
              }
            }, [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '90%'
                }
              }, [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'logo-vimeo'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ])
              ])
            ])
          },
          children: children
        }
      ]
    }
  },

  mounted () {

  }

}
</script>
<style lang="less">
</style>
