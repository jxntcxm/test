<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="tempPlatformInfo.platformId==null?`新增Platform`:`Platform基础信息修改`"
         width="600">

    <Form :rules="ruleValidate"
          ref="platformInfo"
          :model="platformInfo">

      <FormItem label="PlatformID"
                prop="platformId">
        <Input v-model="platformInfo.platformId"
               :maxlength="32"
               placeholder="platformId, 不填自动生成"
               :disabled="tempPlatformInfo.platformId?true:false"></Input>
      </FormItem>

      <FormItem label="名称(唯一索引)"
                prop="name">
        <Input v-model="platformInfo.name"
               placeholder="名称"></Input>
      </FormItem>
      <FormItem label="标识"
                prop="name">
        <Input v-model="platformInfo.tag"
               placeholder="标识"></Input>
      </FormItem>
      <FormItem label="平台"
                prop="project">
        <Select v-model="platformInfo.project"
                class="search-status">
          <Option :value='item.name'
                  :key="item.name"
                  v-for="item in gd.projectArray">{{item.name}}</Option>

        </Select>
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

import { addPlatform, updatePlatform } from '@/api/platform'
import gd from '@/config/gd'
export default {
  name: 'platform-base-config',
  components: {

  },
  props: {
    value: Boolean,
    tempPlatformInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['platformInfo'].resetFields()
    },
    tempPlatformInfo (val) {
      if (val) {
        this.platformInfo = JSON.parse(JSON.stringify(val))
        if (this.platformInfo.status == null) {
          this.platformInfo.status = 1
        }
      }
    }
  },
  data () {
    return {
      gd: gd,
      loading: false,

      ruleValidate: {
        platformId: [
          { validator: this.verifToken, trigger: 'blur' }

        ],
        name: [
          { required: String, message: '名字不能为空', trigger: 'blur' }
        ],
        domain: [
          { required: String, message: '访问标识不能为空', trigger: 'blur' }
        ]

      },
      platformInfo: {}

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
      this.$refs['platformInfo'].validate((valid) => {
        if (valid) {
          let promise
          this.platformInfo.platformDomain = this.platformInfo.domain
          if (!this.tempPlatformInfo.platformId) {
            promise = addPlatform(this.platformInfo)
          } else {
            promise = updatePlatform(this.platformInfo)
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
