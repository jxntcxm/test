<template>

  <Modal :mask-closable="false"
         :value="value"
         @input="$emit('input', false)"
         title="角色配置"
         width="800"
         :footer-hide="true">

    <UserPowerConfig ref="userPowerConfig"
              :project="project"
              :selectedRole="selectedRole"
              :userId="userId"></UserPowerConfig>

  </Modal>

</template>

<script>

import UserPowerConfig from './user-power-config'
import { getRoleInfo } from '@/api/user'

export default {
  name: 'role-info-config',
  components: {
    UserPowerConfig
  },
  props: {
    project: String,
    value: Boolean,
    roleInfo: Object
  },
  data () {
    return {

      loading: false,
      selectedRole: [],
      userId: ''

    }
  },
  methods: {
    formatRoleDatas (data) {
      const retObj = []
      for (const i in data) {
        const tmp = data[i]
        for (const j in tmp) {
          const tmpObj = Object.assign({}, tmp[j])
          tmpObj.spaceName = i
          retObj.push(tmpObj)
        }
      }
      this.selectedRole = retObj
    }
  },
  watch: {
    async roleInfo (val) {
      const { data } = await getRoleInfo(val.userId)
      this.userId = val.userId
      const roledata = data.object ? data.object : {}
      this.formatRoleDatas(roledata)
    }
  },
  mounted () {
  }

}
</script>

<style lang="less">
</style>
