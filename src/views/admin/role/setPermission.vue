<template>
  <div class="app-container">
    <el-tree
      :data="list"
      show-checkbox
      node-key="id"
      ref="tree"
      :default-checked-keys="defaultChecked"
      :expand-on-click-node="false"
      @check="clickCheck"
    >
    </el-tree>
  </div>
</template>

<script>
import { getData } from "@/api/systemManager/permission";

import {
  setRolePermission,
  findRolePermission,
} from "@/api/systemManager/role";
export default {
  filters: {},
  data() {
    return {
      list: null,
      addPermissionDialog: false,
      addPermissionFrom: {
        pid: 0,
        permissionName: "",
        permissionUrl: "",
      },
      clickData: {
        roleId: 0,
        permissionId: 0,
      },
      editPermissionDialog: false,
      editPermissionFrom: {
        id: null,
        permissionName: "",
        permissionUrl: "",
      },
      defaultChecked: [],
    };
  },
  created() {
    this.fetchData();
    this.clickData.roleId = this.$route.query.roleId;
  },
  methods: {
    fetchData() {
      getData().then((response) => {
        this.list = response.data;
      });
      findRolePermission({ id: this.$route.query.roleId }).then((response) => {
        this.defaultChecked = response.data;
      });
    },
    clickCheck(data) {
      let that=this;
      this.clickData.permissionId = data.id;
      setRolePermission(this.clickData).then((response) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 500);
        this.$message({
          message: response.msg,
          type: response.code == 200 ? "success" : "error",
        });
        findRolePermission({ id: this.$route.query.roleId }).then(
          (response) => {
            that.$refs.tree.setCheckedKeys(response.data);
          }
        );
      });
    },
  },
};
</script>

