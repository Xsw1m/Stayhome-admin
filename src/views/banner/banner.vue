<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate(1)">
        添加
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
      <el-table-column label="视频标题" min-width="130">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
          <!-- <span class="link-type">{{ row.title }}</span> -->
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="banner图片" width="280" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover ? scope.row.cover : 'Default'" width="100px;">
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
          <!-- | parseTime('{y}-{m}-{d} {h}:{i}')  -->
        </template>
      </el-table-column>
      <el-table-column label="审核状态" class-name="status-col" width="240">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter_color" style="width:80px;">
            {{ row.status | statusFilter_label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row,2)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDeleteRow(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-dropdown szie="mini" trigger="click" placement="bottom-start">
            <el-input
              v-model="temp.title"
              @input="getdropdown"
              @focus="focus"
              @blur="blur"
            >
              <el-button slot="append" icon="el-icon-search" @click="getdropdown">搜索</el-button>
            </el-input>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in droplist" :key="item.id" divided @click.native="push(item.title,item.id)">{{ item.title }}</el-dropdown-item>
              <el-dropdown-item v-if="droplist.length === 0" disabled><p style="font-size:16px;"><i class="el-icon-circle-close">未找到相关视频</i></p></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <div v-if="seen">
            <div v-for="item in droplist">{{item.title}}</div>
          </div> -->
        </el-form-item>
        <el-form-item v-if="layerAudit === 2" label="视频缩略">
          <video controls :src="temp.video.url" style="width: 500px" />
        </el-form-item>
        <el-form-item v-if="false" label="视频地址">
          <el-input v-model="temp.video.url" />
        </el-form-item>
        <el-form-item label="首页焦点图" prop="cover">
          <SingleImageToAws class="form_upload_cover" :parent-msg="temp.cover" @getImUrl="uploadCover" />
          <p>尺寸: 1600px x 460px</p>
          <!--<el-input v-model="temp.cover" :disabled="layerAudit" />-->
        </el-form-item>
        <el-form-item label="显示状态" prop="user_watch_jurisdiction">
          <el-select v-model="temp.status" placeholder="分类" style="width: 100%" class="filter-item">
            <el-option v-for="item in banneristrueoption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <hr>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="layerAudit === 1" type="primary" @click="createData()">
          提交
        </el-button>
        <el-button v-if="layerAudit === 2" type="primary" @click="updateData()">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { fetchList, fetchdropdown, createItem, updateItem, deleteItem } from '@/api/banner'
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'N
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import { banneristrue } from '@/api/const'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SingleImageToAws from '@/components/Upload/SingleImageToCOS.vue'

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
  components: { SingleImageToAws },
  directives: { waves },
  filters: {
    statusFilter_color(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    },
    statusFilter_label(status) {
      return status === '1' ? '已发布' : status === '2' ? '已禁用' : '未知'
      // return status === '1' ? '已发布' : '已禁用'
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      layerAudit: Number,
      dialogVisible: false,
      dialogdetails: {
        title: '',
        url: ''
      },
      // 视频详情属性
      tableKey: 0,
      list: null,
      droplist: [{
        length: 0
      }],
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
      banneristrueoption: [],
      temp: {
        id: 2,
        video_id: '',
        weight: 0,
        cover: '',
        title: '',
        introduction: '',
        status: '1',
        updated_at: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改焦点图信息',
        create: '新增焦点图信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updated_at: [{ type: 'date', required: true, message: 'updated_at is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getTable()
    this.banneristrueoption = banneristrue
  },
  methods: {
    uploadCover(data) {
      this.temp.cover = data
      // 点击后上传图片并显示
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
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.result
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getdropdown() {
      this.listQuery.page = 1
      this.listQuery.title = this.temp.title
      console.log(this.listQuery.title)
      fetchdropdown(this.listQuery).then(response => {
        this.droplist = response.result.list
        // console.log('这是droplist' + this.droplist.length)
        // console.log(this.droplist)
        // console.log(response.result.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    push(title, video_id) {
      console.log('video_id：' + video_id)
      this.temp.title = title
      this.temp.video_id = video_id
    },
    focus() {
      // console.log('聚焦')
      this.getdropdown()
    },
    blur() {
      // console.log('失去焦点')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getTable()
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
    resetTemp() {
      this.temp = {
        id: 2,
        video_id: '',
        weight: 0,
        cover: '',
        title: '',
        introduction: '',
        status: '1'
      }
    },
    handleCreate(j) {
      this.temp.updated_at = new Date(this.temp.updated_at)
      console.log(this.temp)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.layerAudit = j
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('添加banner:', this.temp)
          const tempData = Object.assign({}, this.temp)
          delete tempData.id
          delete tempData.weight
          delete tempData.introduction
          delete tempData.updated_at
          createItem(qs.stringify(tempData)).then(() => {
            console.log('提交成功', tempData)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getTable()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }).catch((err) => {
            console.log('出错了！', err)
          })
        }
      })
    },
    handleUpdate(row, i) {
      console.log('编辑1', row, this.temp)
      this.temp = Object.assign({}, row) // copy obj
      console.log('编辑2', this.temp)
      this.temp.updated_at = new Date(this.temp.updated_at)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 判断不通过理由是否 隐藏
      this.layerAudit = i
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('updateData1', this.temp)
          const tempData = Object.assign({}, this.temp)
          delete tempData.id
          delete tempData.weight
          delete tempData.created_at
          delete tempData.title
          delete tempData.video
          delete tempData.introduction
          delete tempData.updated_at
          console.log('updateData2', tempData)
          updateItem(qs.stringify(tempData), this.temp.id).then(() => {
            console.log('提交成功', tempData)
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
    handleDeleteRow(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(row.id).then(response => {
          this.getTable()
          // this.dialogFormVisible = false
          this.$notify({
            title: '操作成功',
            message: '已删除',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
<style>
.el-dialog__body{
  padding: 10px 20px 30px 20px
}
.dialog_video{
  width: 100%;
  /* height: 80%; */
}
.filter-container .filter-item { margin-bottom: 0}
  .form_upload_cover img {width: 400px; height: 115px;}
</style>
