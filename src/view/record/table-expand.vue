
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
    <Row class="expand-row">
      <Col span="24">
      <span class="expand-key">记录详情: </span>
      <span class="expand-value">
        <pre>{{ JSON.stringify(record, null, 4) }}</pre></span>
      </Col>

    </Row>

  </div>
</template>
<script>
export default {
  props: {
    record: Object
  }
}
</script>
