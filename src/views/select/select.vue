<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <div>
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 12%;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.real_name" placeholder="上传者" style="width: 6%;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 8%;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.status" placeholder="审核状态" clearable style="width: 7%" class="filter-item">
          <el-option key="0" label="全部" value="0" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="listQuery.category_id" filterable placeholder="分类" clearable style="width: 7%" class="filter-item">
          <el-option v-for="item in columnOptions" :key="item.id" :label="item.column_name" :value="item.id" />
        </el-select>
        <el-date-picker
          v-model="queryTime"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          检索
        </el-button>
      </div>
    </div> -->
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="拖拽排序" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="110px" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover ? scope.row.cover : 'Default'" width="100px;">
        </template>
      </el-table-column>
      <el-table-column label="视频标题" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
          <!--<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
          <!--<el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column label="分类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.column_name ? scope.row.column_name : '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author_name ? scope.row.author_name : '未知' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权重" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at ? scope.row.created_at : '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-for="(item,i) in _data.list" :key="i">
      {{ i + 1 }} + {{ item.id }}
    </div>
    <div style="background-color:#e3e3e3">{{ idlist }}</div>
  </div>
</template>

<script>
import { fetchList } from '@/api/select'
import Sortable from 'sortablejs'
// import { fetchList as fetchColumList } from '@/api/column'
// import { statusList, userWatchJurisdiction } from '@/api/const'
// import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import SingleImageToAws from '@/components/Upload/SingleImageToAws.vue'
export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 7
      },
      sortable: null,
      oldList: [],
      newList: [],
      idlist: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.setSort()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code === 200) {
          console.log('重新获取一次列表')
          this.list = response.result.list
          this.total = response.result.total
          console.log(this.list)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      const test = this.$refs.dragTable.$el.querySelector('.el-table__body-wrapper > table > tbody')
      console.log('11111111111111111111111111')
      console.log(el)
      console.log(test)
      console.log('22222222222222222222222222')
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          console.log('shuaxinbuhui')
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          console.log('this is targetrow')
          console.log(targetRow.id)
          console.log(this._data.list)
          console.log(this._data.list[1])
          console.log(evt.oldIndex + 1)// 拖动前的 顺位
          console.log(evt.newIndex + 1)// 拖动后的 顺位
          this.idlist = []
          this._data.list.forEach(element => {
            const list = this.idlist
            list.push(element.id)
          })
          console.log(this.idlist)
          // 发送请求：调整排序
        }
      })
    },
    updateWeight() {

    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
  .filter-container /deep/ .filter-item { margin-bottom: 0}
  .form_upload_cover img {width: 230px; height: 135.39px;}
  .form_upload_cover_s img {width: 230px; height: 282.19858156px;}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
