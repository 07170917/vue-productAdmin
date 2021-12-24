<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item label="用户名">
        <el-input
          v-model.trim="query.requestData.username"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属角色">
        <el-select v-model="query.requestData.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleData"
            :key="item.value"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="querySearch"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="queryRefresh">重置</el-button>
        <el-button
          @click="addUserDialog = true"
          type="primary"
          icon="el-icon-circle-plus-outline"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      stripe
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95" prop="id">
      </el-table-column>
      <el-table-column label="用户名" prop="username" align="center">
      </el-table-column>
      <el-table-column
        label="所属角色"
        prop="adminRole.roleName"
        align="center"
      >
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
      </el-table-column>
      <el-table-column label="更改时间" prop="updateTime" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editUserDialogAction(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10, 20, 40, 80]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>

    <!-- 新增用户表单 -->
    <el-dialog title="新增用户" :visible.sync="addUserDialog">
      <el-form :model="addUserFrom">
        <el-form-item label="用户名称：" label-width="120px">
          <el-input
            v-model.trim="addUserFrom.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" label-width="120px">
          <el-input
            type="password"
            v-model.trim="addUserFrom.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属角色：" label-width="120px">
          <el-select v-model="addUserFrom.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleData"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="用户编辑" :visible.sync="editUserDialog">
      <el-form :model="editUserFrom">
        <el-form-item label="用户名称：" label-width="120px">
          <el-input
            v-model.trim="editUserFrom.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属角色：" label-width="120px">
          <el-select v-model="editUserFrom.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleData"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAdminUser,
  getAllRole,
  getListData,
  deleteUser,
  editAdminUser
} from "@/api/systemManager/user";

export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      query: {
        requestData: {},
      }, //查询条件
      page: {
        total: 0,
        page: 1,
        size: 10,
      },
      addUserDialog: false,
      addUserFrom: {
        
      },
      roleData: [],
      editUserDialog: false,
      editUserFrom: {
        id:null,
        username: "",
        roleId: null,
      },
    };
  },
  created() {
    this.fetchData();
    getAllRole().then((response) => {
      this.roleData = response.data;
    });
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getListData(this.query, this.page.page, this.page.size).then(
        (response) => {
          this.list = response.data.data;
          this.page.total = response.data.totalCount;
          this.listLoading = false;
        }
      );
    },
    querySearch() {
      this.page.page = 1;
      this.fetchData();
    },
    queryRefresh() {
      this.query.requestData = {};
      this.fetchData();
    },
    addUser() {
      this.addUserDialog = false;
      addAdminUser(this.addUserFrom).then((response)=>{
        this.fetchData();
      });
    },
    editUserDialogAction(data){
      this.editUserFrom.username=data.username;
      this.editUserFrom.id=data.id;
      this.editUserFrom.roleId=data.adminRole.id
      this.editUserDialog=true;
    },
    editUser(){
      this.editUserDialog = false;
      editAdminUser(this.editUserFrom).then((response)=>{
        this.fetchData()
      })
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      this.fetchData();
    },
    deleteUser(val) {
      this.$confirm("确认删除该用户吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(val).then((response) => {
            this.fetchData();
          });
        });
    },
  },
};
</script>
