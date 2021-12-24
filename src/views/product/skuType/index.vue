<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item label="sku类型名称">
        <el-input
          v-model.trim="query.requestData.skuTypeName"
          placeholder="sku类型名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="querySearch"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="queryRefresh">重置</el-button>
        <el-button
          @click="addSkuTypeDialog = true"
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
      <el-table-column label="sku类型名称" prop="skuTypeName" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
      </el-table-column>
      <el-table-column label="更改时间" prop="updateTime" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editSkuTypeDialogAction(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="deleteSkuTypeAction(scope.row)"
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
    <el-dialog title="新增sku类型" :visible.sync="addSkuTypeDialog">
      <el-form :model="addSkuTypeFrom">
        <el-form-item label="sku类型名称：" label-width="120px">
          <el-input
            v-model.trim="addSkuTypeFrom.skuTypeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSkuTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSkuTypeButton">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="sku类型编辑" :visible.sync="editSkuTypeDialog">
      <el-form :model="editSkuTypeFrom">
        <el-form-item label="sku类型名称：" label-width="120px">
          <el-input
            v-model.trim="editSkuTypeFrom.skuTypeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSkuTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSkuTypeButton">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addSkuType,
  getListData,
  deleteSkuType,
  editSkuType
} from "@/api/product/skuType";

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
      addSkuTypeDialog: false,
      addSkuTypeFrom: {
        
      },
      roleData: [],
      editSkuTypeDialog: false,
      editSkuTypeFrom: {
        id:null,
        skuTypeName: "",
        roleId: null,
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
    addSkuTypeButton() {
      this.addSkuTypeDialog = false;
      addSkuType(this.addSkuTypeFrom).then((response)=>{
        this.fetchData();
      });
    },
    editSkuTypeDialogAction(data){
      this.editSkuTypeFrom.skuTypeName=data.skuTypeName;
      this.editSkuTypeFrom.id=data.id;
      this.editSkuTypeDialog=true;
    },
    editSkuTypeButton(){
      this.editSkuTypeDialog = false;
      editSkuType(this.editSkuTypeFrom).then((response)=>{
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
    deleteSkuTypeAction(val) {
      this.$confirm("确认删除该用户吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSkuType(val).then((response) => {
            this.fetchData();
          });
        });
    },
  },
};
</script>
