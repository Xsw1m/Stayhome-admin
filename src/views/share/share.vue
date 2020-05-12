<template>
  <div class="app-container">
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
      <el-table-column label="申请人" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="130" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover ? scope.row.cover : 'Default'" width="100px;">
        </template>
      </el-table-column>
      <el-table-column label="申请视频标题" min-width="200">
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
      <el-table-column label="申请时间" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="handleUpdate(row)">
            审核
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
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="分享意图" prop="apply_reason">
          <el-input v-model="temp.apply_reason" :disabled="true" type="textarea" />
        </el-form-item>
      </el-form>
      <hr>
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
  </div>
</template>

<script>
import { fetchTable, createdTable } from '@/api/share'
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'N
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  // components: { Pagination },
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
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ id: 1, label: '待审核' }, { id: 2, label: '审核通过' }, { id: 3, label: '审核不通过' }],
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
        update: '视频分享申请',
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
  created() {
    this.getTable()
  },
  methods: {
    Tovideo_details(item) {
      this.dialogVisible = true
      // 将视频title url传入
      this.dialogdetails.title = item.title
      this.dialogdetails.url = item.url
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // this.dialogdetails = []
          done()
        })
        .catch(_ => {})
    },
    // 标题视频弹窗
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
    handleFilter() {
      this.listQuery.page = 1
      this.getTable()
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
          delete tempData.created_at
          delete tempData.real_name
          delete tempData.title
          delete tempData.cover
          delete tempData.cover_s
          delete tempData.apply_reason
          delete tempData.audit_explain
          console.log(tempData)
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
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    },
    // updateData() {
    //     console.log('updataData')
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.audit_time = +new Date(tempData.audit_time) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         for (const v of this.list) {
    //           if (v.id === this.temp.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, this.temp)
    //             break
    //           }
    //         }
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Update Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
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
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
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
