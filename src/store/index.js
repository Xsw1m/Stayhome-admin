import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { fetchTable } from '@/api/download'
import { fetchMessage } from '@/api/message'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  state: {
    news: 0,
    unread: 0,
    listunfinished: {
      page: 1,
      limit: 10,
      status: 1,
      importance: undefined,
      title: undefined,
      type: undefined,
      sort: '+id'
    }
  },
  actions: {
    getunfinished() {
      // fetchTable(this.state.listunfinished).then(response => {
      //   this.state.news = response.result.total
      // })
      fetchMessage().then(response => {
        this.state.unread = response.result.total
      })
    }
  }
})

export default store
