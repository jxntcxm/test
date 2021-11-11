<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"
                      :captchaID="captchaID"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
    <div class="copyright">备案号:闽ICP备15007885号-1</div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data: () => {
    return {
      captchaID: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),

    handleSubmit ({ userName, password, captcha, id }) {
      this.handleLogin({ userName, password, captcha, id }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        }).catch(e => {
          console.log(e)

          this.$Notice.error({ title: '登录失败', desc: e })
        })
      }).catch(e => {
        console.log(e)
        if (typeof e !== 'string') {
          let errcode = e.errcode

          if (errcode !== '0') {
            this.$Notice.error({ title: '登录失败', desc: e.errmsg })

            if (e.object) {
              this.captchaID = e.object.id
            } else {
              this.captchaID = null
            }
          }

          return
        }
        this.$Notice.error({ title: '登录失败', desc: e })
      })
    }
  }
}
</script>

<style>
</style>
