<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <!-- <pan-thumb :image="avatar" style="float: left">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" /> -->
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎来到超管后台123♥</span>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import PanThumb from '@/components/PanThumb'
// import GithubCorner from '@/components/GithubCorner'
// function a(x) {
//   return function(y) {
//     return x + y
//   }
// }
// var b = a(2)
// alert(b(3))
// for (var j = 0; j< 5; j++) {
//   setTimeout(function() {
//     console.log(j)
//   }, 1000)
// }
// (function a() {
//   for (var i = 0; i < 10; i++) {
//     (function(j) {
//       setTimeout(function() {
//         console.log(j)
//       }, 1000)
//     })(i)
//   }
// })()
// const str = `hel  lo
//     ith eima
// itca st
// `
// console.log(str)
// console.log(i)
// var obj = {
//   message: 'My name is: '
// }

// function getName(firstName, lastName) {
//   console.log(this.message + firstName + ' ' + lastName)
// }

// getName.call(obj, 'Dot', 'Dolby')
// var p1 = new Promise(function(resolve, reject) {
//   resolve('Success');
// });

// p1.then(function(value) {
//   console.log(value); // "Success!"
//   throw 'oh, no!';
// }).catch(function(e) {
//   console.log(e); // "oh, no!"
// }).then(function(){
//   console.log('after a catch the chain is restored');
// }, function () {
//   console.log('Not fired due to the catch');
// });

export default {
  name: 'DashboardEditor',
  // components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 91vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      // color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
