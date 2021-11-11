<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="userInfo.userId==null?`新增用户`:`用户信息修改`"
         width="400">

    <Form :rules="ruleValidate"
          ref="userInfo"
          :label-width="80"
          :model="userInfo">
      <FormItem v-if="userInfo.userId"
                label="用户ID"
                prop="id">
        <Input :value="userInfo.userId"
               placeholder="用户ID"
               disabled></Input>
      </FormItem>
      <FormItem label="用户账号"
                prop="account">
        <Input v-model="userInfo.account"
               placeholder="用户账号"></Input>
      </FormItem>
      <FormItem label="手机号"
                prop="phone">
        <Input v-model="userInfo.phone"
               placeholder="手机号"></Input>
      </FormItem>
      <FormItem label="密码"
                prop="password">
        <Input v-model="userInfo.password"
               type="password"
               :placeholder="userInfo.userId?'如需重置请填写':'用户密码'"></Input>
      </FormItem>
      <FormItem label="平台"
                prop="project">
        <Select v-model="userInfo.project"
                class="search-status">
          <Option :value='item.name'
                  :key="item.name"
                  v-for="item in gd.projectArray">{{item.name}}</Option>

        </Select>
      </FormItem>
      <FormItem label="账号组"
                prop="group">
        <Input v-model="userInfo.group"
               placeholder="账号组" :disabled="!!userInfo.userId"></Input>
      </FormItem>
      <FormItem label="用户昵称"
                prop="name">
        <Input v-model="userInfo.name"
               placeholder="用户昵称"></Input>
      </FormItem>
      <FormItem label="额外信息"
                prop="extInfo">
        <Input v-model="userExtInfo"
               :autosize="{minRows:3}"
               type="textarea"
               placeholder="额外信息"></Input>
      </FormItem>
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
import { addUser, updateUser } from '@/api/user'
import gd from '@/config/gd'

export default {
  name: 'user-info-config',
  components: {
  },
  props: {
    project: String,
    value: Boolean,
    userInfo: Object
  },
  watch: {
    value (val) {
      if (this.userInfo.userId) {
        this.ruleValidate.password.length = 0
      } else {
        this.ruleValidate.password[0] = { required: String, message: '密码不能为空', trigger: 'blur' }
      }
      this.$refs['userInfo'].resetFields()
      this.userInfo.project = this.projectName
    },
    project (value) {
      this.projectName = value
    }
  },
  data () {
    return {
      gd: gd,
      projectName: gd.projectArray[0].name,
      loading: false,

      ruleValidate: {

        account: [
          // { required: String, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          // { required: String, message: '密码不能为空', trigger: 'blur' }
        ],
        powers: [
          { required: true, message: '权限不能为空', trigger: 'blur' },
          { required: Array, message: '权限必须是一个数组', trigger: 'blur' }
        ],
        extInfo: [
          { validator: this.verifJson, trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    verifJson (rule, value, callback) {
      if (value instanceof Object) {
        return callback()
      }
      return callback(new Error('不为JSON对象'))
    },
    handleSubmit () {
      // console.log(JSON.stringify(authInfo, null, 4))

      if (!this.userInfo.extInfo) {
        this.userInfo.extInfo = {}
      }

      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          try {
            if (!this.userInfo.account && !this.userInfo.phone) {
              this.$Notice.warning({ title: '手机号跟账号不能同时为空', desc: '手机号跟账号不能同时为空' })
              return
            }

            let promise

            if (!this.userInfo.userId) {
              promise = addUser(this.userInfo)
            } else {
              promise = updateUser(this.userInfo)
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
          } catch (e) {
            console.log(e)
          }
        } else {
          this.$Message.error('数据校验失败!')
        }
      })
    }

  },
  computed: {
    userExtInfo: {
      set: function (value) {
        try {
          let obj = JSON.parse(value)
          if (obj instanceof Object) {
            this.userInfo.extInfo = obj
          } else {
            this.userInfo.extInfo = value
          }
        } catch (e) {
          this.userInfo.extInfo = value
        }
      },
      get: function () {
        if (this.userInfo.extInfo instanceof Object) {
          return JSON.stringify(this.userInfo.extInfo, null, 4)
        } else {
          return this.userInfo.extInfo || '{}'
        }
      }
    }
  },
  mounted () {
    this.userInfo.extInfo = this.userInfo.extInfo || {}
  }

}
</script>

<style lang="less">
</style>
