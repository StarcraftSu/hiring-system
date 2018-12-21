<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>
    <el-form ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
      <el-form-item label="站点名称" class="flex-50" prop="site">
        <el-select v-model="dataInfo.site" placeholder="请选择" value-key="id" @change="getSiteInfo">
          <el-option v-for="item in siteTree" :key="item.id" :label="item.name" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="flex-50"></el-form-item>
      <el-form-item label="百度统计用户名" class="flex-50" prop="userName">
        <el-input v-model="dataInfo.userName" class="cms-width"></el-input>
      </el-form-item>
      <el-form-item label="密码" class="flex-50" prop="password">
        <el-input v-model="dataInfo.password" class="cms-width"></el-input>
      </el-form-item>
      <el-form-item label="Token" class="flex-50" prop="tjToken">
        <el-input v-model="dataInfo.tjToken" class="cms-width"></el-input>
      </el-form-item>
      <el-form-item label="siteId" class="flex-50" prop="tjSiteId">
        <el-input v-model="dataInfo.tjSiteId" class="cms-width"></el-input>
      </el-form-item>
      <el-form-item label="接口名称" class="flex-50" prop="apiName">
        <el-input v-model="dataInfo.apiName" class="cms-width" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="account_type" class="flex-50" prop="account_type">
        <el-input v-model="dataInfo.account_type" class="cms-width" :readonly="true"></el-input>
      </el-form-item>
      <div class="form-footer">
        <!-- <el-button v-if="this.id==0" type="warning" @click="add(true)" v-perms="'/stat/save'">添加并继续保存</el-button> -->
        <el-button v-if="this.id==0" type="primary" @click="add(false)" v-perms="'/stat/save'">添加</el-button>
        <el-button v-if="this.id!=0" type="primary" @click="add(false)" v-perms="'/stat/edit'">提交</el-button>
        <el-button type="info" @click="$reset">重置</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import listMixins from '@/mixins/form'
import axios from 'axios'
import va from '@/rules'
import { Encrypt } from '@/untils/aes'
export default {
  mixins: [listMixins],
  data() {
    let self = this
    let required = va.required()
    let number = va.number()
    let numAndStr = va.NumAndStr('必须是数字或者小写字母')
    return {
      siteTree: [],
      dataInfo: {
        site: {},
        siteId: '',
        siteName: '',
        apiName: 'https://api.baidu.com/json/tongji/v1/ReportService/getData',
        //apiName:'https://api.baidu.com/json/tongji/v1/ReportService/getSiteList',
        account_type: 1
      },
      rules: {
        //校验规则
        site: [required],
        userName: [required],
        password: [required],
        tjSiteId: [required],
        tjToken: [required]
      }
    }
  },
  methods: {
    getSiteInfo(item) {
      this.dataInfo.siteId = item.id
      this.dataInfo.siteName = item.name
    },
    getDataInfo(id) {
    this.loading = true
     axios.post(this.$api.siteTree, { root: '' })
        .then(siteInfo => {
          if (siteInfo.code == '200') {
            this.loading = false
            this.siteTree = siteInfo.body
            this.dataInfo.site = {}
            this.dataInfo.apiName =
              'https://api.baidu.com/json/tongji/v1/ReportService/getData'
            this.dataInfo.account_type = 1
             if (id != 0) {
              //编辑
              axios.post(this.$api.statList, { siteId: id }).then(statInfo => {
                 let info = statInfo.body[0]
                 this.dataInfo.userName=info.userName
                 this.dataInfo.password=info.password
                 this.dataInfo.tjToken=info.tjToken
                 this.dataInfo.tjSiteId=info.tjSiteId
                 this.dataInfo.siteName=info.siteName
                 this.dataInfo.siteId=info.id
                this.dataInfo.site = {
                  name: info.siteName,
                  id: info.id
                }
              }).catch(error => {
          this.loading = false
        })
            }
          }
        })
        .catch(error => {
          this.loading = false
        })
           
    },
    add(state) {
      if (this.dataInfo.tjToken != '') {
        this.dataInfo.tjToken = Encrypt(
          this.dataInfo.tjToken,
          process.env.aesKey,
          process.env.ivKey
        ) //加密
      }
      if (this.dataInfo.tjSiteId != '') {
        this.dataInfo.tjSiteId = Encrypt(
          this.dataInfo.tjSiteId,
          process.env.aesKey,
          process.env.ivKey
        ) //加密
      }
      delete this.dataInfo.apiName
      delete this.dataInfo.account_type
      delete this.dataInfo.site
      this.saveDataInfo(state, this.$api.statSave, this.dataInfo, 'list')
    }
  },
  created() {
    this.getDataInfo(this.id)
  }
}
</script>

<style>
</style>