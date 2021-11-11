<template>

  <div :style="`height:${height?height:450}px;overflow-y:auto`">
    <h1 v-show="title">{{ title }}</h1>
    <h1>&nbsp;&nbsp;切换平台&nbsp;&nbsp;</h1>
      <Select v-model="uiProject" @on-change="handleSelect" class="search-status">
        <Option value='all'>全部</Option>
        <Option :value='item.name' :key="item.name" v-for="item in gd.projectArray">{{item.name}}</Option>
      </Select>
    <Tree :data="tree" ref="tree" show-checkbox :render="renderContent"></Tree>
    <ApiTreeSelect :checkBoxDisabled="true" :project="projectName" ref="apiTreeSelect"></ApiTreeSelect>
  </div>

</template>
<script>
import { getPlatformList } from '@/api/platform'
import ApiTreeSelect from './api-tree-select.vue'
import gd from '@/config/gd'
export default {
  name: 'ui-tree-select',
  components: {
    ApiTreeSelect
  },
  props: {
    uiTree: Object,
    project: String,
    title: String,
    checkBoxDisabled: Boolean,
    height: Number
  },
  data () {
    return {
      gd: gd,
      dataFormated: false,
      changeProject: false,
      needReload: false,
      appInfo: '',
      projectName: '',
      uiProject: '',
      apiTreeIdArray: {}
    }
  },
  methods: {
    handleSelect () {
      this.needReload = true
    },
    async formatTreeData () {
      let treeData = ''
      if (!this.appInfo || this.changeProject || this.needReload) {
        const param = {
          pageSize: 100,
          curPageNum: 1
        }
        if (this.uiProject) param.project = this.uiProject
        const { data } = await getPlatformList(param)
        treeData = data.object
      }
      const ret = {
        id: 0,
        name: '全部',
        children: {},
        isMenu: true,
        expand: true,
        disableCheckbox: this.checkBoxDisabled
      }
      for (const k in treeData) {
        const tmp = treeData[k]
        const key = tmp.platformId
        const name = tmp.name
        const children = tmp.uiTree
        ret.children[key] = {
          id: key,
          key: key,
          name: name,
          children: children,
          disableCheckbox: this.checkBoxDisabled
        }
      }
      this.appInfo = ret
      this.dataFormated = true
      this.changeProject = false
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
      let iconDetail = ''
      if (Object.keys(data.relyAPI || {}).length) {
        iconDetail = h('Tooltip', {
          props: {
            content: '点击查看API权限',
            placement: 'left'
          },
          style: {
            float: 'right'
          }
        }, [
          h('Button', {
            props: {
              type: 'text',
              icon: 'md-eye',
              size: 'small'
            },
            on: {
              click: (event) => {
                // 阻止 事件冒泡
                event.stopPropagation()
                // 阻止该元素默认的 keyup 事件
                event.preventDefault()
                this.$refs.apiTreeSelect.showDialog(data)
              }
            }
          })
        ])
      }
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
            width: '89%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: iconType
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title),
            iconDetail
          ])
        ])
      ])
    },

    // 给父类调用
    getSelect () {
      let checkedNodes = this.$refs['tree'].getCheckedAndIndeterminateNodes()

      let treeIdObject = {}
      checkedNodes.forEach(element => {
        if (element.id != null) {
          if (!treeIdObject[element.key]) treeIdObject[element.key] = []
          if (typeof element.id === 'number') {
            treeIdObject[element.key].push(element.id)
          }
        }
      })
      return treeIdObject
    }
  },
  watch: {
    project (value) {
      this.changeProject = this.projectName !== value
      this.projectName = value
      this.uiProject = value
      this.needReload = true
    }
  },
  computed: {
    checkedIds () {
      let ret = []
      if (!!this.uiTree && !Object.keys(this.uiTree)[0]) return
      if (this.uiTree) {
        for (const v in this.uiTree) {
          ret = ret.concat(this.uiTree[v])
        }
      }
      return ret
    },
    tree () {
      if (!this.dataFormated || this.changeProject || this.needReload) this.formatTreeData()
      let handleTree = (father, tree, treeArray) => {
        let allCheck = true

        let node = {
          title: tree.name,
          id: tree.id,
          expand: false,
          isMenu: true,
          key: (father ? father.key : tree.id),
          disableCheckbox: this.checkBoxDisabled,
          children: [],
          relyAPI: (father ? tree.relyAPI : {})
        }

        treeArray.push(node)

        for (var id in tree.children) {
          if (!handleTree(node, tree.children[id], node.children)) {
            allCheck = false
          }
        }
        if (this.checkedIds && this.checkedIds.includes(tree.id) && allCheck) {
          node.checked = true
        } else {
          allCheck = false
        }

        return allCheck
      }
      let children = []
      for (var id in this.appInfo.children) {
        handleTree(null, this.appInfo.children[id], children)
      }

      return [
        {
          title: this.appInfo.name,
          expand: true,
          disableCheckbox: this.checkBoxDisabled,
          render: (h, { root, node, data }) => {
            return h('label', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  data.expand = !data.expand
                }
              }
            }, [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '88%'
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
