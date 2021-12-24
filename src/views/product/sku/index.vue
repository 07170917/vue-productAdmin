<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item label="sku名称">
        <el-input
          v-model.trim="query.requestData.skuName"
          placeholder="sku名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属sku类型">
        <el-select v-model="query.requestData.skuTypeId" placeholder="请选择sku类型">
          <el-option
            v-for="item in skuType"
            :key="item.value"
            :label="item.skuTypeName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.requestData.status" placeholder="请选择状态">
          <el-option
            v-for="(item,index) in status"
            :key="index"
            :label="item"
            :value="index"
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
          @click="addSkuDialog = true"
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
      <el-table-column align="center" label="ID" width="40" prop="id">
      </el-table-column>
      <el-table-column label="sku名称" prop="skuName" align="center">
      </el-table-column>
      <el-table-column
        label="所属sku类型"
        prop="skuType.skuTypeName"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        align="center" width="50"
      >
        <template slot-scope="scope">
          <div> {{status[scope.row.status]}} </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
      </el-table-column>
      <el-table-column label="更改时间" prop="updateTime" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editSkuDialogAction(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" v-if="scope.row.status==0" type="danger" @click="editSkuStatus(scope.row,1)"
            >禁用</el-button
          >
          <el-button size="mini" v-if="scope.row.status==1" type="danger" @click="editSkuStatus(scope.row,0)"
            >启用</el-button
          >
          <el-button size="mini" type="danger" @click="deleteSku(scope.row)"
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

    <!-- 新增sku表单 -->
    <el-dialog title="新增sku" :visible.sync="addSkuDialog">
      <el-form :model="addSkuFrom">
        <el-form-item label="sku名称：" label-width="120px">
          <el-input
            v-model.trim="addSkuFrom.skuName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属sku类型：" label-width="120px">
          <el-select v-model="addSkuFrom.skuTypeId" placeholder="请选择sku类型">
            <el-option
              v-for="item in skuType"
              :key="item.value"
              :label="item.skuTypeName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSkuDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSku">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="用户编辑" :visible.sync="editSkuDialog">
      <el-form :model="editSkuFrom">
        <el-form-item label="sku名称：" label-width="120px">
          <el-input
            v-model.trim="editSkuFrom.skuName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属sku类型：" label-width="120px">
          <el-select v-model="editSkuFrom.skuTypeId" placeholder="请选择sku类型">
            <el-option
              v-for="item in skuType"
              :key="item.value"
              :label="item.skuTypeName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSkuDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSku">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addSku,
  getAllSkuType,
  getListData,
  deleteSku,
  editSku
} from "@/api/product/sku";

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
      addSkuDialog: false,
      addSkuFrom: {
        
      },
      skuType: [],
      editSkuDialog: false,
      editSkuFrom: {
        id:null,
        skuName: "",
        skuTypeId: null,
      },
      status: ["新增","启用","禁用"]
    };
  },
  created() {
    this.fetchData();
    getAllSkuType().then((response) => {
      this.skuType = response.data;
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
    addSku() {
      this.addSkuDialog = false;
      addSku(this.addSkuFrom).then((response)=>{
        this.fetchData();
      });
    },
    editSkuDialogAction(data){
      this.editSkuFrom.skuName=data.skuName;
      this.editSkuFrom.id=data.id;
      this.editSkuFrom.skuTypeId=data.skuType.id
      this.editSkuDialog=true;
    },
    editSku(){
      this.editSkuDialog = false;
      editSku(this.editSkuFrom).then((response)=>{
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
    editSkuStatus(val,status){
      val.status=status
    },
    deleteSku(val) {
      this.$confirm("确认删除该用户吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSku(val).then((response) => {
            this.fetchData();
          });
        });
    },
  },
};
</script>
