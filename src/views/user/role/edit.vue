<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <el-form-item label="角色名" class="flex-50"  prop="name">
                <el-input v-model="dataInfo.name" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="排列顺序" class="flex-50"  prop="priority">
                 <el-input v-model="dataInfo.priority" class="cms-width" type="number"></el-input>
         </el-form-item>   
          <el-form-item label="等级" class="flex-50"  prop="level">
                <el-input v-model="dataInfo.level" class="cms-width" type="number"></el-input>
         </el-form-item> 
         <el-form-item label="拥有所有权限" class="flex-50"  prop="all">
           <el-radio-group v-model="dataInfo.all" :disabled="!roleAll">
                   <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
           </el-radio-group>
           <span v-if="!roleAll" class="gray">非超级管理员不能勾选该选项</span>
         </el-form-item> 
            <el-form-item label="拥有所有权限" class="flex-100" v-show="!dataInfo.all">
               <span class="gray">勾选菜单操作时，请尽量选择列表菜单，以避免未知问题</span>
                <!-- 角色 -->
              <cms-role  :perms="dataInfo.perms"  ref="role" v-if="ready"></cms-role>
         </el-form-item> 
         <div class="form-footer">
             <el-button type="warning" v-if="isType('save')"    @click="add(true)" 
                  v-perms="'/role/save'"
             >保存并继续添加</el-button>
               <el-button type="primary" v-if="isType('save')" @click="add(false)"
                  v-perms="'/role/save'"
               >提交</el-button>
               <el-button type="primary" v-if="isType('update')" @click="update()"
                  v-perms="'/role/update'"
               >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
                <span class="gray" v-if="isType('save')">选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
         </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      ready:false,
      rules: {//校验规则
      name:[required],
      priority:[required,number],
      level:[required,number],
      all:[required],
      },
      roleAll:false,
    };
  },
  methods: {
    getImages(path){
     
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(api.roleGet, { id: id })
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
         this.ready=true;
         if(this.type=='save'){
            this.dataInfo.all=false;
         }

          this.$refs["form"].resetFields();

        })
        .catch(err => {
          this.loading = false;
        });
    },
   
    getRole(role){

      this.dataInfo.perms=this.$refs.role.creatRoles()    
    },
    update() {
      this.getRole();
      this.updateDataInfo(this.$api.roleUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.getRole();
      this.saveDataInfo(state,this.$api.roleSave, this.dataInfo, "list");
    }
  },
  created() {
    //初始获取数据
    if(this.$store.state.perms.permsList === '*'){
        this.roleAll = true;
    }
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>
