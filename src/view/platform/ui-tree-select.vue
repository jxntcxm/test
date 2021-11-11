<template>

  <div style="height:300px;overflow-y:auto">
    <h1>UI权限选择-{{this.platformInfo.name}}</h1>
    <Tree :data="tree"
          ref="tree"
          show-checkbox
          @on-check-change="$emit('on-check-change')"
          :render="renderContent"></Tree>

  </div>

</template>
<script>

export default {
  name: 'ui-tree-select',
  components: {

  },
  props: {
    uiTreeIdArray: Array,
    platformInfo: Object
  },
  watch: {

  },
  data () {
    return {

    }
  },
  methods: {

    renderContent (h, { root, node, data }) {
      let iconType = 'ios-folder'

      if (!data.children || data.children.length === 0) {
        iconType = 'ios-paper'
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
            width: '90%'
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
            h('span', data.title)
          ])
        ])
      ])
    },

    // 给父类调用
    getSelect () {
      let checkedNodes = this.$refs['tree'].getCheckedNodes()

      let treeIdArray = []

      checkedNodes.forEach(element => {
        if (element.id != null) {
          treeIdArray.push(element.id)
        }
      })
      return treeIdArray
    }
  },
  computed: {

    tree () {
      let handleTree = (father, tree, treeArray) => {
        let allCheck = true

        let node = {
          title: tree.name,
          id: tree.id,
          expand: true,
          children: [
          ]
        }

        treeArray.push(node)

        for (var id in tree.children) {
          if (!handleTree(node, tree.children[id], node.children)) {
            allCheck = false
          }
        }
        if (this.uiTreeIdArray && this.uiTreeIdArray.includes(tree.id) && allCheck) {
          node.checked = true
        } else {
          allCheck = false
        }

        return allCheck
      }
      let children = []
      for (var id in this.platformInfo.uiTree) {
        handleTree(null, this.platformInfo.uiTree[id], children)
      }

      return [
        {
          title: this.platformInfo.name,
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
                      type: 'ios-folder'
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
