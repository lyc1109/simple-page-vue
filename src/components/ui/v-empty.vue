<template>
<div>
  <div class="padding-m align-center font-light block-center">
    <img :src="$filters.staticImg('/static/images/empty/no-list.png')" class="tips"/>
    <p class="font-lighter">夹一页安静，留一片空白</p>
  </div>
</div>
</template>

<script>
    export default {
      name: "v-empty"
    }
</script>
