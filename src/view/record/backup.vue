<template>
  <div>
    <div>

      <label>&nbsp;&nbsp;表名&nbsp;&nbsp;</label>
      <CheckboxGroup v-model="tableArray">

        <Checkbox :label="tableName"
                  :key="key"
                  v-for="(tableName,key) in allTableArray"></Checkbox>
      </CheckboxGroup>
      <br />

      <Button @click="backup"
              type="primary">
        &nbsp;&nbsp;简单导出&nbsp;&nbsp;</Button>
      &nbsp;&nbsp;
      <Button @click="reset"
              type="warning">
        &nbsp;&nbsp;重置&nbsp;&nbsp;</Button>
      <br />
      <br />
      <div style="position: relative;">
        <Input v-model="backupData"
               type="textarea"
               :rows="20"
               placeholder="" />
        <Spin size="large"
              fix
              v-if="loading"></Spin>
      </div>
    </div>

  </div>
</template>
<script>
import { backup } from '@/api/backup'

export default {

  data () {
    return {
      loading: false,
      allTableArray: ['appInfo', 'appSecret', 'platform', 'config', 'loginBind', 'role', 'roleBind', 'user', 'project'],
      tableArray: ['appInfo', 'appSecret', 'platform'],
      backupData: ''
    }
  },
  methods: {

    reset () {
      this.backupData = ''
      this.tableArray = ['appInfo', 'appSecret', 'platform']
    },
    backup () {
      this.loading = true
      this.backupData = ''
      return backup(this.tableArray).then(res => {
        let data = res.data
        if (data.errcode === '0') {
          this.loading = false
          data = data.object

          for (var k in data) {
            this.backupData += data[k]
          }
        } else {
          this.$Message.error(data.errmsg)
        }
      }).catch(e => {
        this.$Message.error(e.toString())
      })
    }

  },
  computed: {

  },
  mounted () {
    return this.fetchData()
  }
}
</script>
