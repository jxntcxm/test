
<style scoped>
.expand-row {
  margin-bottom: 5px;
}
.expand-value {
  color: red;
}
</style>
<template>
  <div>

    <span class="expand-key">角色信息: </span>
    <span class="expand-value">
      <pre>{{ JSON.stringify(appInfo, null, 4) }}</pre></span>

  </div>
</template>
<script>
export default {
  props: {
    appInfo: Object
  }
}
</script>
