<template>
  <div>
    <div>
      <h1>开放权限编辑
        <Button type="success"
                shape="circle"
                icon="md-settings"
                title="点击切换模式"
                @click="switching">{{btnText}}</Button>
      </h1>
      <div class="search-con search-con-top">
        <label>&nbsp;&nbsp;切换平台&nbsp;&nbsp;</label>
        <Select v-model="projectName"
                class="search-status">
          <Option :value='item.name'
                  :key="item.name"
                  v-for="item in gd.projectArray">{{item.name}}</Option>
        </Select>
      </div>
    </div>
    <APITreeSelect :powerLevelSelect="true"
                   :powerLevelSelectDisabled="powerLevelSelectDisabled"
                   :project="projectName"
                   ref="uiTreeSelect"></APITreeSelect>
  </div>
</template>
<script>
import gd from '@/config/gd'
import APITreeSelect from '@/view/app/api-tree-select.vue'
export default {
  components: {
    APITreeSelect
  },
  data: function () {
    return {
      gd: gd,
      projectName: gd.projectArray[0].name,
      btnText: '当前只读模式',
      powerLevelSelectDisabled: true
    }
  },
  methods: {
    switching () {
      this.powerLevelSelectDisabled = !this.powerLevelSelectDisabled

      if (this.powerLevelSelectDisabled) {
        this.btnText = '当前只读模式'
      } else {
        this.btnText = '当前编辑模式'
      }
    }
  }
}
</script>
<style  lang="less">
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 100px;
    }

    &-status {
      display: inline-block;
      width: 100px;
      margin-left: 2px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 5px;
    }
  }
  .new-btn {
    margin-left: 5px;
  }
}
</style>
