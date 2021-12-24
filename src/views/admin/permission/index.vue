<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button
          @click="addPermissionDialog = true"
          type="primary"
          icon="el-icon-circle-plus-outline"
          >添加顶层</el-button
        >
      </el-form-item>
    </el-form>

    <el-tree
      :data="list"
      node-key="id"
    >
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加子级权限
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => editPermissionDialogAction(data)">
            编辑权限
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deletePermission(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- 新增权限表单 -->
    <el-dialog title="新增权限" :visible.sync="addPermissionDialog">
      <el-form :model="addPermissionFrom">
        <el-form-item label="权限名称：" label-width="120px">
          <el-input
            v-model.trim="addPermissionFrom.permissionName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限地址：" label-width="120px">
          <el-input
            v-model.trim="addPermissionFrom.permissionUrl"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限类型：" label-width="120px">
          <el-select v-model="addPermissionFrom.type" placeholder="请选择权限类型">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.typeName"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPermissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPermission">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑权限表单 -->
    <el-dialog title="权限编辑" :visible.sync="editPermissionDialog">
      <el-form :model="editPermissionFrom">
        <el-form-item label="权限名称：" label-width="120px">
          <el-input
            v-model.trim="editPermissionFrom.permissionName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限地址：" label-width="120px">
          <el-input
            v-model.trim="editPermissionFrom.permissionUrl"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限类型：" label-width="120px">
          <el-select v-model="editPermissionFrom.type" placeholder="请选择权限类型">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.typeName"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPermissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAdminPermission,
  deletePermission,
  editAdminPermission,
  findPermission,
  getData,
} from "@/api/systemManager/permission";

export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      addPermissionDialog: false,
      addPermissionFrom: {
        pid:0,
        permissionName: "",
        permissionUrl: "",
        type:0
      },
      editPermissionDialog: false,
      editPermissionFrom: {
        id: null,
        permissionName: "",
        permissionUrl: "",
        type:0
      },
      type:[
        {value:0,typeName:"接口"},
        {value:1,typeName:"页面组"},
        {value:2,typeName:"普通页面"},
        {value:3,typeName:"隐藏页面"},
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getData().then((response) => {
        this.list = response.data;
      });
    },
    addPermission() {
      this.addPermissionDialog = false;
      addAdminPermission(this.addPermissionFrom).then((response) => {
        this.fetchData();
      });
    },
    append(data) {
      this.addPermissionDialog = true;
      this.addPermissionFrom.pid=data.id;
    },
    editPermissionDialogAction(data) {
      findPermission(data).then((response)=>{
        this.editPermissionFrom.permissionName = response.data.permissionName;
        this.editPermissionFrom.permissionUrl = response.data.permissionUrl;
        this.editPermissionFrom.type = response.data.type;
        this.editPermissionFrom.id = response.data.id;
      })
      this.editPermissionDialog = true;
    },
    editPermission() {
      this.editPermissionDialog = false;
      editAdminPermission(this.editPermissionFrom).then((response) => {
        this.fetchData();
      });
    },
    deletePermission(val) {
      this.$confirm("确认删除该权限吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deletePermission(val).then((response) => {
          this.fetchData();
        });
      });
    },
  },
};
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
