<template>
  <div id="content">
    <p @click="showLightBox(imgs)">点击查看</p>
    <hs-light-box ref="lightBox"></hs-light-box>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      imgs: [
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1868999744,1703728046&fm=27&gp=0.jpg",
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3722615040,3422677914&fm=27&gp=0.jpg",
        "http://test-yn-static.img-cn-beijing.aliyuncs.com/pic/avatar/2018-04-09/1523244373_427794741.pdf?filename=111.pdf"
      ]
    }
  },
  created () {

  },
  methods: {
    // 查看图片
    showLightBox (arr, index) {
      let i = index || 0;
      this.$refs.lightBox.bigImg(arr, i);
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
#content {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>