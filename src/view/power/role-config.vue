<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="roleInfo.id==null?`新增角色`:`角色信息修改`"
         width="800">

    <Form :rules="ruleValidate"
          ref="roleInfo"
          :model="roleInfo">
      <Row>
        <Col span="6">
        <FormItem label="ID"
                  prop="id">

          <Input :value="roleInfo.id"
                 disabled
                 placeholder="后台自动生成"></Input>

        </FormItem>

        <FormItem label="名称"
                  prop="name">
          <Input v-model="roleInfo.name"
                 placeholder="名称"></Input>
        </FormItem>
        <FormItem label="平台"
                  prop="project">
          <Select v-model="roleInfo.project"
                  @on-change="projectChange"
                  class="search-status">
            <Option :value='item.name'
                    :key="item.name"
                    v-for="item in gd.projectArray">{{item.name}}</Option>

          </Select>
        </FormItem>
        <FormItem label="标签"
                  prop="tag">
          <Input v-model="roleInfo.tag"
                 placeholder="标签"></Input>
        </FormItem>
        <FormItem label="状态"
                  prop="status">

          <RadioGroup v-model="roleInfo.status"
                      type="button">
            <Radio :label="1">正常</Radio>
            <Radio :label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="额外信息"
                prop="extInfo">
        <Input v-model="roleExtInfo"
               :autosize="{minRows:3}"
               type="textarea"
               placeholder="额外信息"></Input>
        </FormItem>

        </Col>

        <Col span="16"
             offset="2">
        <Tabs type="card">
          <TabPane label="UI权限配置">

            <UITreeSelect :uiTree="roleInfo.uiPower" :project="projectValue"
                          ref="uiTreeSelect"></UITreeSelect>

          </TabPane>

        </Tabs>

        </Col>
      </Row>

    </Form>

    <div slot="footer">
      <Button type="default"
              @click="$emit('input', false)">取消</Button>
      <Button type="primary"
              :loading="loading"
              @click="handleSubmit">确定</Button>
    </div>
  </Modal>

</template>

<script>

import { addRole, updateRole } from '@/api/data'
import { getAppInfo } from '@/api/appInfo'
import gd from '@/config/gd'
import UITreeSelect from '../app/ui-tree-select.vue'
export default {
  name: 'role-config',
  components: {
    UITreeSelect
  },
  props: {
    value: Boolean,
    appMap: Object,
    tempRoleInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['roleInfo'].resetFields()
    },
    tempRoleInfo (val) {
      if (val && Object.keys(val).length > 0) {
        this.roleInfo = JSON.parse(JSON.stringify(val))
        this.projectValue = this.roleInfo.project
        if (this.roleInfo.status == null) {
          this.roleInfo.status = 1
        }

        if (this.roleInfo.appKey) {
          this.getAppInfo()
        }
      } else {
        this.projectValue = this.roleInfo.project
      }
    }

  },
  data () {
    return {
      gd: gd,
      loading: false,

      ruleValidate: {

        name: [
          { required: String, message: '名字不能为空', trigger: 'blur' }
        ],
        project: [
          { required: String, message: '平台不能为空', trigger: 'blur' }
        ]

      },
      roleInfo: {
        id: '',
        name: '',
        tag: '',
        status: 1,
        appKey: '',
        project: gd.projectArray[0].name,
        extInfo: {}
      },
      appKey2Info: {},
      appInfo: {},
      projectValue: ''
    }
  },
  methods: {

    handleSubmit () {
      this.$refs['roleInfo'].validate((valid) => {
        try {
          if (valid) {
            let uiTreeIdArray = this.$refs['uiTreeSelect'].getSelect()

            let promise
            this.roleInfo.uiPower = Object.assign({}, uiTreeIdArray)

            if (this.roleInfo.isBase) {
              this.roleInfo.isBase = true
            } else {
              this.roleInfo.isBase = false
            }

            if (!this.tempRoleInfo.id) {
              promise = addRole(this.roleInfo)
            } else {
              promise = updateRole(this.roleInfo)
            }
            promise.then(res => {
              let data = res.data
              if (data.errcode === '0') {
                this.$Notice.success({
                  title: '提交数据成功'
                })
                this.$emit('input', false)
                this.$emit('commitSuccess')
              } else {
                console.log(data.errmsg)
                this.$Notice.warning({ title: '提交数据失败', desc: data.errmsg })
              }
            }).catch(e => {
              this.$Notice.error({ title: '提交数据失败', desc: e })
            })
          } else {
            this.$Message.error('数据校验失败!')
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    getAppInfo () {
      if (!this.appKey2Info[this.roleInfo.appKey]) {
        getAppInfo(this.roleInfo.appKey).then(res => {
          let data = res.data
          if (data.errcode === '0') {
            this.appKey2Info[this.roleInfo.appKey] = data.object
            this.appInfo = this.appKey2Info[this.roleInfo.appKey]
          } else {
            this.$Notice.warning({ title: '获取数据失败', desc: data.errmsg })
          }
        }).catch(e => {
          this.$Notice.error({ title: '获取数据失败', desc: e })
        })
      } else {
        this.appInfo = this.appKey2Info[this.roleInfo.appKey]
      }
    },

    onAppKeyChange (appKey) {
      appKey && this.getAppInfo()
    },

    projectChange (value) {
      this.projectValue = value
    }

  },
  computed: {
    isBase: {
      set (value) {
        this.roleInfo.isBase = value === 1
      },
      get () {
        return this.roleInfo.isBase ? 1 : 0
      }
    },
    roleExtInfo: {
      set: function (value) {
        try {
          let obj = JSON.parse(value)
          if (obj instanceof Object) {
            this.roleInfo.extInfo = obj
          } else {
            this.roleInfo.extInfo = value
          }
        } catch (e) {
          this.roleInfo.extInfo = value
        }
      },
      get: function () {
        if (this.roleInfo.extInfo instanceof Object) {
          return JSON.stringify(this.roleInfo.extInfo, null, 4)
        } else {
          return this.roleInfo.extInfo || '{}'
        }
      }
    }

  },
  mounted () {

  }

}
</script>

<style lang="less">
</style>
