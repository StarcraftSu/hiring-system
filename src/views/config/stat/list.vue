<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/stat/add','save',0)"
              v-perms="'/stat/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="站点ID" width="50" align="center"></el-table-column>
            <el-table-column prop="siteName" label="站点名称" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/stat/edit','update',scope.row.id)"
                        v-perms="'/stat/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.statDelete,scope.row.id)"
                     v-perms="'/stat/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.statDelete,ids)"
                   v-perms="'/stat/delete'"  
                  >批量删除</el-button>
                </div>
            
          </div> 
     </section> 
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {//只需要业务参数
       
      }
    };
  },
  created(){
     this.initTableData(this.$api.statList,this.params);
  }
};
</script>
    
<style>

</style>