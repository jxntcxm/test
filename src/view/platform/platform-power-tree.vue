<template>
  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="'UI树修改'"
         width="800">

    <div style="height:300px;overflow-y:auto;overflow-x:visible">

      <Tree :data="tree"
            :render="renderContent"></Tree>

      <PlatformNodeConfig v-model="showConfigNode"
                          :title="`添加新节点`"
                          :tempNodeInfo="nowNodeInfo"
                          :platformInfo="platform"
                          :project="project"
                          @commitSuccess="commitSuccess"></PlatformNodeConfig>

    </div>
    <div slot="footer">

    </div>
  </Modal>
</template>
<script>
import PlatformNodeConfig from './platform-node-config.vue'

import { deleteUITree } from '@/api/platform'
export default {
  components: { PlatformNodeConfig },
  props: {
    project: String,
    value: Boolean,
    attribute: String,
    platform: Object
  },
  watch: {
    platform (val) {
      this.tree[0].children = []
      if (this.platform) {
        this.tree[0].title = this.platform.name
      }

      let handleTree = (father, tree, treeArray) => {
        let node = {}

        this.copyAttr(tree, node)

        node.title = tree.name
        node.expand = false
        node.children = []
        node.fullPath = (father ? father.fullPath : '') + '/' + tree.path

        treeArray.push(node)

        for (var id in tree.children) {
          handleTree(node, tree.children[id], node.children)
        }
      }

      for (var id in this.platform.uiTree) {
        handleTree(null, this.platform.uiTree[id], this.tree[0].children)
      }
    }
  },
  data () {
    return {
      showConfigNode: false,
      nowNodeInfo: {},
      tree: [
        {
          title: '权限树配置',
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
                  width: '96%'
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
                      click: (event) => {
                        // 阻止 事件冒泡
                        event.stopPropagation()
                        // 阻止该元素默认的 keyup 事件
                        event.preventDefault()
                        this.append(data)
                      }
                    }
                  })
                ])
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

    copyAttr (src, dest) {
      for (let attr in src) {
        dest[attr] = src[attr]
      }
    },

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
            width: '96%'
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
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right'
            }
          }, [
            h('span', {
              style: { marginRight: '8px', color: 'red' }
            }, [this.attribute === 'apiTree' ? data.fullPath : '']),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                disabled: this.attribute === 'apiTree' && !data.isMenu
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: (event) => {
                  // 阻止 事件冒泡
                  event.stopPropagation()
                  // 阻止该元素默认的 keyup 事件
                  event.preventDefault()
                  this.append(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-hammer'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: (event) => {
                  // 阻止 事件冒泡
                  event.stopPropagation()
                  // 阻止该元素默认的 keyup 事件
                  event.preventDefault()
                  this.edit(data)
                }
              }
            }),
            h('Poptip', {
              props: {
                confirm: true,
                title: '您确认要删除该节点吗?'
              },

              on: {
                'on-ok': () => { this.remove(root, node, data) }
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-remove'
                }),
                style: {
                  // marginRight: '8px'
                }
              })
            ])

          ])
        ])
      ])
    },
    append (data) {
      this.nowNodeInfo = {
        platformId: this.platform.platformId,
        fatherLine: data.fatherLine || [],
        data: data,
        sysAction: 'add',
        fatherFullPath: data.fullPath
      }
      this.showConfigNode = true
    },
    edit (data) {
      this.nowNodeInfo = {}
      this.copyAttr(data, this.nowNodeInfo)

      this.nowNodeInfo.platformId = this.platform.platformId
      this.nowNodeInfo.fatherLine = data.fatherLine || []
      this.nowNodeInfo.data = data
      this.nowNodeInfo.sysAction = 'edit'
      this.showConfigNode = true
    },
    remove (root, node, data) {
      let api = deleteUITree

      api({ platformId: this.platform.platformId, fatherLine: data.fatherLine }).then(res => {
        let resData = res.data
        if (resData.errcode === '0') {
          this.$Notice.success({
            title: '删除节点成功'
          })
          const parentKey = root.find(el => el === node).parent
          const parent = root.find(el => el.nodeKey === parentKey).node
          const index = parent.children.indexOf(data)
          parent.children.splice(index, 1)

          this.$emit('commitSuccess')
        } else {
          this.$Notice.warning({ title: '删除节点失败', desc: resData.errmsg })
        }
      }).catch(e => {
        this.$Notice.error({ title: '删除节点失败', desc: e })
      })
    },
    commitSuccess (data) {
      this.$emit('commitSuccess')

      let fatherNode = this.nowNodeInfo.data

      if (this.nowNodeInfo.sysAction === 'add') {
        const children = fatherNode.children || []
        let fatherLine = JSON.parse(JSON.stringify(fatherNode.fatherLine || []))
        fatherLine.push(data.id)
        let node = {}
        this.copyAttr(data, node)
        node.fatherLine = fatherLine
        node.title = data.name
        node.expand = true
        node.children = []

        children.push(node)

        this.$set(fatherNode, 'children', children)
      } else {
        let rscChildren = fatherNode.children

        this.copyAttr(data, fatherNode)
        fatherNode.title = data.name
        fatherNode.children = rscChildren
      }
    }
  }
}
</script>
