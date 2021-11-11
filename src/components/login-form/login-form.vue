<template>
  <Form ref="loginForm"
        :model="form"
        :rules="rules"
        @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName"
             placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16"
              type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password"
             v-model="form.password"
             placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14"
              type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>
    <template v-if="this.captchaID">

      <FormItem prop="captcha">
        <Input type="text"
               v-model="form.captcha"
               placeholder="请输入验证码">

        <span slot="prepend">
          验证码 ：
        </span>
        </Input>
        <img :src="imgSrc"
             alt="验证码" />
      </FormItem>

    </template>

    <FormItem>
      <Button @click="handleSubmit"
              type="primary"
              long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import config from '@/config'
export default {
  name: 'LoginForm',
  props: {
    captchaID: String,
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    captchaID () {
      console.log('x', this.captchaID)
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        captcha: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    },
    imgSrc () {
      const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

      return `${baseUrl}/stream/captcha?id=${this.captchaID}`
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            captcha: this.form.captcha,
            id: this.captchaID
          })
        }
      })
    }
  }
}
</script>
