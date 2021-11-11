
<template>
  <Form ref="userInfo"
        style="width:500px;"
        :model="userInfo"
        :rules="ruleInline">
    <FormItem prop="name"
              label="昵称">
      <Input type="text"
             v-model="userInfo.name"
             placeholder="请输入昵称">
      <Icon type="ios-person-outline"
            slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password"
              label="旧密码">
      <Input type="password"
             v-model="userInfo.password"
             placeholder="请输入旧密码">
      <Icon type="ios-lock-outline"
            slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="newPassword"
              label="新密码">
      <Input type="password"
             v-model="userInfo.newPassword"
             placeholder="请输入新密码">
      <Icon type="ios-lock-outline"
            slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="renewPassword"
              label="确认新密码">
      <Input type="password"
             v-model="userInfo.renewPassword"
             placeholder="请确认新密码">
      <Icon type="ios-lock-outline"
            slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary"
              @click="handleSubmit('userInfo')">提交修改</Button>
    </FormItem>
  </Form>
</template>
<script>

import { getUserInfo, updateUserBase } from '@/api/user'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        password: '',
        newPassword: '',
        renewPassword: ''
      },
      ruleInline: {
        name: [
          { required: true, message: 'Please fill in the user name', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ],
        renewPassword: [
          { required: true, validator: this.verifRenewPassword }

        ]
      }
    }
  },
  methods: {
    verifRenewPassword (rule, value, callback) {
      if (value === this.userInfo.newPassword) {
        return callback()
      }
      return callback(new Error('新密码不相同'))
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.updateUserBase()
        } else {
          this.$Message.error('表单校验失败!')
        }
      })
    },
    updateUserBase () {
      console.log(this.userInfo.name)
      updateUserBase(this.userInfo.name, this.userInfo.password, this.userInfo.newPassword).then(res => {
        const data = res.data
        if (data.errcode === '0') {
          this.$Message.success('修改成功')
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        console.log(e)
        this.$Message.error(e.toString())
      })
    }

  },
  mounted () {
    getUserInfo().then(res => {
      const data = res.data

      console.log(data)
      if (data.errcode === '0') {
        this.userInfo.name = data.object.userInfo.name
      } else {
        console.log(e)
        this.$Message.error(e.toString())
      }
    }).catch(e => {
      console.log(e)
      this.$Message.error(e.toString())
    })
  }
}
</script>
