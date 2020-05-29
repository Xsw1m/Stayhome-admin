<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadFile"
    action="customize"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <!-- <img v-if="parentMsg" :src="parentMsg" class="avatar"> -->
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import Qs from 'qs'
// import axios from 'axios'
var COS = require('cos-js-sdk-v5')
export default {
  props: {
    parentMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      image: '',
      imageUrl: '',
      uploadURL: '',
      uploadType: '',
      uptype: 1 //  type 1图片 2视频 3音频 4其它
    }
  },
  watch: {
    imageUrl(newval, oldval) {
      console.log('获取编辑banner图片', newval, oldval)
      this.$emit('getImUrl', newval)
    },
    parentMsg(newval, oldval) {
      console.log('从父组件传来图片1', newval, oldval)
      this.imageUrl = newval
    }
  },
  mounted() {
    this.imageUrl = this.parentMsg
    console.log('从父组件传来图片2', this.imageUrl)
  }, // 把父组件传递过来的  parentMsg  属性，
  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      this.image = file
      // const isAllow = file.type.indexOf(['image/jpeg', 'image/gif', 'image/png', 'image/webp'])
      const isAllow = ['image/jpeg', 'image/gif', 'image/png', 'image/webp'].indexOf(file.type)
      const isLt4M = file.size / 1024 / 1024 < 4
      this.uploadType = file.name.split('.')[1]
      if (isAllow < 0) {
        this.$message.error('上传图片格式不正确，只支持jpg,jpeg,gif,png,webp!')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      return true
      // this.file = file
      // this.createImage(file)
    },
    // createImage (file) {
    //         // var image = new Image()
    //     let reader = new FileReader()

    //     reader.onload = (e) => {

    //         this.image = e.target.result
    //         console.log(this.image)
    //     }
    //     reader.readAsDataURL(this.file)
    // },
    uploadFile: async function(params) {
      // 获取当前时间
      var date = new Date()
      var hour = date.getHours()
      var minu = date.getMinutes()
      var sec = date.getSeconds()
      if (hour < 10) hour = '0' + hour
      if (minu < 10) minu = '0' + minu
      if (sec < 10) sec = '0' + sec
      // 添加后缀名
      const uploadType = '.' + this.uploadType
      console.log(hour.toString())
      // console.log(hour)
      const fileName = hour.toString() + minu.toString() + sec.toString() + Math.round(Math.random() * 10).toString() + Math.round(Math.random() * 10).toString() + Math.round(Math.random() * 10).toString() + uploadType
      console.log(fileName)

      const data = Qs.stringify({
        fileName: fileName,
        type: this.uploadType
      })
      console.log(data)

      var response = ''
      console.log('B视频文件params:', params)
      var cos = new COS({
        SecretId: 'AKIDEmIr9A3Gn5Z7QkeYOyHJ5IGwc5HBmqkO',
        SecretKey: 'cEcfV4LM7a6OP8ZtyniYo56qnBfsntpV'
      })
      var _this = this
      cos.putObject({
        Bucket: 'stayhomehub-1258210079', /* 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: 'banner/' + fileName, /* 必须 */
        StorageClass: 'STANDARD',
        Body: params.file, // 上传文件对象
        onProgress: function(progressData) { /* 非必须 */
          console.log('2成功获取Progress：', JSON.stringify(progressData))
        }
      }, function(err, data) {
        // console.log('2获取：', err || data)
        console.log('3.获取失败：', err)
        console.log('3.获取成功: ', data)
        if (data.statusCode === 200) {
          _this.imageUrl = 'https://' + data.Location
        }
      })
      console.log(response)
      // const response = await axios({
      //     method: 'PUT',
      //     data: data,
      //     url: `https://pq4wmkfnr9.execute-api.cn-northwest-1.amazonaws.com.cn/prod/uploads`
      // })
      // console.log(result)
      // console.log('Response: ', response.data)
      // // console.log('Uploading: ', this.image)
      // const uploadInfo = JSON.parse(response.data.body)
      // console.log('Responsebody: ', uploadInfo)

      // // atob() 方法用于解码使用 base-64 编码的字符串。
      // let binary = atob(this.image.split(',')[1])
      // let array = []
      // for (var i = 0; i < binary.length; i++) {
      //     array.push(binary.charCodeAt(i))
      // }
      // // let blobData = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
      // let blobData = new Blob([new Uint8Array(array)],{type: 'image/jpeg'})
      // console.log('Uploading to: ', uploadInfo.uploadURL)
      // // console.log(blobData)

      // const result = await fetch(uploadInfo.uploadURL, {
      //     method: 'PUT',
      //     body: blobData
      // })

      // const nnnn = this.image
      // const result = await axios.put(uploadInfo.uploadURL, nnnn)

      // console.log('Result: ', result)

      // // Final URL for the user doesn't need the query string params
      // console.log(result.config.url.split('?')[0])
      // this.imageUrl = result.config.url.split('?')[0]
    }

  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #37BAA0;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #37BAA0;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style>
  .avatar-uploader .el-upload:hover {
    border-color: #37BAA0!important;
  }
</style>
