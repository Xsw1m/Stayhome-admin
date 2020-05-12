<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.admin_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="新建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at ? scope.row.created_at : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!=='3'" size="mini" type="danger" @click="handleDeleteRow(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800">

      <!--status-->
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 100%;">
        <el-form-item label="真实姓名" prop="admin_name">
          <el-input v-model="temp.admin_name" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="账号密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>

        <el-form-item label="重复密码" prop="password_two">
          <el-input v-model="temp.password_two" type="password" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" label="状态" prop="admin_type">
          <el-select v-model="temp.admin_type" class="filter-item" placeholder="Please select">
            <el-option key="1" label="超级管理员" value="1" />
            <el-option key="2" label="管理员" value="2" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

import { fetchList, fetchItem, updateItem, createItem, deleteItem } from '@/api/admins'
import { adminList } from '@/api/const'

export default {
  name: 'AdminList',
  // directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = []
      for (let i = 0; i < adminList.length; i++) {
        statusMap[adminList[i]['value']] = adminList[i]['label']
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
      statusOptions: [],
      temp: {
        id: undefined,
        admin_name: undefined,
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
        admin_name: [{ required: true, message: '必须填写', trigger: 'change' }],
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
    this.statusOptions = adminList
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        if (response.code === 200) {
          this.list = response.result.list
          this.total = response.result.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleDeleteRow(row) {
      console.log(this.list.length)
      if (this.length > 1) {
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
      } else {
        this.$notify({
          title: '禁止删除',
          message: '最后一条不能删除',
          type: 'warning',
          duration: 2000
        })
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        admin_name: undefined,
        phone: undefined,
        email: undefined,
        password: undefined,
        password_two: undefined,
        admin_type: undefined,
        status: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createItem(qs.stringify(this.temp)).then(response => {
            if (response.code === 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
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
    }

  }
}
</script>
<style>
  .filter-container .filter-item { margin-bottom: 0}
  .form_upload_cover img {width: 282px; height: 166px;}
  .form_upload_cover_s img {width: 282px; height: 346px;}
</style>
