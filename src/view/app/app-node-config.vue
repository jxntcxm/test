<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="(nodeInfo.key==null?`新增节点`:`节点信息修改`)+(attribute===`apiTree`?``:`(UI菜单，用户中心只管存取， 不管含义)`)"
         width="600">

    <Form :rules="ruleValidate"
          ref="nodeInfo"
          :label-width="80"
          :model="nodeInfo">
      <Row>
        <Col span="24">
        <FormItem label="名称"
                  prop="name">
          <Input v-model="nodeInfo.name"
                 placeholder="name" />
        </FormItem>

        <template v-if="attribute==='apiTree'">
          <FormItem label="路径"
                    prop="path">
            <Input v-model="nodeInfo.path"
                   placeholder="路径" />

          <Tooltip max-width="500" >
          <Icon type="md-help-circle" />
              <div slot="content">

              <p>如果有路径参数，请用【{参数名}】或【:参数名】的方式,该方式会匹配一级，
如果不确定级数， 则可用【*】， 【*】会匹配剩下的，
<br/>
比如完整路径是【/12/*】， 则会匹配所有【/12/】开头的路径， 比如【/12/12】, 【/12/3232/3232】。
而【/12/{id}/12】, 只会匹配/12/fd/12, 不会匹配/12/cx/13/, 也不会匹配/12/xx/
                  </p>
              </div>
          </Tooltip>

          </FormItem>

          <FormItem label="完整路径:">
            <span style="color:red;font-size:16px;"> {{(nodeInfo.fatherFullPath||"")+'/'+(nodeInfo.path||"")}}</span>
          </FormItem>

          <FormItem label="类型:">
            <RadioGroup v-model="isMenu"
                        type="button">
              <Radio label="menu">目录</Radio>
              <Radio label="url">路径</Radio>

            </RadioGroup>
            &nbsp;&nbsp;
            <Tooltip max-width="500" >
            <Icon type="md-help-circle" />
                <div slot="content">
                <p>目录类似文件夹的效果</p>
                <p>路径才是真正的接受访问的URL</p>
                </div>
            </Tooltip>
          </FormItem>

          <template v-if="showMethod">
            <FormItem label="权限等级:">
              <RadioGroup v-model="nodeInfo.powerLevel"
                          type="button">
                <Radio :label="2">公开</Radio>
                <Radio :label="1">登录就有</Radio>
                <Radio :label="0">需角色校验</Radio>
              </RadioGroup>
            &nbsp;&nbsp;
            <Tooltip max-width="500" >
            <Icon type="md-help-circle" />
                <div slot="content">
                <p>公开：所有人都可以访问， 不需要Token</p>
                <p>登录就有：只要有Token就能访问, Token则只要一登录就有</p>
                <p>需角色校验：需要有Token， 并且Token所对应的用户有被授权 才能访问</p>
                </div>
            </Tooltip>
            </FormItem>
            <FormItem label="允许Method"
                      prop="methods">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox :indeterminate="indeterminate"
                          :value="checkAll"
                          @click.prevent.native="handleCheckAll">全选</Checkbox>
              </div>
              <CheckboxGroup v-model="checkMethodGroup">
                <Checkbox :label="method.value"
                          :key="method.name+'-'+index"
                          v-for="(method,index) in methods">{{method.name}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </template>
        </template>
        <template v-else>
          <FormItem label="AuthKey"
                    prop="authKey">
            <Input v-model="nodeInfo.authKey"
                   placeholder="请输入authKey"/>
          </FormItem>
          <FormItem label="Tag"
                    prop="tag">
            <Input v-model="nodeInfo.tag"
                   placeholder="请输入Tag"/>

          </FormItem>
          <FormItem label="Text"
                    prop="text">
            <Input v-model="nodeInfo.text"
                   placeholder="请输入Text"/>

          </FormItem>
          <FormItem label="Size"
                    prop="size">
            <Input v-model="nodeInfo.text"
                   placeholder="请输入Size"/>

          </FormItem>
          <FormItem label="类别"
                    prop="type">
            <Select v-model="nodeInfo.type">
              <Option :value="1"> 菜单 </Option>
              <Option :value="2"> 功能 </Option>
              <Option :value="3"> 页面 </Option>
              <Option :value="0"> 其它 </Option>
            </Select>
          </FormItem>
          <FormItem label="图标"
                    prop="icon">
            <Input v-model="nodeInfo.icon"
                   placeholder="请输入图标"/>
          </FormItem>
          <FormItem label="Index"
                    prop="index">
            <Input v-model="nodeInfo.index"
                   placeholder="index"/>
          </FormItem>
          <FormItem label="额外信息"
                    prop="extInfo">
            <Input v-model="nodeInfo.extInfo"
                   type="textarea"
                   placeholder="额外信息"/>
          </FormItem>

          <FormItem label="依赖权限:"
                    prop="apiTreeIdArray"
                    :title="JSON.stringify(nodeInfo.apiTreeIdArray)">

            <Button type="primary"
                    @click="showAPITreeSelect=true"
                    style="">查看 | 修改</Button>
          </FormItem>
        </template>

        </Col>

      </Row>

    </Form>

    <Modal :mask-closable="false"
           v-model="showAPITreeSelect"
           @on-ok="selectApiTreeFinish"
           :width="800">

      <ApiTreeSelect :apiTreeIdArray="nodeInfo.apiTreeIdArray"
                     ref="apiTreeSelect"
                     :appInfo="appInfo"></ApiTreeSelect>

    </Modal>

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
import { addAPITree, updateAPITree } from '@/api/appInfo'
import ApiTreeSelect from './api-tree-select.vue'
export default {
  name: 'app-node-config',
  components: {
    ApiTreeSelect
  },
  props: {
    value: Boolean,
    attribute: String,
    tempNodeInfo: Object,
    appInfo: Object
  },
  watch: {
    value (val) {
      this.$refs['nodeInfo'].resetFields()
      if (this.nodeInfo) {
        this.showMethod = !this.nodeInfo.isMenu
      }
      if (this.showMethod) {
        this.isMenu = 'url'
      } else {
        this.isMenu = 'menu'
      }
    },
    tempNodeInfo (val) {
      if (val) {
        this.nodeInfo = JSON.parse(JSON.stringify(val))
        this.showMethod = !this.nodeInfo.isMenu
        if (val.id == null) {
          this.handleCheckAll()
          if (this.checkMethodGroup.length === 0) {
            this.handleCheckAll()
          }
        } else {
          this.checkMethodGroup = []
          this.methods.forEach(v => {
            if ((v.value & val.method) !== 0) {
              this.checkMethodGroup.push(v.value)
            }
          })
        }
      }
      if (this.showMethod) {
        this.isMenu = 'url'
      } else {
        this.isMenu = 'menu'
      }
    }
  },
  data () {
    return {
      showMethod: false,
      checkMethodGroup: [],

      methods: [
        { name: 'GET', value: 1 << 0 },
        { name: 'POST', value: 1 << 1 },
        { name: 'HEAD', value: 1 << 2 },
        { name: 'OPTIONS', value: 1 << 3 },
        { name: 'PUT', value: 1 << 4 },
        { name: 'PATCH', value: 1 << 5 },
        { name: 'DELETE', value: 1 << 6 },
        { name: 'TRACE', value: 1 << 7 },
        { name: 'CONNECT', value: 1 << 8 }
      ],
      loading: false,

      ruleValidate: {
        path: [{ required: String, message: '路径不能为空', trigger: 'blur' }],
        name: [{ required: String, message: '名字不能为空', trigger: 'blur' }],
        authKey: [
          { required: String, message: 'AuthKey不能为空', trigger: 'blur' }
        ]
      },
      nodeInfo: {},
      showAPITreeSelect: false
    }
  },
  methods: {
    selectApiTreeFinish () {
      this.nodeInfo.apiTreeIdArray = this.$refs['apiTreeSelect'].getSelect()
    },

    handleSubmit () {
      this.$refs['nodeInfo'].validate(valid => {
        if (this.attribute === 'apiTree') {
          let method = 0
          this.checkMethodGroup.forEach(v => {
            method |= v
          })
          this.nodeInfo.method = method
        }
        if (valid) {
          let promise

          if (!this.tempNodeInfo.id) {
            promise = addAPITree(this.nodeInfo)
          } else {
            promise = updateAPITree(this.nodeInfo)
          }
          promise
            .then(res => {
              let data = res.data
              if (data.errcode === '0') {
                this.$Notice.success({
                  title: '提交数据成功'
                })
                this.$emit('input', false)
                this.$emit('commitSuccess', data.object)
              } else {
                console.log(data.errmsg)
                this.$Notice.warning({
                  title: '提交数据失败',
                  desc: data.errmsg
                })
              }
            })
            .catch(e => {
              this.$Notice.error({ title: '提交数据失败', desc: e })
            })
        } else {
          this.$Message.error('数据校验失败!')
        }
      })
    },
    handleCheckAll () {
      let checkAll = false
      if (this.indeterminate) {
        checkAll = false
      } else {
        checkAll = !this.checkAll
      }

      if (checkAll) {
        this.checkMethodGroup = []
        this.methods.forEach(v => {
          this.checkMethodGroup.push(v.value)
        })
      } else {
        this.checkMethodGroup = []
      }
    }
  },
  computed: {
    indeterminate () {
      if (
        this.checkMethodGroup.length !== this.methods.length &&
        this.checkMethodGroup.length !== 0
      ) {
        return true
      }
      return false
    },
    checkAll () {
      return this.checkMethodGroup.length === this.methods.length
    },

    isMenu: {
      set (val) {
        if (val === 'menu') {
          this.nodeInfo.isMenu = true
        } else {
          this.nodeInfo.isMenu = false
        }
        this.showMethod = !this.nodeInfo.isMenu
      },
      get () {
        if (this.nodeInfo.isMenu) {
          return 'menu'
        } else {
          return 'url'
        }
      }
    }
  },
  mounted () {}
}
</script>

<style lang="less">
</style>
