<template>
  <div>

    <div class="search-con search-con-top">
      <label>&nbsp;&nbsp;切换平台&nbsp;&nbsp;</label>
      <Select v-model="projectName"
              @on-change="changeProject"
              class="search-status">
        <Option :value='item.name'
                :key="item.name"
                v-for="item in gd.projectArray">{{item.name}}</Option>
      </Select>
    </div>

    <UITreeSelect :uiTree="uiPower"
                  :height="500"
                  ref="uiTreeSelect"
                  :project="projectName"
                  :title="'基础UI配置'"></UITreeSelect>

    <Button type="success"
            @click="handleSubmit"
            long>提交</Button>
  </div>

</template>
<script>
import gd from '@/config/gd'
import UITreeSelect from '../app/ui-tree-select.vue'
import { getRoleList, updateRole } from '@/api/data'
export default {
  components: { UITreeSelect },
  props: {

  },

  data () {
    return {
      gd: gd,
      projectName: gd.projectArray[0].name,
      baseRole: null,
      uiPower: null
    }
  },
  methods: {
    changeProject () {
      this.getRoleList()
    },
    getRoleList () {
      this.loading = true

      return getRoleList({ roleIdArray: [1], project: this.projectName }).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object

          if (!data || data.length === 0) {
            // this.$Message.error('没有数据')
            return
          }

          this.baseRole = data[0]
          this.uiPower = this.baseRole.uiPower
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    },
    handleSubmit () {
      let uiPower = this.$refs['uiTreeSelect'].getSelect()

      let promise
      this.baseRole.uiPower = Object.assign({}, uiPower)

      this.baseRole.isBase = true

      promise = updateRole(this.baseRole)

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
    }
  },

  mounted () {
    this.getRoleList()
  }
}
</script>

<style  lang="less">
.search-con {
  padding: 10px 0;
}
</style>
