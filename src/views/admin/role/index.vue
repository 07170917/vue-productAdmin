<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item label="角色名">
        <el-input
          v-model.trim="query.requestData.roleName"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="querySearch"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="queryRefresh">重置</el-button>
        <el-button
          @click="addRoleDialog = true"
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
      <el-table-column label="角色名" prop="roleName" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
      </el-table-column>
      <el-table-column label="更改时间" prop="updateTime" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editRoleDialogAction(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="success" @click="setPermissionAction(scope.row.id)"
            >权限设置</el-button
          >
          <el-button size="mini" type="danger" @click="deleteRole(scope.row)"
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

    <!-- 新增角色表单 -->
    <el-dialog title="新增角色" :visible.sync="addRoleDialog">
      <el-form :model="addRoleFrom">
        <el-form-item label="角色名称：" label-width="120px">
          <el-input
            v-model.trim="addRoleFrom.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色表单 -->
    <el-dialog title="角色编辑" :visible.sync="editRoleDialog">
      <el-form :model="editRoleFrom">
        <el-form-item label="角色名称：" label-width="120px">
          <el-input
            v-model.trim="editRoleFrom.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAdminRole,
  getListData,
  deleteRole,
  editAdminRole
} from "@/api/systemManager/role";

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
      addRoleDialog: false,
      addRoleFrom: {
      },
      editRoleDialog: false,
      editRoleFrom: {
        id:null,
        roleName: "",
      },
    };
  },
  created() {
    this.fetchData();
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
    addRole() {
      this.addRoleDialog = false;
      addAdminRole(this.addRoleFrom).then((response)=>{
        this.fetchData();
      });
    },
    editRoleDialogAction(data){
      this.editRoleFrom.roleName=data.roleName;
      this.editRoleFrom.id=data.id;
      this.editRoleDialog=true;
    },
    editRole(){
      this.editRoleDialog = false;
      editAdminRole(this.editRoleFrom).then((response)=>{
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
    setPermissionAction(val){
      this.$router.push({path:'/admin/role/setPermission',query:{'roleId':val}})
    },
    deleteRole(val) {
      this.$confirm("确认删除该角色吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(val).then((response) => {
            this.fetchData();
          });
        });
    },
  },
};
</script>
