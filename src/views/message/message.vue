<template>
  <div class="app-container">
    <div class="card1">
      <div class="title">系统消息</div>
      <div class="border" />
      <span class="read aSty" @click="checkallitem">全部标记为已读</span>
    </div>
    <div class="card2">
      <div v-for="( item,index ) in list" :key="index + 1" class="content" @click="checkitem(item.id)">
        <div class="read_status">
          <div :class="item.status | status_spot" />
          <div :class="item.status | information_color">{{ item.status | status_information }}</div>
        </div>
        <div>{{ item.content }}</div>
        <div style="display:flex;margin-left:auto;">{{ item.send_time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList, allcheckitem, checkitem } from '@/api/message'
export default {
  filters: {
    status_spot(item) {
      const status = {
        3: 'status_spot2',
        2: 'status_spot3'
      }
      return status[item]
    },
    status_information(item) {
      const status = {
        3: '已读',
        2: '未读'
      }
      return status[item]
    },
    information_color(item) {
      const status = {
        3: 'information_color2',
        2: 'information_color3'
      }
      return status[item]
    }
  },
  data() {
    return {
      test: '',
      listQuery: {
        page: 1,
        limit: 200
      },
      list: null
    }
  },
  created() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      fetchList(this.listQuery).then(response => {
        console.log(response.result.list)
        this.list = response.result.list
      })
    },
    checkallitem() {
      allcheckitem().then(response => {
        // console.log('全部已读')
        this.$store.dispatch('getunfinished')
        this.getMessage()
      })
    },
    checkitem(id) {
      checkitem(id).then(response => {
        console.log('已读' + id)
        console.log(response)
        this.$store.dispatch('getunfinished')
        this.getMessage()
      })
    }
  }
}
</script>
<style scoped>
.app-container{
  background-color: #e3e3e3;
  min-height: 90.5vh;
  height: 90.5vh;
}
.aSty{
cursor:pointer
}
.card1{
  height: 5%;
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  align-items: center;
  /* padding-right: 4%; */
}
.title{
  width: 8%;
  height: 1.8vw;
  font-size: 0.73vw;
  color: whitesmoke;
  border-radius: 15px;
  background-color: #333A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 1px; */
  border: 0.5px solid black;
}
.read{
  width: 8%;
  min-width: min-content;
  padding-left: auto;
  color: #37BAA0;
  font-size: 0.73vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* card2内容 */
.card2{
  /* padding-top: 20px; */
  padding: 20px 20px 0 20px;
  width: 100%;
  height: 95%;
  overflow:scroll;
  overflow-x:hidden;
}
.content{
  height: 7%;
  width: 100%;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 0.5%;
  padding: 0 2%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.read_status{
  padding-right: 1%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.information_color2{
  color: #37BAA0;
  min-width: min-content;
}
.status_spot2{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #37BAA0;
}
.status_spot3{
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
.information_color3{
  color: red;
  min-width: min-content;
}
</style>
