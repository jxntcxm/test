<template>

  <div>

    <Form :label-width="120"
          v-if="config != null">

      <Collapse :value="'safe'"
                :accordion="true">
        <Panel name='safe'>
          账号密码登录安全设置
          <FormItem label="Duration"
                    slot="content"
                    prop="duration">
            <InputNumber style="width:100%"
                         v-model="config.loginSafeConfig.duration"></InputNumber>
            <label class="label-hint">在最近Duration秒内 ，同一账号登录次数超过ThresholdTimes次， 将需要验证码， 单位秒</label>
          </FormItem>
          <FormItem label="Interval"
                    slot="content"
                    prop="interval">
            <InputNumber style="width:100%"
                         v-model="config.loginSafeConfig.interval"></InputNumber>
            <label class="label-hint">相同账号允许登录尝试的最小间隔时间 单位秒</label>
          </FormItem>
          <FormItem label="ThresholdTimes"
                    slot="content"
                    prop="thresholdTimes">
            <InputNumber style="width:100%"
                         v-model="config.loginSafeConfig.thresholdTimes"></InputNumber>
            <label class="label-hint">在最近Duration秒内 ，同一账号登录次数超过ThresholdTimes次， 将需要验证码</label>
          </FormItem>
        </Panel>
        <Panel name='sms'>
          短信设置
          <FormItem label="万能验证码"
                    slot="content"
                    prop="mobileCaptcha">
            <Input type="text"
                   v-model="config.smsConfig.mobileCaptcha"></Input>
            <label class="label-hint">不填则没有万能验证码</label>
          </FormItem>
        </Panel>
        <Panel name='token'>
          Token过期设置

          <FormItem label="APP"
                    slot="content"
                    prop="app">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.app"></InputNumber>
            <label class="label-hint">App的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="微信小程序"
                    slot="content"
                    prop="wxMini">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.wxMini"></InputNumber>
            <label class="label-hint">微信小程序的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="支付宝小程序"
                    slot="content"
                    prop="zfbMini">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.zfbMini"></InputNumber>
            <label class="label-hint">支付宝小程序的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="终端"
                    slot="content"
                    prop="terminal">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.terminal"></InputNumber>
            <label class="label-hint">终端的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="微信公众号"
                    slot="content"
                    prop="wxPublic">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.wxPublic"></InputNumber>
            <label class="label-hint">微信公众号的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="支付宝公众号"
                    slot="content"
                    prop="zfbPublic">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.zfbPublic"></InputNumber>
            <label class="label-hint">支付宝公众号的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="后端管理WEB"
                    slot="content"
                    prop="adminWeb">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.adminWeb"></InputNumber>
            <label class="label-hint">后端管理WEB的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="PC端"
                    slot="content"
                    prop="adminWeb">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.pc"></InputNumber>
            <label class="label-hint">PC端的Token过期时间，单位分钟</label>
          </FormItem>
          <FormItem label="其它"
                    slot="content"
                    prop="default">
            <InputNumber style="width:100%"
                         v-model="config.sessionConfig.default"></InputNumber>
            <label class="label-hint">默认的Token过期时间，单位分钟</label>
          </FormItem>
        </Panel>
        <Panel name='cache'>
          缓存期限设置
          <FormItem label="数据缓存过期时间"
                    slot="content"
                    prop="cacheExpiration">
            <InputNumber style="width:100%"
                         v-model="config.cacheExpiration"></InputNumber>
            <label class="label-hint">数据缓存过期时间，单位秒</label>
          </FormItem>
          <FormItem label="验证码缓存过期时间"
                    slot="content"
                    prop="captchaExpiration">
            <InputNumber style="width:100%"
                         v-model="config.captchaExpiration"></InputNumber>
            <label class="label-hint">验证码缓存过期时间，单位秒</label>
          </FormItem>
        </Panel>
        <Panel name='auth'>
          是否开启鉴权

          <RadioGroup v-model="config.allAllow"
                      slot="content"
                      type="button">
            <Radio :label="1">全部允许</Radio>
            <Radio :label="0">正常鉴权</Radio>

          </RadioGroup>
        </Panel>
        <Panel name='powerRefreshLevel'>
          权限更新等级

          <RadioGroup v-model="config.powerRefreshLevel"
                      slot="content"
                      type="button">
            <Radio :label="1">强制退出</Radio>
            <Radio :label="2"
                   title="（以传入参数决定是否退出， 没传默认退出)">默认退出</Radio>
            <Radio :label="3"
                   title="（以传入参数决定是否退出， 没传默认不退出)">默认不退出</Radio>
            <Radio :label="4">强制不退出</Radio>

          </RadioGroup>
          <br slot="content" />
          <br slot="content" />
          <label slot="content"
                 class="label-hint">当权限更新时，与之相关的已登录的用户权限更新等级, 默认为[默认退出]</label>
        </Panel>
        <Panel name='other'>
          其它设置

          <FormItem label="能否录入基础数据"
                    slot="content"
                    prop="canInputBaseData">
            <RadioGroup v-model="config.canInputBaseData"
                        type="button">
              <Radio :label="1">能</Radio>
              <Radio :label="0">不能</Radio>
            </RadioGroup>
            <br />

            <label class="label-hint">生产环境禁止录入基础数据</label>
          </FormItem>

          <FormItem label="发送HTTP基础验证"
                    slot="content"
                    prop="authFailHttpBaseAuth">
            <RadioGroup v-model="config.authFailHttpBaseAuth"
                        type="button">
              <Radio :label="1">发送</Radio>
              <Radio :label="0">不发送</Radio>
            </RadioGroup>
            <br />

            <label class="label-hint">鉴权失败是否 发送HTTP基础权限验证头部</label>
          </FormItem>
        </Panel>
      </Collapse>

      <br />
      <Button type="primary"
              long
              @click="handleSubmit()">提交修改(5分钟内完全生效)</Button>

    </Form>

  </div>
</template>
<script>
import { getConfig, updateConfig } from '@/api/home.js'

export default {

  data () {
    return {
      loading: true,
      config: null
    }
  },
  methods: {
    async getConfig () {
      let { data } = await getConfig()
      this.loading = false
      this.config = data.object

      this.config.canInputBaseData = this.config.canInputBaseData ? 1 : 0
      this.config.allAllow = this.config.allAllow ? 1 : 0
      this.config.authFailHttpBaseAuth = this.config.authFailHttpBaseAuth ? 1 : 0
    },

    async handleSubmit () {
      let copyConfig = JSON.parse(JSON.stringify(this.config))
      copyConfig.allAllow = this.config.allAllow === 1
      copyConfig.canInputBaseData = this.config.canInputBaseData === 1
      copyConfig.authFailHttpBaseAuth = this.config.authFailHttpBaseAuth === 1
      let { data } = await updateConfig(copyConfig)

      if (data && data.errcode === '0') {
        this.$Notice.success({
          title: '提交数据成功'
        })
      } else {
        this.$Notice.error({
          title: '提交数据失败:' + data.errmsg
        })
      }
    }
  },
  mounted () {
    return this.getConfig()
  }
}
</script>
<style  lang="less">
.label-hint {
  color: #19be6b;
}
</style>
