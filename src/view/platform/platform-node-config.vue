<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="(nodeInfo.key==null?`新增节点`:`节点信息修改`)+(`(UI菜单，用户中心只管存取， 不管含义)`)"
         width="600">

    <Form :rules="ruleValidate"
          style="height:300px;overflow:auto"
          ref="nodeInfo"
          :label-width="80"
          :model="nodeInfo">
      <Row>
        <Col span="24">
        <FormItem label="名称"
                  prop="name">
          <Input v-model="nodeInfo.name"
                 placeholder="name"></Input>
        </FormItem>

        <template>
          <FormItem label="AuthKey"
                    prop="authKey">
            <Input v-model="nodeInfo.authKey"
                   placeholder="请输入authKey"></Input>
          </FormItem>
          <FormItem label="Text"
                    prop="text">
            <Input v-model="nodeInfo.text"
                   placeholder="请输入Text"></Input>

          </FormItem>
          <FormItem label="Index"
                    prop="index">
            <InputNumber v-model="nodeInfo.index"
                         style="width:100%"
                         placeholder="请输入Index"></InputNumber>

          </FormItem>
          <FormItem label="Size"
                    prop="size">
            <InputNumber v-model="nodeInfo.size"
                         style="width:100%"
                         placeholder="请输入Size"></InputNumber>

          </FormItem>
          <FormItem label="Action"
                    prop="action">
            <Input v-model="nodeInfo.tag"
                   placeholder="请输入action"></Input>

          </FormItem>
          <FormItem label="ActionMode"
                    prop="actionMode">
            <Input v-model="nodeInfo.actionMode"
                   placeholder="请输入actionMode"></Input>

          </FormItem>
          <FormItem label="RightMark"
                    prop="rightMark">
            <Input v-model="nodeInfo.rightMark"
                   placeholder="请输入rightMark"></Input>

          </FormItem>
          <FormItem label="url"
                    prop="url">
            <Input v-model="nodeInfo.url"
                   placeholder="请输入URL"></Input>

          </FormItem>
          <FormItem label="类别"
                    prop="type">
            <Select v-model="nodeInfo.type">
              <Option :value="1"> 菜单 </Option>
              <Option :value="2"> 功能 </Option>
              <Option :value="3"> 页面 </Option>
              <Option :value="4"> 模块 </Option>
              <Option :value="0"> 其它 </Option>
            </Select>
          </FormItem>

          <FormItem label="icon"
                    prop="icon">
            <Input v-model="nodeInfo.icon"
                   placeholder="请输入icon"></Input>
          </FormItem>

          <FormItem label="extInfo"
                    prop="extInfo">
            <Input v-model="nodeInfo.extInfo"
                   type="textarea"
                   placeholder="额外信息"></Input>
          </FormItem>

          <FormItem label="依赖权限:">
            <Button type="primary"
                    @click="apiTreeShow"
                    style="">查看 | 修改</Button>
          </FormItem>
        </template>

        </Col>

      </Row>

    </Form>

    <APITreeSelect :apiTreeIdArray="nodeInfo.relyAPI"
                   :project="project"
                   ref="apiTreeSelect"
                   @callback="nodeInfo.relyAPI = $event"></APITreeSelect>

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

import { addUITree, updateUITree } from '@/api/platform'
import APITreeSelect from '../app/api-tree-select.vue'
export default {
  name: 'platform-node-config',
  components: {
    APITreeSelect
  },
  props: {
    project: String,
    value: Boolean,
    tempNodeInfo: Object,
    platformInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['nodeInfo'].resetFields()
    },
    tempNodeInfo (val) {
      if (val) {
        this.nodeInfo = JSON.parse(JSON.stringify(val))
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
        // authKey: [
        //   { required: String, message: 'AuthKey不能为空', trigger: 'blur' }
        // ]

      },
      nodeInfo: { index: 10, size: 10, type: 10 }
    }
  },
  methods: {
    apiTreeShow () {
      this.$refs.apiTreeSelect.showDialog()
    },

    handleSubmit () {
      this.$refs['nodeInfo'].validate((valid) => {
        if (valid) {
          let promise
          if (!this.tempNodeInfo.id) {
            promise = addUITree
          } else {
            promise = updateUITree
          }
          delete this.nodeInfo.data
          delete this.nodeInfo.children
          promise(this.platformInfo.platformId, this.nodeInfo.fatherLine, this.nodeInfo).then(res => {
            let data = res.data
            if (data.errcode === '0') {
              this.$Notice.success({
                title: '提交数据成功'
              })
              this.$emit('input', false)
              this.$emit('commitSuccess', data.object)
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

    checkAll () { return this.checkMethodGroup.length === this.methods.length }

  },
  mounted () {

  }

}
</script>

<style lang="less">
</style>
