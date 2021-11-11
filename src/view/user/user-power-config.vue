<template>
  <div>

    <Spin size="large"
          fix
          v-if="loading">

    </Spin>
    <div class="drag-box-card">

      <!-- 切记设置list1和list2属性时，一定要添加.sync修饰符 -->
      <drag-list ref="draglist"
                 :list1.sync="left"
                 :list2.sync="right"
                 :dropConClass="dropConClass"
                 @on-change="handleChange">

        <div slot="left-title"
             class="drag-title-div">
          <h3>{{leftTitle}}</h3>
          <Form label-position="top"
                v-show="opName==='role'">
            <Row>
              <Col :xs="24"
                   :sm="12">
              <FormItem label="tag:">
                <Select v-model="leftSearch.tag"
                        style="width:130px;"
                        placeholder="全部"
                        clearable
                        filterable>

                  <Option v-for="(item, key) in tagMap"
                          :value="item"
                          :key="key">{{ item }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :xs="24"
                   :sm="12">
              <FormItem label="角色名:">
                <Input v-model="leftSearch.name"
                       style="width:130px;"
                       clearable
                       placeholder="请输入角色名过滤" />
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <Collapse slot="left"
                  class="drag-item"
                  slot-scope="left"
                  v-show="!left.itemLeft.hide">
          <Panel :key="'left'+left.itemLeft.id"
                 :name="'left'+left.itemLeft.id"
                 class="del-panel">
            {{ left.itemLeft.name }}
            <Tag color="primary"
                 style="margin: 0 10px;">命名空间：{{ left.itemLeft.spaceName || '填写中...' }}</Tag>
            <Poptip confirm
                    transfer
                    title="你确定删除该角色吗？"
                    class="delete-panel"
                    @on-ok="deleteRolePanel(left.itemLeft)">
              <Button type="error"
                      title="删除角色"
                      size="small"
                      shape="circle"
                      style="height: 30px; width: 30px;"
                      icon="md-close"
                      class="delete-panel"></Button>
            </Poptip>
            <Button style="float:right;margin:4px;"
                    v-show="opName==='role'"
                    icon="md-eye"
                    shape="circle"
                    @click.stop="onCLickShowRoleInfo(left.itemLeft.id)"></Button>
            <pre slot="content">{{JSON.stringify(left.itemLeft, null, 4)}}</pre>

          </Panel>

        </Collapse>

        <div slot="right-title"
             class="drag-title-div">
          <h3>{{rightTitle}}</h3>

          <Form label-position="top"
                v-show="opName==='role'">
            <Row>
              <Col :xs="24"
                   :sm="12">
              <FormItem label="tag:">
                <Select v-model="rightSearch.tag"
                        style="width:130px;"
                        placeholder="全部"
                        clearable
                        filterable>

                  <Option v-for="(item, key) in tagMap"
                          :value="item"
                          :key="key">{{ item }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :xs="24"
                   :sm="12">
              <FormItem label="角色名:">
                <Input v-model="rightSearch.name"
                       style="width:130px;"
                       clearable
                       placeholder="请输入角色名过滤" />
              </FormItem>
              </Col>
            </Row>
          </Form>

        </div>

        <Collapse slot="right"
                  class="drag-item"
                  slot-scope="right"
                  v-show="!right.itemRight.hide">
          <Panel :key="'right'+right.itemRight.id"
                 :name="'right'+right.itemRight.id">
            {{ right.itemRight.name }}
            <Button style="float:right;margin:4px;"
                    v-show="opName==='role'"
                    icon="md-eye"
                    shape="circle"
                    @click.stop="onCLickShowRoleInfo(right.itemRight.id)"></Button>
            <pre slot="content">{{JSON.stringify(right.itemRight, null, 4)}}</pre>

          </Panel>

        </Collapse>

        <Modal :mask-closable="false"
               title="命名空间"
               width="300px"
               v-model="spaceNameModal"
               @on-ok="submitSpaceName"
               @on-cancel="cancleSpaceName"
               slot="modal">
          <Input clearable
                 placeholder="请输入命名空间,不填为默认"
                 v-model="spaceName" />
        </Modal>

      </drag-list>

    </div>

    <RoleInfo :roleId="selectRoleId"
              :project="project"
              v-model="showRoleInfo"></RoleInfo>
  </div>
</template>
<script>
import DragList from '_c/drag-list'
import RoleInfo from './role-info.vue'
import { getRoleListPrimary } from '@/api/data'
import { addRole, deleteRole } from '@/api/user'
import { getAppListPrimary } from '@/api/appInfo'
export default {
  name: 'user-power-config',
  components: {
    DragList,
    RoleInfo
  },
  props: {
    project: String,
    userId: String,
    selectedRole: Array,
    showTabs: Boolean
  },
  watch: {
    selectedRole: function (val) {
      if (this.loading) {
        console.log('未载入完成')
        return
      }

      this.handleAuthInfo()
    },
    spaceNameModal: function (val) {
      this.spaceName = ''
    },
    project: function (value) {
      if (value !== this.projectName) {
        this.fetchData().then(() => {
          if (this.selectedRole) {
            this.handleAuthInfo()
          }
        })
        this.projectName = value
      }
    }
  },
  data () {
    return {

      showRoleInfo: false,
      selectRoleId: null,
      loading: true,

      roleMap: null,
      appMap: null,
      tagMap: null,

      opName: 'role',
      roleInfo: { selTitle: '已选角色', unselTitle: '未选角色', sel: [], unsel: [] },

      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      leftSearch: { name: '', appKey: '' },
      rightSearch: { name: '', appKey: '' },

      spaceName: '',
      spaceNameModal: false,
      moveTemp: {},

      projectName: ''
    }
  },
  methods: {
    submitSpaceName () {
      const param = {
        'userId': this.userId,
        'roleId': this.moveTemp.changeRoleId,
        'space': this.spaceName || 'default'
      }
      addRole(param).then((res) => {
        this.$Message.success(`用户角色分配成功`)
        const tempObj = Object.assign({}, this.left[this.moveTemp.newIndex])
        tempObj.spaceName = param.space
        this.left[this.moveTemp.newIndex] = tempObj
        this.left = [...this.left]
      })
    },
    cancleSpaceName () {
      this[this.moveTemp.to].splice(this.moveTemp.newIndex, 1)
    },
    onCLickShowRoleInfo (roleId) {
      this.showRoleInfo = true
      this.selectRoleId = roleId
    },
    handleChange ({ src, target, oldIndex, newIndex }) {
      if (src === target) return
      this.moveTemp = {
        from: src,
        to: target,
        oldIndex: oldIndex,
        newIndex: newIndex,
        changeRoleId: this[src][oldIndex].id,
        data: this[src][newIndex]
      }
      if (src === 'right') {
        this.spaceNameModal = true
      }
    },
    deleteRolePanel (role) {
      const param = {
        'userId': this.userId,
        'roleId': role.id,
        'space': role.spaceName
      }
      deleteRole(param).then((res) => {
        this.$Message.success(`用户角色删除成功`)
        const idx = this.getDelIdx(role)
        this.left.splice(idx, 1)
      })
    },
    getDelIdx (role) {
      let ret = ''
      for (const i in this.left) {
        if (role.id === this.left[i].id && role.spaceName === this.left[i].spaceName) {
          ret = i
          break
        }
      }
      return ret
    },
    fetchData () {
      this.loading = true

      let promiseArray = [getRoleListPrimary({ project: this.project }), getAppListPrimary()]

      return Promise.all(promiseArray).then((values) => {
        let roleData = values[0].data

        let appData = values[1].data

        if (roleData.errcode === '0' && appData.errcode === '0') {
          let roleList = roleData.object || []
          let appList = appData.object || []

          this.roleMap = {}
          this.appMap = {}
          this.tagMap = []

          roleList.forEach(element => {
            this.roleMap[element.id] = element
            if (!this.tagMap.includes(element.tag)) {
              this.tagMap.push(element.tag)
            }
          })

          appList.forEach(element => {
            this.appMap[element.key] = element
          })

          for (let k in this.roleMap) {
            let role = this.roleMap[k]
            role.appName = this.appMap[role.appKey] && this.appMap[role.appKey].name
          }

          this.$Message.success(`获取数据成功`)
          this.loading = false
        } else {
          console.log(`获取数据错误 ${roleData.errmsg} ${appData.errmsg}`)
          this.$Message.error(`获取数据错误${roleData.errmsg} ${appData.errmsg}`)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(`获取数据错误${e.toString()}`)
      })
    },
    handleAuthInfo () {
      this.roleInfo.unsel = Object.values(this.roleMap)

      let h = (left, right, sel) => {
        left.length = 0
        if (!sel) {
          return
        }
        for (let i = 0; i < sel.length; ++i) {
          const selId = sel[i].id
          const leftObj = Object.assign({}, sel[i])
          for (let j = 0; j < right.length; ++j) {
            const rightId = right[j].id
            const hide = right[j].hide
            const appName = right[j].appName
            if (rightId === selId) {
              leftObj.hide = hide
              leftObj.appName = appName
              left.push(leftObj)
              break
            }
          }
        }
      }

      h(this.roleInfo.sel, this.roleInfo.unsel, this.selectedRole)
    }
  },
  computed: {

    leftTitle () {
      return this[this.opName + 'Info'].selTitle
    },
    rightTitle () {
      return this[this.opName + 'Info'].unselTitle
    },
    // 计算属性的 getter
    left: {
      get: function () {
        let sel = this[this.opName + 'Info'].sel
        let tag = this.leftSearch.tag
        sel.map(v => {
          if (!v.name.includes(this.leftSearch.name) || (tag && v.tag !== tag)) {
            v.hide = true
          } else {
            v.hide = false
          }
        })
        return sel
      },
      // setter
      set: function (newValue) {
        this[this.opName + 'Info'].sel = newValue
      }
    },
    right: {
      get: function () {
        let unsel = this[this.opName + 'Info'].unsel
        let tag = this.rightSearch.tag

        unsel.map(v => {
          if (!v.name.includes(this.rightSearch.name) || (tag && v.tag !== tag)) {
            v.hide = true
          } else {
            v.hide = false
          }
        })
        return unsel
      },
      // setter
      set: function (newValue) {
        this[this.opName + 'Info'].unsel = newValue
      }
    }
  },

  mounted () {
    this.fetchData().then(() => {
      if (this.selectedRole) {
        this.handleAuthInfo()
      }
    })
  }

}
</script>
<style lang="less">
.drag-box-card {
  display: inline-block;
  width: 100%;
  height: 420;
  .drag-item {
    margin: 5px;
  }

  h3 {
    padding: 10px 15px;
  }
  .drop-box {
    border: 1px solid #eeeeee;
    min-height: 350px;
    border-radius: 5px;
  }
  .left-drop-box {
    height: 350px;
    margin-right: 10px;
    overflow-y: auto;
  }
  .right-drop-box {
    height: 350px; //
    overflow-y: auto;
  }
  .drag-title-div {
    padding-bottom: 10px;

    width: 90%;
  }

  .drag-title-div input {
    width: 100%;
  }

  .ivu-btn-circle.ivu-btn-icon-only,
  .ivu-btn-circle-outline.ivu-btn-icon-only {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    height: initial;
    line-height: 20px;
    padding: 10px 75px 10px 16px;
  }
  .delete-panel {
    height: 30px;
    float: right;
    position: absolute;
    bottom: -12px;
    right: 40px;
  }
}
</style>
