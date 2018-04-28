<script>
  export default {
    name: "v-script",
    /*render: function(createElement) {
      //console.log("渲染创建script标签");
      return createElement('script', {attrs: {type: 'text/javascript', src: this.src}})
    },*/
    props: {
      // script脚本CDN地址或本地目录
      src: {
        type: String,
        required: true
      }
    },
    created(){
      let scriptNode = document.createElement("script");
      scriptNode.setAttribute("type", "text/javascript");
      scriptNode.setAttribute("src", this.src);
      document.body.appendChild(scriptNode);
    }
  }
</script>

