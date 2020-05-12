<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="审核状态" clearable style="width: 120px" class="filter-item">
        <!-- <el-option key="0" label="全部" value="0" /> -->
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        检索
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80%" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请视频标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="Tovideo_details(row)">{{ row.title }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="审核状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter_color" style="width:80px;">
            {{ row.status | statusFilter_label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.audit_time }}</span>
          <!-- | parseTime('{y}-{m}-{d} {h}:{i}')  -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 视频详情抽屉 :before-close="handleClose"-->
    <el-dialog
      :title="dialogdetails.title"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <video class="dialog_video" autoplay="autoplay" :src="dialogdetails.url" controls="controls" width="auto" height="auto" />
      <!-- <el-button size="mini" type="danger" @click="test">
        测试
      </el-button> -->
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTable" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="使用渠道" prop="use_mode">
          <el-input v-model="temp.use_mode" :disabled="true" />
        </el-form-item>
        <el-form-item label="播放渠道" prop="play_way">
          <el-input v-model="temp.play_way" :disabled="true" />
        </el-form-item>
        <el-form-item label="媒体名称" prop="title">
          <el-input v-model="temp.title" :disabled="true" />
        </el-form-item>
        <el-form-item label="使用用途" prop="use_reason">
          <el-input v-model="temp.use_reason" type="textarea" :rows="4" :disabled="true" />
        </el-form-item>
      </el-form>
      <hr>
      <br>
      <br>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="审核状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select" @change="changeisshow">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isshow_audit_explain" label="拒绝原因">
          <el-input v-model="temp.audit_explain" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTable, createdTable } from '@/api/download'
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter_color(status) {
      const statusMap = {
        1: 'primary',
        2: 'success',
        3: 'danger'
      }
      return statusMap[status]
    },
    statusFilter_label(status) {
      return status === 1 ? '待审核' : status === 2 ? '审核通过' : status === 3 ? '审核不通过' : '已下载'
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogdetails: {
        title: '',
        url: ''
      },
      // 视频详情属性
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listTable: {
        page: 1,
        limit: 10,
        status: undefined,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: undefined,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      listunfinished: {
        page: 1,
        limit: 10,
        status: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      unfinished: undefined,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ id: 1, label: '待审核' }, { id: 2, label: '审核通过' }, { id: 3, label: '审核不通过' }, { id: 4, label: '已下载' }],
      isshow_audit_explain: false,
      showReviewer: false,
      temp: {
        id: undefined,
        audit_time: new Date(),
        use_reason: '',
        title: '',
        status: '',
        audit_explain: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '视频下载申请',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        audit_time: [{ type: 'date', required: true, message: 'audit_time is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    storageNews() {
      return this.$store.state.news
    }
  },
  created() {
    this.getTable()
    // this.getunfinished()
    // this.$store.state.news = this.unfinished
    // this.$store.dispatch('getunfinished')
  },
  methods: {
    // 观看视频详情抽屉-drawer
    Tovideo_details(item) {
      this.dialogVisible = true
      // 将视频title url传入
      this.dialogdetails.title = item.title
      this.dialogdetails.url = item.url
    },
    // test() {
    //   console.log(this.dialogdetails.title)
    // },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // this.dialogdetails = []
          done()
        })
        .catch(_ => {})
    },
    // End
    getTable() {
      this.listLoading = true
      fetchTable(this.listQuery).then(response => {
        console.log(response)
        this.list = response.result.list
        this.total = response.result.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 未读消息-待审核数量
    // getunfinished() {
    //   fetchTable(this.listunfinished).then(response => {
    //     this.unfinished = response.result.total
    //   })
    // },
    handleFilter() {
      this.listQuery.page = 1
      if (this.listQuery.status === '') {
        const tempData = Object.assign({}, this.listQuery)
        delete tempData.status
        fetchTable(tempData).then(response => {
          console.log(response)
          this.list = response.result.list
          this.total = response.result.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } else {
        this.getTable()
      }
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     importance: 1,
    //     remark: '',
    //     audit_time: new Date(),
    //     title: '',
    //     status: '',
    //     type: ''
    //   }
    // },
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    changeisshow(val) {
      const value = val
      if (value === 3) {
        console.log('3 可以显示')
        this.isshow_audit_explain = true
      } else {
        console.log(value + ' ' + '不可以显示')
        this.isshow_audit_explain = false
      }
    },
    createData() {
      console.log('createData')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          const tempData = Object.assign({}, this.temp)
          delete tempData.url
          delete tempData.audit_time
          delete tempData.phone
          delete tempData.play_way
          delete tempData.real_name
          delete tempData.title
          delete tempData.use_mode
          delete tempData.use_reason
          createdTable(tempData).then(() => {
            console.log('提交成功')
            console.log(tempData)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getTable()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('getunfinished')
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.audit_time = new Date(this.temp.audit_time)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 判断不通过理由是否 隐藏
      if (row.status === 3) {
        this.isshow_audit_explain = true
      } else {
        this.isshow_audit_explain = false
      }
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['audit_time', 'title', 'type', 'importance', 'status']
        const filterVal = ['audit_time', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'audit_time') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
<style scoped>
.el-dialog__body{
  padding: 10px 20px 30px 20px
}
.dialog_video{
  width: 100%;
  /* height: 80%; */
}
</style>
