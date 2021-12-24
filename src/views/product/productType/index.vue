<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button
          @click="addProductTypeDialog = true"
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
    <span class="custom-tree-node" slot-scope="{ data }">
        <span>{{ data.typeName }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加子级类型
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => editProductTypeDialogAction(data)">
            编辑类型
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deleteProductType(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- 新增产品类型表单 -->
    <el-dialog title="新增产品类型" :visible.sync="addProductTypeDialog">
      <el-form :model="addProductTypeFrom">
        <el-form-item label="产品类型名称：" label-width="120px">
          <el-input
            v-model.trim="addProductTypeFrom.typeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProductTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addProductType">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑产品类型表单 -->
    <el-dialog title="产品类型编辑" :visible.sync="editProductTypeDialog">
      <el-form :model="editProductTypeFrom">
        <el-form-item label="产品类型名称：" label-width="120px">
          <el-input
            v-model.trim="editProductTypeFrom.typeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editProductTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editProductType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addProductType,
  deleteProductType,
  editProductType,
  findProductType,
  getData,
} from "@/api/product/productType";

export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      addProductTypeDialog: false,
      addProductTypeFrom: {
        typePid:0,
        typeName: ""
      },
      editProductTypeDialog: false,
      editProductTypeFrom: {
        id: null,
        typeName: ""
      },
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
        console.log(this.list)
      });
    },
    addProductType() {
      this.addProductTypeDialog = false;
      addProductType(this.addProductTypeFrom).then((response) => {
        this.fetchData();
      });
    },
    append(data) {
      this.addProductTypeDialog = true;
      this.addProductTypeFrom.typePid=data.id;
    },
    editProductTypeDialogAction(data) {
      findProductType(data).then((response)=>{
        this.editProductTypeFrom.typeName = response.data.typeName;
        this.editProductTypeFrom.id = response.data.id;
      })
      this.editProductTypeDialog = true;
    },
    editProductType() {
      this.editProductTypeDialog = false;
      editProductType(this.editProductTypeFrom).then((response) => {
        this.fetchData();
      });
    },
    deleteProductType(val) {
      this.$confirm("确认删除该产品类型吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteProductType(val).then((response) => {
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
