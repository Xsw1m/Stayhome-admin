<template>
  <div class="dashboard-editor-container">
    <div class="main">
      <div v-if="isCover" class="weixin">

      </div>
      <h1>12412</h1>
      <!-- <a href="zjmobile://platformapi/startapp" id="zjmobliestart" target="_blank" @click="app">唤醒浙江移动手机营业厅！</a> -->
      <!-- <a href="weixin://"> 唤起微信 </a>
      <br>
      <a href="mqq://"> 唤起微博</a>
      <br> -->
      <!-- <a id="openapp" href="hinews://open:2525/from?intent=article&id=3479">唤起Hinews</a>
      <a href="baidumap://map"> 唤起百度地图</a> -->
      <br>
      <div id="isapp" class="openApp" @click="openapp"><span style="text-align:center;">HiNewsAPP</span></div>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
export default {
  data() {
    return {
      title: '1241',
      isCover: false
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    openapp() {
      // 判断是否是在微信中打开
      let isWeiXin = () => {
        return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      }
      if (isWeiXin()) {
        // 是微信，弹出提示框
        this.isCover = true
      } else {
        // 不是微信，打开下载链接
        this.isCover = false
        // getAndroidUrl(1, 'test').then(res => {
        //   if (res.data.code === 0) {
        //     this.androidUrl = res.data.data.apk_file_url
        //     window.location.href = this.androidUrl
        //   }
        // })
        var url = 'hinews://open:2525/from?intent=article&id=0'
        var wangyiapp = 	'apper://'
        var download = 'http://hinews-prod.oss-cn-beijing.aliyuncs.com/install/hinews-v1.2.1.apk'
        window.location.href = url
        var downloader = setTimeout(function() {
          window.location.href = download
        }, 3000)
        document.addEventListener('visibilitychange', function() {
          // 如果页面隐藏，推测打开scheme成功，清除下载任务
          if (document.hidden || document.webkitHidden) {
            clearTimeout(downloader)
          } else {
            console.log('页面没有隐藏')
          }
        })
        window.addEventListener('pagehide', function() {
          clearTimeout(downloader)
        })
      }
    }
  }
}
</script>
<style>
  .main{
    padding: 1%
  }
  .weixin{
    background: rgba(0,0,0, 0.8);
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .openApp{
    /* width: 100px;
    height: 30px;
    background-color: aquamarine;
    border-radius: 25px;
    display: flex;
    text-align: center;
    justify-items: center;
    font-size: 14px; */
    height: 30px;
    width: 100px;
    /* height: 32px; */
    border-radius: 16px;
    background: #37BAA0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 14px;
  }
</style>
