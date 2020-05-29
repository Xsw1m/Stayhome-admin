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
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 75px;heiht:75px;border-radius: 100%;">
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">-->
          <!--修改-->
          <!--</el-button>
          <el-button type="primary" size="mini" @click="handleAudit(row)">
            审核
          </el-button>-->
          <el-button v-if="row.status!=='3'" size="mini" type="danger" @click="handleDeleteRow(row)">
            删除
          </el-button>
        </template>
        <!-- <template slot-scope="{row}">
          <p>管理员用户禁止删除</p>
        </template> -->
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800">

      <!--status-->
      <el-form ref="dataForm" :rules="rules" :model="audit" label-position="left" label-width="100px" style="width: 100%;">

        <el-form-item v-show="true" label="审核" prop="opinion">
          <el-select v-model="audit.opinion" class="filter-item" placeholder="Please select">
            <el-option key="1" label="通过" value="1" />
            <el-option key="2" label="拒绝" value="2" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="auditData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

import { fetchList, fetchItem, updateItem, deleteItem, auditItem } from '@/api/users'
import { userStatusList } from '@/api/const'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'UserList',
  // directives: { waves },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: '男',
        3: '女'
      }
      return statusMap[status]
    }
  },
  data() {
    const mobileValidate = (rule, mobile, callback) => {
      // 检测用户是否正确。
      if (mobile === '') {
        callback(new Error('手机号不能为空'))
        return false
      }
      const reg = new RegExp('^[1][3-9][0-9]{9}$')
      if (!reg.test(mobile)) {
        callback(new Error('手机号格式不正确'))
        return false
      }
      callback()
    }

    const pwdCheckValidate = (rule, value, callback) => {
      if (this.temp.password !== '' && value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.temp.password !== value) {
        callback(new Error('新密码和确认密码应相同'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      statusOptions: [],
      audit: {
        id: undefined,
        opinion: undefined
      },
      temp: {
        id: undefined,
        real_name: undefined,
        phone: undefined,
        email: undefined,
        password: undefined,
        password_two: undefined,
        admin_type: undefined,
        status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      itemRow: [],
      rules: {
        real_name: [{ required: true, message: '必须填写', trigger: 'change' }],
        phone: [{ required: true, validator: mobileValidate, trigger: 'change' }],
        password: [{ required: true, message: '必须填写', trigger: 'change' }],
        password_two: [
          { required: true, validator: pwdCheckValidate, trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.statusOptions = userStatusList
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code === 200) {
          console.log('获取全部用户：', response.result)
          this.list = response.result.list
          this.total = response.result.total
          // this.list = response.result.list.splice(2)
          // if (this.list.length = this.total) {
          //   let i = this.list.length-(this.length - 1)
          //   let j = this.list.length-(this.length - 2)
          // }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
    resetTemp() {
      this.temp = {
        id: undefined,
        real_name: undefined,
        phone: undefined,
        email: undefined,
        password: undefined,
        password_two: undefined,
        admin_type: undefined,
        status: undefined
      }
    },
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       createItem(qs.stringify(this.temp)).then(response => {
    //         if (response.code === 200) {
    //           this.dialogFormVisible = false
    //           this.$notify({
    //             title: 'Success',
    //             message: 'Created Successfully',
    //             type: 'success',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj

      fetchItem(row.id).then(response => {
        this.temp = Object.assign({}, response.result)
        delete this.temp.password
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
          const tempData = Object.assign({}, this.temp)

          delete tempData.password_two

          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateItem(qs.stringify(tempData), this.temp.id).then(response => {
            if (response.code === 200) {
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

    handleAudit(row) {
      this.audit.id = row.id
      // this.temp = Object.assign({}, row) // copy obj

      // fetchItem(row.id).then(response => {
      //   this.temp = Object.assign({}, response.result)
      // })
      // //
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    auditData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.audit)

          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          auditItem(qs.stringify(tempData), this.audit.id).then(response => {
            if (response.code === 200) {
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
    }
  }
}
</script>
<style>
  .filter-container .filter-item { margin-bottom: 0}
  .form_upload_cover img {width: 282px; height: 166px;}
  .form_upload_cover_s img {width: 282px; height: 346px;}
  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
