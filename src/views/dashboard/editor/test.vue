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
        <span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎来到超管后台♥</span>
      </div>
    </div>
    <div>
      
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
    <div style="background:white;">
      {{ resultcomputed }} <br>
      {{ resultcomputed }} <br>
      {{ resultmethod() }} <br>
      {{ resultmethod() }} <br>
      <p> {{ fullName }} </p>
      <input v-model="fullName" type="text">
      <input v-model="first" type="text">
      <input v-model="last" type="text">
    </div>
    <piechart />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import PanThumb from '@/components/PanThumb'
// import GithubCorner from '@/components/GithubCorner'
import PieChart from '../admin/components/PieChart'

export default {
  name: 'DashboardEditor',
  components: { 'piechart': PieChart },
  // components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      firstName1: 2,
      firstName2: 2,
      firstName3: 3,
      firstName4: 4,
      first: 'zhang',
      last: 'wei'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
    resultcomputed: function() {
    //   console.log('执行了computed')
      return this.firstName1 + this.firstName2
    },
    fullName: {
      get(value) {
        console.log('getter')
        console.log(value)
        return this.first + ' ' + this.last
      },
      set(newVal) {
        console.log(newVal)
        console.log('setter')
        var names = newVal.split(' ')
        this.first = names[0]
        this.last = names[names.length - 1]
        return this.first + ' ' + this.last
      }
    }
  },
  updated() {
    // console.log('update!')
  },
  methods: {
    resultmethod: function() {
    //   console.log('执行了methods')
      return this.firstName2 + this.firstName4
    }
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
