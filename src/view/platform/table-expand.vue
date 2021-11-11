
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

    <span class="expand-key">项目信息: </span>
    <span class="expand-value">
      <pre>{{ JSON.stringify(platformInfo, null, 4) }}</pre></span>

  </div>
</template>
<script>
export default {
  props: {
    platformInfo: Object
  }
}
</script>
