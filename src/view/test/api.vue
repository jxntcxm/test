<template>
  <div>
    <Tabs type="card">
      <TabPane label="自由测试"
               class="free-test">

        <Row>
          <Col span="12">
          <Form :model="requestArgs"
                ref="requestArgs"
                :rules="ruleValidate"
                :label-width="80">
            <FormItem label="请求路径:"
                      prop="path">
              <Input v-model="requestArgs.path"
                     placeholder="请输入请求路径"></Input>
            </FormItem>
            <FormItem label="Auth:"
                      prop="auth">
              <Input v-model="requestArgs.auth"
                     placeholder="请输入Auth"></Input>
            </FormItem>
            <FormItem label="请求参数:"
                      prop="data">
              <Input v-model="requestData"
                     type="textarea"
                     :autosize="{minRows:5}"
                     placeholder="请输入参数（JSON字符串）"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary"
                      @click="submitRequest"
                      long>提交</Button>
              <!-- <Button style="margin-left: 8px">Cancel</Button> -->
            </FormItem>
          </Form>
          </Col>
          <Col span="1">
          <Divider type="vertical" />
          </Col>

          <Col span="11">
          <H2>请求参数</H2>
          <pre>{{JSON.stringify(result.req, null, 4)}}</pre>
          <H2>响应结果</H2>
          <pre>{{JSON.stringify(result.res, null, 4)}}</pre>

          </Col>
        </Row>

      </TabPane>

    </Tabs>
  </div>
</template>
<script>
import axios from 'axios'
import config from '@/config'

export default {
  components: {},

  data () {
    return {
      requestArgs: {
        path: '',
        auth: '',
        data: {}
      },
      result: {
        res: {},
        req: {
          data: {},
          url: '',
          headers: {},
          mothod: ''
        }
      },
      ruleValidate: {
        path: [
          { required: String, message: '路径不能为空', trigger: 'blur' }
        ],
        auth: [
          { required: String, message: 'auth不能为空', trigger: 'blur' }
        ],
        data: [
          { required: true, validator: this.verifJson, trigger: 'blur' }
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
    submitRequest () {
      this.$refs['requestArgs'].validate((valid) => {
        const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

        if (valid) {
          setTimeout(() => {
            let args = this.requestArgs
            this.result.req = {}
            let req = this.result.req
            req.url = `${baseUrl}${args.path}?auth=${args.auth}`
            req.method = 'post'
            req.headers = {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8'
            }
            req.data = args.data

            axios.post(baseUrl + args.path, req.data, {
              params: {
                auth: args.auth
              },
              headers: req.headers

            }).then((response) => {
              console.log(JSON.stringify(response, null, 4))
              let res = {}
              res.data = response.data
              res.status = response.status
              res.headers = response.headers
              this.result.res = res
            }).catch((error) => {
              console.log(JSON.stringify(error, null, 4))
              let res = {}
              res.data = error.response.data
              res.status = error.response.status
              res.headers = error.response.headers
              this.result.res = res
            })
          }, 0)
        } else {
          this.$Message.error('数据校验失败!')
        }
      })
    }
  },
  computed: {
    requestData: {
      set: function (value) {
        try {
          let obj = JSON.parse(value)
          if (obj instanceof Object) {
            this.requestArgs.data = obj
          } else {
            this.requestArgs.data = value
          }
        } catch (e) {
          this.requestArgs.data = value
        }
      },
      get: function () {
        if (this.requestArgs.data instanceof Object) {
          return JSON.stringify(this.requestArgs.data, null, 4)
        } else {
          return this.requestArgs.data || '{}'
        }
      }
    }
  },
  mounted () {

  }
}
</script>
<style  lang="less">
.free-test {
}
</style>
