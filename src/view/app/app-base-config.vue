<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="tempAppInfo.key==null?`新增App`:`App基础信息修改`"
         width="600">

    <Form :rules="ruleValidate"
          ref="appInfo"
          :model="appInfo">

      <FormItem label="Key"
                prop="key">
        <Input v-model="appInfo.key"
               :maxlength="32"
               placeholder="key, 不填自动生成"
               :disabled="tempAppInfo.key?true:false"></Input>
      </FormItem>

      <FormItem label="名称"
                prop="name">
        <Input v-model="appInfo.name"
               placeholder="名称"></Input>
      </FormItem>
      <FormItem label="访问标识"
                prop="domain">
        <Input v-model="appInfo.domain"
               placeholder="访问标识"></Input>
      </FormItem>
      <FormItem label="平台"
                prop="project">
        <Select v-model="appInfo.project"
                class="search-status">
          <Option :value='item.name'
                  :key="item.name"
                  v-for="item in gd.projectArray">{{item.name}}</Option>

        </Select>
      </FormItem>
      <FormItem label="状态"
                prop="status">

        <RadioGroup v-model="appInfo.status"
                    type="button">
          <Radio :label="1">正常</Radio>
          <Radio :label="0">禁用</Radio>
        </RadioGroup>
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

import { addApp, updateApp } from '@/api/appInfo'
import gd from '@/config/gd'
export default {
  name: 'app-base-config',
  components: {

  },
  props: {
    value: Boolean,
    tempAppInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['appInfo'].resetFields()
    },
    tempAppInfo (val) {
      if (val) {
        this.appInfo = JSON.parse(JSON.stringify(val))
        if (this.appInfo.status == null) {
          this.appInfo.status = 1
        }
      }
    }
  },
  data () {
    return {
      gd: gd,
      loading: false,

      ruleValidate: {
        key: [
          { validator: this.verifToken, trigger: 'blur' }

        ],
        name: [
          { required: String, message: '名字不能为空', trigger: 'blur' }
        ],
        domain: [
          { required: String, message: '访问标识不能为空', trigger: 'blur' }
        ]

      },
      appInfo: {}

    }
  },
  methods: {
    verifToken (rule, value, callback) {
      if (!value || value.length === 32) {
        return callback()
      }
      return callback(new Error('如要填写，请填满32位'))
    },
    handleSubmit () {
      this.$refs['appInfo'].validate((valid) => {
        if (valid) {
          let promise
          this.appInfo.appDomain = this.appInfo.domain
          if (!this.tempAppInfo.key) {
            promise = addApp(this.appInfo)
          } else {
            promise = updateApp(this.appInfo)
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
      })
    }

  },
  computed: {

  },
  mounted () {

  }

}
</script>

<style lang="less">
</style>
