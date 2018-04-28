<template>
  <div>
    <v-detail></v-detail>
  </div>
</template>

<script>
  import VDetail from "@/pages-member/idevices/v-detail";

  import storeTypes from "@/store/types";

  export default {
    name: "iwater-view-detail",
    desc: "净水器详情界面",
    components: {VDetail},
  }
</script>

