<template>
  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="'权限树修改'"
         width="800">

    <div style="height:300px;overflow-y:auto;overflow-x:visible">

      <Tree :data="tree"
            :render="renderContent"></Tree>

      <AppNodeConfig v-model="showConfigNode"
                     :title="`添加新节点`"
                     :tempNodeInfo="nowNodeInfo"
                     :attribute="attribute"
                     :appInfo="appInfo"
                     @commitSuccess="commitSuccess"></AppNodeConfig>

    </div>
    <div slot="footer">

    </div>
  </Modal>
</template>
<script>
import AppNodeConfig from './app-node-config.vue'

import { deleteAPITree } from '@/api/appInfo'
export default {
  components: { AppNodeConfig },
  props: {
    value: Boolean,
    attribute: String,
    appInfo: Object
  },
  watch: {
    appInfo (val) {
      this.tree[0].children = []
      if (this.appInfo) {
        this.tree[0].title = this.appInfo.name
      }

      if (!this.appInfo[this.attribute]) {
        return
      }

      let handleTree = (father, tree, treeArray) => {
        let node = {
          title: tree.name,
          fatherLine: tree.fatherLine,
          id: tree.id,
          path: tree.path,
          method: tree.method,
          expand: false,
          children: [
          ],
          isMenu: tree.isMenu,
          powerLevel: tree.powerLevel,
          authKey: tree.authKey,
          icon: tree.icon,
          apiTreeIdArray: tree.apiTreeIdArray,
          type: tree.type,
          extInfo: tree.extInfo,
          fullPath: (father ? father.fullPath : '') + '/' + tree.path
        }

        treeArray.push(node)

        for (var id in tree.children) {
          handleTree(node, tree.children[id], node.children)
        }
      }

      for (var id in this.appInfo[this.attribute]) {
        handleTree(null, this.appInfo[this.attribute][id], this.tree[0].children)
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
    renderContent (h, { root, node, data }) {
      let iconType = 'ios-folder'

      if (!data.isMenu) {
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
        key: this.appInfo.key,
        fatherLine: data.fatherLine || [],
        data: data,
        action: 'add',
        fatherFullPath: data.fullPath
      }
      this.showConfigNode = true
    },
    edit (data) {
      this.nowNodeInfo = {
        key: this.appInfo.key,

        id: data.id,
        fatherLine: data.fatherLine || [],
        data: data,
        name: data.title,
        path: data.path,
        method: data.method,
        isMenu: data.isMenu,
        powerLevel: data.powerLevel,
        authKey: data.authKey,
        icon: data.icon,
        type: data.type,
        extInfo: data.extInfo,
        apiTreeIdArray: data.apiTreeIdArray,
        action: 'edit',
        fatherFullPath: this.attribute === 'apiTree' ? data.fullPath.substring(0, data.fullPath.length - data.path.length - 1) : ''
      }

      this.showConfigNode = true
    },
    remove (root, node, data) {
      let api
      if (this.attribute === 'apiTree') {
        api = deleteAPITree
      } else {
        api = deleteUITree
      }

      api({ key: this.appInfo.key, fatherLine: data.fatherLine }).then(res => {
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

      if (this.nowNodeInfo.action === 'add') {
        const children = fatherNode.children || []

        let fatherLine = JSON.parse(JSON.stringify(fatherNode.fatherLine || []))
        fatherLine.push(data.id)
        children.push({
          title: data.name,
          fatherLine: fatherLine,
          id: data.id,
          path: data.path,
          method: data.method,
          expand: true,
          authKey: data.authKey,
          isMenu: data.isMenu,
          powerLevel: data.powerLevel,
          icon: data.icon,
          type: data.type,
          extInfo: data.extInfo,
          apiTreeIdArray: data.apiTreeIdArray,
          children: [
          ],
          fullPath: (fatherNode.fullPath ? fatherNode.fullPath : '') + '/' + data.path
        })

        this.$set(fatherNode, 'children', children)
      } else {
        fatherNode.title = data.name
        fatherNode.isMenu = data.isMenu
        fatherNode.powerLevel = data.powerLevel
        fatherNode.path = data.path
        fatherNode.method = data.method
        fatherNode.authKey = data.authKey
        fatherNode.icon = data.icon
        fatherNode.type = data.type
        fatherNode.extInfo = data.extInfo
        fatherNode.apiTreeIdArray = data.apiTreeIdArray
        if (this.attribute === 'apiTree') {
          let fatherFullPath = fatherNode.fullPath.substring(0, fatherNode.fullPath.length - fatherNode.path.length - 1)
          let updateFullPath = (fatherFullPath, node) => {
            node.fullPath = fatherFullPath + '/' + node.path

            node.children.forEach(v => {
              updateFullPath(node.fullPath, v)
            })
          }

          updateFullPath(fatherFullPath, fatherNode)
        }
      }
    }
  }
}
</script>
