<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin-bottom:0.5%;">
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 12%;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.real_name" placeholder="上传者" style="width: 6%;" class="filter-item" @keyup.enter.native="handleFilter" />
        <!-- <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 8%;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-select v-model="listQuery.status" placeholder="审核状态" clearable style="width: 7%" class="filter-item">
          <el-option key="0" label="全部" value="0" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="listQuery.category_id" filterable placeholder="分类" clearable style="width: 7%" class="filter-item">
          <el-option v-for="item in columnOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <!--<el-input v-model="listQuery.column_name" placeholder="分类" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
        <el-date-picker
          v-model="queryTime"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-time-picker
          v-model="duration"
          is-range
          range-separator="至"
          start-placeholder="视频时长"
          end-placeholder="视频时长"
        />
      </div>
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--</el-select>-->
      <div>
        <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">
          检索
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 5px;" type="success" size="mini" icon="el-icon-edit" @click="handleCreate(1)">
          补录
        </el-button> -->
        <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
        <!--Export-->
        <!--</el-button>-->
        <el-checkbox v-model="showMore" class="filter-item" style="margin-left:5px;margin-right: 0;" @change="tableKey=tableKey+1">
          更多信息
        </el-checkbox>
        <el-checkbox v-model="changeMore" class="filter-item" style="margin-left:5px;margin-right: 0;">
          批量修改
        </el-checkbox>
        <el-button v-if="changeMore" class="filter-item" type="warning" size="mini" icon="el-icon-more-outline" @click="handleUpdateMore(batchlist)">
          批量分类
        </el-button>
        <el-button v-if="changeMore" class="filter-item" style="margin-left: 5px;" type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteMore(batchlist)">
          批量删除
        </el-button>
        <el-button v-if="changeMore" class="filter-item" style="margin-left: 5px;" type="success" size="mini" icon="el-icon-circle-plus-outline" @click="handleAddMore(batchlist)">
          批量填入
        </el-button>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="changeMore" type="selection" width="40" />
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="130" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover ? scope.row.cover : 'Default'" width="100px;">
        </template>
      </el-table-column>
      <el-table-column label="视频标题" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
          <!--<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
          <!--<el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column label="分类" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name ? scope.row.category.name : '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传者" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.user.name ? scope.row.user.name : '未知' }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showMore" label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user.phone | phoneFilter }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column v-if="showMore" label="所属小微" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.group_name ? scope.row.group_name : '未知' }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="审核状态" width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter_color">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="能否发布精选" width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag :type="scope.row.admin_recommend_jurisdiction | recommend_jurisdiction_color">
            {{ scope.row.admin_recommend_jurisdiction | recommend_jurisdiction }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="可转载" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.transfer | storage_class_color">
            {{ scope.row.transfer | storage_class }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="权重" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at ? scope.row.created_at : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showMore" label="审核时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at ? scope.row.updated_at : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showMore" label="转码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
          <!--<el-button type="primary" plain size="mini" :disabled="scope.row.url === ''?false:true" @click="transcoding(scope.row.source_url)">转码</el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showMore" label="原始路径" align="center">
        <template slot-scope="scope">
           <span>{{ scope.row.union_id }}</span>
          <el-button type="info" plain size="mini" @click="checkurl(scope.row.union_id)">查看</el-button>
        </template>
      </el-table-column>-->

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleAdd(row)">
            填入
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row,2)">
            修改
          </el-button>
          <el-button v-if="row.status !== '2'" type="warning" size="mini" @click="handleUpdate(row,3)">
            审核
          </el-button>
          <el-button v-if="row.status !=='3'" size="mini" type="danger" @click="handleDeleteRow(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogClassVisible" width="800">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 100%;">
        <el-form-item label="视频分类" prop="column_name">
          <el-select v-model="temp.category_id" filterable placeholder="分类" clearable style="width: 50%" class="filter-item">
            <el-option v-for="item in columnOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <hr>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateMoreData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看原始路径 -->
    <el-dialog
      title="查看原始路径"
      :visible.sync="dialogUrlVisible"
      width="1200px"
      :before-close="Urldialogclose"
    >
      <el-form label-position="left" label-width="100" style="width: 100%;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="原始路径id: ">
              <div>{{ originalpath.id }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频格式: ">
              <div>{{ originalpath.meta_date }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频拍摄时间: ">
              <div>{{ originalpath.extension }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="原始路径标题: ">
              <div>{{ originalpath.title }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="储存原始路径: ">
              <div>{{ originalpath.storage_key }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="原始路径: ">
              <el-input v-model="originalpath.url" :disabled=" addurl === true?false:true" />
              <!-- todo待修改，可填入原始路径 判断填入的时候 add -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800">

      <!--remark: '',-->
      <!--admin_recommend_jurisdiction: 1,-->
      <!--column_name: '',-->
      <!--cover: '',-->
      <!--cover_s: '',-->
      <!--first_page: 0,-->
      <!--id: undefined,-->
      <!--introduction: '',-->
      <!--shooting_city: '',-->
      <!--shooting_country: '',-->
      <!--shooting_province: '',-->
      <!--shooting_time: '',-->
      <!--status: 1,-->
      <!--title: '',-->
      <!--user_watch_jurisdiction: 1-->

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 100%;">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title" :disabled="layerAudit === 3?true:false" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="视频分类" prop="column_name">
              <!-- [()?true:false] -->
              <el-select v-model="temp.category_id" filterable placeholder="分类" clearable style="width: 100%" class="filter-item">
                <el-option v-for="item in columnOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item v-if="layerAudit === 1" label="视频地址" prop="url">
              <el-input v-model="temp.url" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="拍摄时间" prop="shooting_time">
              <el-date-picker v-model="temp.shooting_time" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" type="date" placeholder="拍摄时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="拍摄国家" prop="shooting_country">
              <el-select v-model="temp.shooting_country" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" placeholder="拍摄国家" clearable>
                <el-option key="国内" label="国内" value="国内" />
                <el-option key="国外" label="国外" value="国外" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="拍摄省" prop="shooting_province">
              <el-input v-model="temp.shooting_province" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="拍摄市" prop="shooting_city">
              <el-input v-model="temp.shooting_city" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="layerAudit != 1" label="视频描述" prop="introduction">
              <el-input v-model="temp.introduction" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="填写视频视频描述" />
            </el-form-item>
          </el-col>
          <!--// TODO-->
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="横版封面" prop="cover">
              <SingleImageToAws class="form_upload_cover" :parent-msg="temp.cover" @getImUrl="uploadCover" />
              <p>尺寸: 564px x 332px</p>
              <!--<el-input v-model="temp.cover" :disabled="layerAudit" />-->
            </el-form-item>
            <!-- <el-form-item v-if="layerAudit != 1" label="观看权限" prop="user_watch_jurisdiction" style="margin-top: 120px">
              <el-select v-model="temp.user_watch_jurisdiction" :disabled="(layerAudit === 3 || layerAudit === 1)?true:false" placeholder="分类" clearable style="width: 100%" class="filter-item">
                <el-option v-for="item in userWatchJurisdictionOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-if="layerAudit != 1" label="竖版封面" prop="cover_s">
              <SingleImageToAws class="form_upload_cover_s" :parent-msg="temp.cover_s" @getImUrl="uploadCoverS" />
              <p>尺寸: 564px x 692px</p>
              <!--<el-input v-model="temp.cover_s" :disabled="layerAudit" />-->
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item v-if="layerAudit != 1" label="视频缩略">
              <video controls :src="temp.url" style="width: 500px" />
            </el-form-item>
          </el-col>

        </el-row>
        <!--非审核功能不显示审核区
        <hr>
        <div v-if="layerAudit === 2 && temp.status === 2">
          <el-form-item label="权重排序位" prop="weight">
            <el-input-number v-model="temp.weight" :min="0" :max="5" label="描述文字" />
          </el-form-item>
        </div>-->
        <div v-if="layerAudit === 3">
          <el-form-item label="审核状态" prop="status">
            <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="审核理由" prop="audit_feedback">
            <el-input
              v-model="temp.audit_feedback"
              type="textarea"
              placeholder="填写视频视频描述"
              maxlength="30"
              show-word-limit
            />

          </el-form-item>
          <!-- <el-form-item v-if=" temp.status === 2" label="发布精选" prop="cover">
            <el-radio v-model="isFirstPage" label="0">不发布</el-radio>
            <el-radio v-model="isFirstPage" label="1">发布</el-radio>
          </el-form-item>
          <el-form-item v-if=" temp.status === 2" label="精选排序位" prop="first_page">
            <el-input-number v-model="temp.first_page" :min="1" :max="5" label="描述文字" />
          </el-form-item>-->
          <el-form-item label="权重排序位" prop="weight">
            <el-input-number v-model="temp.weight" :min="0" :max="5" label="描述文字" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <!--<el-button v-if="!layerAudit" type="primary" @click="dialogStatus==='create'?createData():updateData()">-->

        <el-button v-if="layerAudit === 2" type="primary" @click="updateData()">
          提交
        </el-button>
        <el-button v-if="layerAudit === 3" type="primary" @click="auditData()">
          审核
        </el-button>
        <el-button v-if="layerAudit === 1" type="success" @click="createData()">
          添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

import { fetchList, fetchItem, updateItem, auditItem, deleteItem, createItem, checkUrl } from '@/api/video'
import { fetchList as fetchColumList } from '@/api/column'
import { statusList, userWatchJurisdiction } from '@/api/const'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SingleImageToAws from '@/components/Upload/SingleImageToAws.vue'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'VideoList',
  components: { Pagination, SingleImageToAws },
  directives: { waves },
  filters: {
    storage_class(status) {
      return status === 1 ? '可以' : '不可以'
    },
    storage_class_color(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = []
      for (let i = 0; i < statusList.length; i++) {
        statusMap[statusList[i]['value']] = statusList[i]['label']
      }
      return statusMap[status]
    },
    statusFilter_color(status) {
      const statusMap = {
        2: 'success',
        3: 'danger'
      }
      return statusMap[status]
    },
    recommend_jurisdiction(status) {
      return status === 1 ? '允许' : '拒绝'
    },
    recommend_jurisdiction_color(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    phoneFilter(phone) {
      if (phone === '18888888888') return '-'
      if (phone === '') return '未知'
      return phone
    }
  },
  data() {
    return {
      queryTime: '',
      duration: '',
      tableKey: 0,
      list: null,
      batchlist: [],
      total: 0,
      listLoading: true,
      layerAudit: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        importance: undefined,
        real_name: undefined,
        phone: undefined,
        status: undefined,
        category_id: undefined,
        begin_time: undefined,
        end_time: undefined,
        type: undefined,
        url: undefined,
        audit_feedback: undefined,
        sort: '+id'
      },
      originalpath: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      columnOptions: [],
      sortOptions: [{ label: 'ID 从小到大', key: '+id' }, { label: 'ID 从大到小', key: '-id' }],
      statusOptions: [],
      userWatchJurisdictionOptions: [],
      showMore: false,
      changeMore: false,
      isFirstPage: '0',
      temp: {
        remark: '',
        column_name: '',
        category_id: '',
        cover: '',
        cover_s: '',
        first_page: 0,
        id: undefined,
        introduction: '',
        shooting_city: '',
        shooting_country: '',
        shooting_province: '',
        shooting_time: '',
        status: 1,
        title: '',
        url: '',
        audit_feedback: '',
        user_watch_jurisdiction: 1,
        weight: 0
      },
      dialogFormVisible: false,
      dialogUrlVisible: false,
      addurl: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogClassVisible: false,
      rules: {
        // column_name: [{ type: 'number', required: true, message: '分类必须填写', trigger: 'change' }],
        shooting_time: [{ required: true, message: '拍摄时间必须填写', trigger: 'change' }],
        title: [{ required: true, message: '标题必须填写', trigger: 'blur' }],
        url: [{ required: true, message: '地址必须填写', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    // 判断是否有权限更改分类
    isClassify() {
      if (this.layerAudit === 2 && this.temp.admin_classify_jurisdiction === 1) {
        return false
      } else if (this.layerAudit === 1) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.statusOptions = statusList
    this.userWatchJurisdictionOptions = userWatchJurisdiction

    this.getList()
    this.getColumnList()
  },
  methods: {
    uploadCover(data) {
      this.temp.cover = data
    },
    uploadCoverS(data) {
      this.temp.cover_s = data
    },
    getColumnList() {
      console.log('查看视频分类')
      fetchColumList().then(response => {
        this.columnOptions = response.result[0]
        console.log('视频分类', this.columnOptions)
      })
    },
    getList() {
      this.listLoading = true
      console.log('重新获取列表1', this.listQuery)
      fetchList(this.listQuery).then(response => {
        if (response.code === 200) {
          console.log('重新获取一次列表')
          this.list = response.result.list
          this.total = response.result.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.queryTime)
      if (this.queryTime !== null) {
        this.listQuery.begin_time = parseTime(this.queryTime[0], '{y}-{m}-{d}')
        this.listQuery.end_time = parseTime(this.queryTime[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.begin_time = '0-0-0'
        this.listQuery.end_time = '0-0-0'
      }
      if (this.duration !== null) {
        this.listQuery.begin_length = parseTime(this.duration[0], '{h}-{i}-{s}')
        this.listQuery.end_length = parseTime(this.duration[1], '{h}-{i}-{s}')
      } else {
        this.listQuery.begin_length = '0-0-0'
        this.listQuery.end_length = '0-0-0'
      }
      // console.log(this.duration)
      if (this.listQuery.begin_time === '0-0-0' && this.listQuery.end_time === '0-0-0') {
        delete this.listQuery.begin_time
        delete this.listQuery.end_time
      }
      if (this.listQuery.begin_length === '0-0-0' && this.listQuery.end_length === '0-0-0') {
        delete this.listQuery.begin_length
        delete this.listQuery.end_length
      }
      if (this.listQuery.status === '0' || this.listQuery.category_id === '' || this.listQuery.status === '') {
        delete this.listQuery.status
        delete this.listQuery.category_id
      }
      this.getList()
    },
    handleDeleteRow(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(row.id).then(response => {
          if (response.code === 200) {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '已删除',
              type: 'success',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量修改功能
    handleAddMore(row) {
      console.log('批量填入')
      console.log(row)
      this.addurl = true
    },
    handleUpdateMore(row) {
      this.dialogClassVisible = true
      this.resetTemp()
      console.log(row)
    },
    updateMoreData() {
      console.log('批量修改')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.batchlist.forEach(item => {
            const tempData = Object.assign({}, this.temp)
            delete tempData.remark
            delete tempData.column_name
            delete tempData.cover
            delete tempData.cover_s
            delete tempData.first_page
            delete tempData.id
            delete tempData.introduction
            delete tempData.shooting_city
            delete tempData.shooting_country
            delete tempData.shooting_province
            delete tempData.shooting_time
            delete tempData.status
            delete tempData.audit_feedback
            delete tempData.user_watch_jurisdiction
            delete tempData.title
            delete tempData.url
            updateItem(qs.stringify(tempData), item.id).then(response => {
              if (response.code === 200) {
                console.log('提交成功')
                this.getList()
                this.dialogClassVisible = false
              }
            })
          })
          this.$notify({
            title: '操作成功',
            message: '资料已更新',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    handleDeleteMore(row) {
      console.log('delete more data')
      console.log(row)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.forEach(item => {
          console.log(item.id)
          deleteItem(item.id).then(response => {
            if (response.code === 200) {
              console.log(response)
            }
          })
        })
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '操作成功',
          message: '已删除',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.batchlist = val
    },
    // end
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
    //     remark: '',
    //     admin_recommend_jurisdiction: 1,
    //     column_name: '',
    //     cover: '',
    //     cover_s: '',
    //     first_page: 0,
    //     id: undefined,
    //     introduction: '',
    //     shooting_city: '',
    //     shooting_country: '',
    //     shooting_province: '',
    //     shooting_time: '',
    //     status: 1,
    //     title: '',
    //     url: '',
    //     audit_feedback: '',
    //     user_watch_jurisdiction: 1
    //   }
    // },
    Urldialogclose() {
      this.addurl = false
    },
    handleAdd(row) {
      console.log('填入')
      console.log(row)
      this.addurl = true
    },
    handleCreate(isAudit) {
      this.layerAudit = isAudit
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 移除表单验证
      })
    },
    resetTemp() {
      this.temp = {
        remark: '',
        column_name: '',
        category_id: '',
        cover: '',
        cover_s: '',
        first_page: 0,
        id: undefined,
        introduction: '',
        shooting_city: '',
        shooting_country: '',
        shooting_province: '',
        shooting_time: '',
        status: 1,
        title: '',
        url: '',
        audit_feedback: '',
        user_watch_jurisdiction: 1
      }
    },
    createData() {
      console.log('添加新的一条')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          //       this.temp.author = 'vue-element-admin'
          const tempData = Object.assign({}, this.temp)
          delete tempData.remark
          delete tempData.column_name
          delete tempData.cover
          delete tempData.cover_s
          delete tempData.first_page
          delete tempData.id
          delete tempData.introduction
          delete tempData.shooting_city
          delete tempData.shooting_country
          delete tempData.shooting_province
          delete tempData.shooting_time
          delete tempData.status
          delete tempData.audit_feedback
          delete tempData.user_watch_jurisdiction
          createItem(qs.stringify(tempData)).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row, isAudit) {
      this.layerAudit = isAudit
      // this.temp = Object.assign({}, row) // copy obj
      // axios调取每个具体视频信息
      fetchItem(row.id).then(response => {
        this.temp = Object.assign({}, response.result)
        console.log('查看信息详细', this.temp)
        // console.log(this.temp.admin_classify_jurisdiction)
      })
      //
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('提交修改前的信息1', this.temp)
          const tempData = Object.assign({}, this.temp)
          delete tempData.status
          delete tempData.column_id
          delete tempData.column_name
          delete tempData.audit_feedback
          delete tempData.first_page
          console.log('提交修改后的信息2', tempData)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateItem(qs.stringify(tempData), this.temp.id).then(response => {
            if (response.code === 200) {
              console.log('提交成功')
              console.log(tempData)
              this.dialogFormVisible = false
              this.$notify({
                title: '操作成功',
                message: '资料已更新',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
      this.getList()
    },

    auditData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      const tempData = qs.stringify({
        'status': this.temp.status,
        'audit_feedback': this.temp.audit_feedback,
        'weight': this.temp.weight
        // 'first_page': this.isFirstPage > 0 ? this.temp.first_page : 0
      })
      console.log(tempData)
      // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      auditItem(tempData, this.temp.id).then(response => {
        if (response.code === 200) {
          console.log(response)
          // for (const v of this.list) {
          //   if (v.id === this.temp.id) {
          //     const index = this.list.indexOf(v)
          //     this.list.splice(index, 1, this.temp)
          //     break
          //   }
          // }
          this.dialogFormVisible = false
          this.$notify({
            title: '操作成功',
            message: '已更新视频状态',
            type: 'success',
            duration: 2000
          })
        }
      })
      //   }
      // })
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    transcoding(id) {
      console.log('开始转码')
    },
    checkurl(id) {
      if (id === 0) {
        this.$notify.error({
          title: '错误',
          message: '没有原始路径',
          offset: 100
        })
      } else {
        checkUrl(id).then(response => {
          console.log(response)
          this.originalpath = response.result
          console.log(this.originalpath)
          this.dialogUrlVisible = true
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
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
.filter-container{
  display: flex;
  flex-direction: column;
}
.el-date-editor /deep/ .el-range-separator {
  width: 6%;
}
</style>
<style>
  .filter-container /deep/ .filter-item { margin-bottom: 0}
  .form_upload_cover img {width: 230px; height: 135.39px;}
  .form_upload_cover_s img {width: 230px; height: 282.19858156px;}
</style>
