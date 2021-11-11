<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="tempProjectInfo==null?`新增平台`:`平台基础信息修改`"
         width="600">

    <Form :rules="ruleValidate"
          ref="projectInfo"
          :model="projectInfo">

      <FormItem label="名称(唯一索引)"
                prop="name">
        <Input v-model="projectInfo.name"
               placeholder="名称"
               :disabled="tempProjectInfo!=null"></Input>
      </FormItem>
      <FormItem label="描述"
                prop="desc">
        <Input v-model="projectInfo.desc"
               placeholder="描述"></Input>
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

import { addProject, updateProject } from '@/api/project'
export default {
  name: 'project-base-config',
  components: {

  },
  props: {
    value: Boolean,
    tempProjectInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['projectInfo'].resetFields()
    },
    tempProjectInfo (val) {
      if (val) {
        this.projectInfo = JSON.parse(JSON.stringify(val))
        if (this.projectInfo.status == null) {
          this.projectInfo.status = 1
        }
      }
    }
  },
  data () {
    return {

      loading: false,

      ruleValidate: {

        name: [
          { required: String, message: '名字不能为空', trigger: 'blur' }
        ]

      },
      projectInfo: {
        name: '',
        desc: ''
      }

    }
  },
  methods: {

    handleSubmit () {
      this.$refs['projectInfo'].validate((valid) => {
        try {
          if (valid) {
            let promise

            if (!this.tempProjectInfo) {
              promise = addProject(this.projectInfo)
            } else {
              promise = updateProject(this.projectInfo)
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
        } catch (error) {
          console.log(error)
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
