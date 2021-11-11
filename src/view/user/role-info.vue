<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         :title="`角色信息查看`"
         width="500">

    <div style="height:300px;overflow-y:auto">
      <UITreeSelect :uiTree="roleInfo.uiPower"
                    :checkBoxDisabled="true"
                    :project="project"
                    ref="uiTreeSelect"></UITreeSelect>
    </div>

    <div slot="footer">

    </div>
  </Modal>

</template>

<script>
import { getRoleList } from '@/api/data'
import UITreeSelect from '@/view/app/ui-tree-select.vue'
export default {
  name: 'role-config',
  components: {
    UITreeSelect
  },
  props: {
    project: String,
    value: Boolean,
    roleId: Number
  },
  watch: {

    roleId (val) {
      if (val) {
        this.getRoleInfo()
      }
    }

  },
  data () {
    return {
      loading: false,
      roleId2Info: {},
      roleInfo: {}
    }
  },
  methods: {

    getRoleInfo () {
      if (!this.roleId2Info[this.roleId]) {
        const param = {
          'curPageNum': 1,
          'pageSize': 10,
          'roleIdArray': [this.roleId]
        }
        if (this.project) {
          param.project = this.project
        }
        getRoleList(param).then(res => {
          let data = res.data
          if (data.errcode === '0') {
            if (data.object) {
              this.roleId2Info[this.roleId] = data.object[0]
              this.roleInfo = this.roleId2Info[this.roleId]
            }
          } else {
            this.$Notice.warning({ title: '获取数据失败', desc: data.errmsg })
          }
        }).catch(e => {
          this.$Notice.error({ title: '获取数据失败', desc: e })
        })
      } else {
        this.roleInfo = this.roleId2Info[this.roleId]
      }
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
