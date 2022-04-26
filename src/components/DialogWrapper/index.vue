<template>
  <div class="from-wrapper" :style="{maxWidth: MaxWidth+'px'}" >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      MaxWidth: {
        type: Number,
        default: 500
      }
    }
  }
</script>

<style lang="scss" scoped>
  .from-wrapper{
    margin: auto;
  }
</style>
