<template>
  <section  class="cms-body flex">
    <!-- 树组件 -->
    <cms-tree @change="getChannelId" :hasContent='true'></cms-tree>
    <div class="cms-content-right">
      <!-- 栏目 -->
      <div class="cms-list-header clearfix flex">
        <div class="bread-box cms-left">
          <label class="">当前栏目:</label>
          <ul class="type-bread">
            <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
              <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
            </li>
          </ul>
        </div>
           <div class="cms-left channel-group">
                <el-dropdown @command="addChannel">
              <el-button type="primary">
               <i class="el-icon-plus "></i> 添加内容
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  v-for="item in modelList" :key="item.id"
                :command="item.id">
                  {{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>
      <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
        <div  style="margin-top:16px;flex:auto">
          <div class="el-checkbox-group cms-left">
                    <el-checkbox-button  v-model="params.queryTopLevel" @change="query" border>固顶</el-checkbox-button>
                    <el-checkbox-button v-model="params.queryRecommend" @change="query" border>推荐</el-checkbox-button>
              </div>
              <!-- 所有类型 -->
              <el-select class="cms-left"   placeholder="所有类型" v-model="params.queryTypeId" @change="query" style="width:120px">
                <el-option label="所有类型" value=" "></el-option>
                <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
                 <!-- 所有状态 -->
              <el-select  class="cms-left"  placeholder="所有状态" v-model="params.queryStatus" @change="query" style=" width:120px">
                        <el-option label="本站内容" value="all"></el-option>
                        <el-option label="投稿" value="contribute"></el-option>
                        <el-option label="草稿" value="draft"></el-option>
                        <el-option label="待审" value="prepared"></el-option>
                        <el-option label="已审" value="passed"></el-option>
                        <el-option label="终审" value="checked"></el-option>
                        <el-option label="退回" value="rejected"></el-option>
                        <el-option label="归档" value="pigeonhole"></el-option>
                 </el-select>
                <!-- 排序方式 -->
             <el-select v-model="params.queryOrderBy" @change="query">
                  <el-option label="ID降序" value="0"></el-option>
                  <el-option label="ID升序" value="1"></el-option>
                  <el-option label="发布时间降" value="2"></el-option>
                  <el-option label="发布时间升" value="3"></el-option>
                  <el-option label="固顶降,发布降" value="4"></el-option>
                  <el-option label="固顶降,发布升" value="5"></el-option>
                  <el-option label="日点击降" value="6"></el-option>
                  <el-option label="周点击降" value="7"></el-option>
                  <el-option label="月点击降" value="8"></el-option>
                  <el-option label="总点击降" value="9"></el-option>
                  <el-option label="日评论降" value="10"></el-option>
                  <el-option label="周评论降" value="11"></el-option>
                  <el-option label="月评论降" value="12"></el-option>
                  <el-option label="总评论降" value="13"></el-option>
                  <el-option label="日下载降" value="14"></el-option>
                  <el-option label="周下载降" value="15"></el-option>
                  <el-option label="月下载降" value="16"></el-option>
                  <el-option label="总下载降" value="17"></el-option>
                  <el-option label="日顶降" value="18"></el-option>
                  <el-option label="周顶降" value="19"></el-option>
                  <el-option label="月顶降" value="20"></el-option>
                  <el-option label="总顶降" value="21"></el-option>
                  <el-option label="推荐降,发布升" value="22"></el-option>
                  <el-option label="推荐升,发布降" value="23"></el-option>
                </el-select>
       </div>
      <div  style="margin-top:16px;flex:auto" class="content-flex-right">
                 <cms-input label="标题" v-model="params.queryTitle" :width="120" ></cms-input>
                 <cms-input label="发布者" v-model="params.queryInputUsername" :width="120" ></cms-input>
                 <el-button @click="query" >查询</el-button>
          </div>
       </div>
      <el-table :data="tableData" stripe @selection-change="checkIdsAndStatus"  v-loading="loading">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="left" min-width="250px">
          <div slot-scope="scope" >
            <span class="cms-ups" v-if="scope.row.topLevel>0">[顶{{scope.row.topLevel}}]</span>
            <span class="cms-recommend" v-if="scope.row.recommend">[推荐{{scope.row.recommendLevel}}]</span>
            <span class="cms-channel-name">[{{scope.row.channelName}}]</span>
            <a class="link" :href="scope.row.url" :title="scope.row.title" target="_blank">{{scope.row.title}}</a>
          </div>
        </el-table-column>
        <el-table-column prop="topLevel" label="置顶" align="center">
          <div slot-scope="scope">
            <el-input v-model.number="scope.row.topLevel"  class="w50" min="0" max="99" :maxlength="2"></el-input>
          </div>
        </el-table-column>
        <!--类型 -->
        <el-table-column label="类型" prop="typeName" align="center"></el-table-column>
        <!--发布者 -->
        <el-table-column label="发布者" prop="userName" align="center"></el-table-column>
             <!--点击 -->
           <el-table-column label="点击" prop="views" align="center"></el-table-column>
               <!--日点击 -->
            <el-table-column v-if="params.queryOrderBy==='6'" label="日点击" prop="viewsDay" align="center"></el-table-column>
            <!--周点击 -->
            <el-table-column v-if="params.queryOrderBy==='7'" label="周点击" prop="viewsWeek" align="center"></el-table-column>
            <!--月点击 -->
            <el-table-column v-if="params.queryOrderBy==='8'" label="月点击" prop="viewsMonth" align="center"></el-table-column>
            <!--日评论 -->
            <el-table-column v-if="params.queryOrderBy==='10'" label="日评论" prop="commentsDay" align="center"></el-table-column>
            <!--周评论 -->
            <el-table-column v-if="params.queryOrderBy==='11'" label="周评论" prop="commentsWeek" align="center"></el-table-column>
            <!--月评论 -->
            <el-table-column v-if="params.queryOrderBy==='12'" label="月评论" prop="commentsMonth" align="center"></el-table-column>
            <!--总评论 -->
            <el-table-column v-if="params.queryOrderBy==='13'" label="评论" prop="commentCount" align="center"></el-table-column>
            <!--日下载 -->
            <el-table-column v-if="params.queryOrderBy==='14'" label="日下载" prop="downloadsDay" align="center"></el-table-column>
            <!--周下载 -->
            <el-table-column v-if="params.queryOrderBy==='15'" label="周下载" prop="downloadsWeek" align="center"></el-table-column>
            <!--月下载 -->
            <el-table-column v-if="params.queryOrderBy==='16'" label="月下载" prop="downloadsMonth" align="center"></el-table-column>
            <!--总下载 -->
            <el-table-column v-if="params.queryOrderBy==='17'" label="下载" prop="downloads" align="center"></el-table-column>
            <!--日顶数 -->
            <el-table-column v-if="params.queryOrderBy==='18'" label="日顶数" prop="upsMonth" align="center"></el-table-column>
            <!--周顶数 -->
            <el-table-column v-if="params.queryOrderBy==='19'" label="周顶数" prop="upsWeek" align="center"></el-table-column>
            <!--月顶数 -->
            <el-table-column v-if="params.queryOrderBy==='20'" label="月顶数" prop="upsMonth" align="center"></el-table-column>
            <!--顶数 -->
            <el-table-column v-if="params.queryOrderBy==='21'" label="顶数" prop="ups" align="center"></el-table-column>
        <!--发布时间 -->
        <el-table-column label="发布时间" prop="releaseDate" align="center"></el-table-column>
        <!--状态 -->
        <el-table-column label="状态" prop="status" align="center">
          <div slot-scope="scope">
            <span v-if="scope.row.status==-1">退回</span>
            <span v-if="scope.row.status==0">草稿</span>
            <span v-if="scope.row.status==1">审核中</span>
            <span v-if="scope.row.status==2">审核通过</span>
            <span v-if="scope.row.status==3">回收站</span>
            <span v-if="scope.row.status==4">投稿</span>
            <span v-if="scope.row.status==5">归档</span>
          </div>
        </el-table-column>
        <!--操作 -->
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <cms-button type="edit" @click.native="routerLink('/content/update','update',scope.row.id)"></cms-button>
            <cms-button type="delete" @click.native="deleteBatch($api.contentDelete,scope.row.id)"></cms-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 表格底部 -->
      <div class="cms-list-footer" style="padding-bottom:100px;">
        <div class="cms-left"></div>
        <!-- cms分页组件 -->
        <cms-pagination :total="allTotal" @change="getPages"></cms-pagination>
      </div>
      <div class="content-fiexd">
         <el-button :disabled="disabled" @click="deleteBatch($api.contentDelete,ids)"
           v-perms="'/content/delete'"
          >删除</el-button>
          <el-button :disabled="disabled" @click="prioritysBatch($api.contentPriority)"
            v-perms="'/content/priority'"
          >保存置顶</el-button>
          <el-button :disabled="disabled" @click="recommend(true)"
            v-perms="'/content/contentRecommend'"
          >推荐</el-button>
          <el-button :disabled="disabled" @click="recommend(false)"
           v-perms="'/content/contentRecommend'"
          >取消推荐</el-button>
          <el-button :disabled="disabled" @click="operate('move')"
            v-perms="'/content/contentMove'"
          >移动</el-button>
          <el-button :disabled="disabled" @click="operate('copy')"
            v-perms="'/content/contentCopy'"
          >复制</el-button>
          <el-button :disabled="disabled" @click="batch($api.contentCheck)"
            v-perms="'/content/contentCheck'"
          >审核</el-button>
          <el-button :disabled="disabled" @click="reject()"
            v-perms="'/content/contentReject'"
          >退回</el-button>
          <el-button :disabled="disabled" @click="batch($api.contentSubmit)"
            v-perms="'/content/contentSubmit'"
          >提交</el-button>
          <el-button :disabled="disabled" @click="batch($api.contentStatic)"
            v-perms="'/content/contentStatic'"
          >生成静态页</el-button>
          <el-button :disabled="disabled" @click="topicClick"
            v-perms="'/content/contentSend'"
          >推送至专题</el-button>
          <el-button :disabled="disabled" @click="archiveBatch($api.contentPigeonhole,'archive')" v-perms="'/content/contentPigeonhole'">归档</el-button>
          <el-button :disabled="disabled" @click="archiveBatch($api.contentUnpigeonhole,'document')" v-perms="'/content/contentUnpigeonhole'">出档</el-button>
          <el-button :disabled="disabled" @click="sendWeiXin($api.contentSendToWeixin,ids)"
            v-perms="'/content/contentSendToWeixin'"
          >群发微信</el-button>
        </div>
          <!-- 移动栏目弹窗 -->
           <el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="channelVisble" width="25%" :before-close="handleClose" :close-on-click-modal="false">
              <div class="tree-layout">
                <div class="tree">
                  <el-tree :load="ansyTree" lazy ref="channelTree" :props="props"
                    @check-change="checkChange" :default-expanded-keys="['']" show-checkbox :indent="16" node-key="id">
                  </el-tree>
                </div>
              </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="confirm">选择</el-button>
            </span>
           </el-dialog>
       <!--专题弹窗-->
         <el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="topicVisble" width="25%" :close-on-click-modal="false"
          :before-close="handleClose">
                 <el-checkbox-group v-model="topicIds" class="cms-checkbox-block" @change="handleChange">
                   <el-checkbox v-for="(item,index) in topicList"
                   :key="index"
                   :label="item.id"
                   >{{item.name}}
                   </el-checkbox>
                 </el-checkbox-group>
              <span slot="footer" class="dialog-footer">
                <el-button @click="topicCancel">返回</el-button>
                <el-button type="primary" @click="confirmTopic">确定</el-button>
              </span>
        </el-dialog>
        <!-- 退回弹窗 -->
       <el-dialog title="退回原因" :visible.sync="rejectVisble">
          <el-form :model="rejectParams">
            <el-form-item label="退回原因:" label-width="120px">
              <el-input v-model="rejectParams.rejectText" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="退回级数" label-width="120px">
                  <el-select v-model="rejectParams.rejectOpinion">
                    <el-option v-for="(item, index) in stepList"
                    :key="index"
                    :label="item"
                    :value="item"
                    ></el-option>
                  </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="rejectVisble = false">取 消</el-button>
            <el-button type="primary" @click="rejectStep">确 定</el-button>
          </div>
        </el-dialog>
    </div>
  </section>
</template>

<script>
import listMixins from "@/mixins/list";
import axios from "axios";
export default {
  mixins: [listMixins],
  data() {
    return {
      params: {
        //请求参数
        queryShare: "",
        queryTitle: "",
        queryStatus: "",
        queryTypeId: "",
        queryTopLevel: false,
        queryInputUsername: "",
        queryRecommend: false,
        queryOrderBy: "4",
        cid: "",
        pageNo: "",
        pageSize: "",
        format: "",
        https: "",
        hasCollect: ""
      },
      allTotal: 0, //分页总数
      breadItems: [
        {
          name: "根目录",
          id: ""
        }
      ], //面包屑
      modelList: {}, //当前栏目信息
      typeList: [], //内容类型接口
      topicList: [], //专题列表
      siteVisble: false,
      topicVisble: false, //专题弹窗
      channelVisble: false, //选择栏目弹窗,
      labelDialogTitle: "",
      rejectVisble: false, //退回弹窗
      stepList: [],
      currentCheckChannelId: 0, //当前选中栏目
      topicIds: [], //选中的专题数组
      pushSites: [],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      rejectParams: {
        rejectText: "",
        rejectOpinion: ""
      },
      operateType: ""
    };
  },
  methods: {
    rejectStep() {
      this.rejectParams.ids = this.ids;
      axios.post(this.$api.contentReject, this.rejectParams).then(res => {
        if (res.code == "200") {
          this.rejectVisble = false;
          this.successMessage("退回成功");
        }
      });
    },
    addChannel(command) {
      //添加内容，获取栏目id 模型id
      this.params.parentId = this.params.cid;
      this.params.modelId = command;
      this.routerLink("/content/save", "save", 0, this.params);
    },
    deleteBatch(url, ids) {
      //删除
      this.$confirm("是否确认删除?", "警告", { type: "error" })
        .then(mes => {
          this.loading = true;
          this.$http.post(url, { ids: ids }).then(res => {
            this.loading = false;
            if (res.code == "200") {
              this.successMessage("删除成功");
              this.getTableData(this.params);
              this.getAllTotal();
            }
          });
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //出档，归档
    archiveBatch(url, action) {
      //只需要ids和status参数的批量操作
      this.loading = true
      let statusArr = this.status.split(',')
      let mark = true

      if (action == 'archive') {
        //归档
        for (let key in statusArr) {
          if (statusArr[key] != '2') {
            //如果内容状态不是审核通过
            this.errorMessage('只有审核通过的内容才能归档')
            mark = false
            this.loading = false
            return true
          }
        }
      } else if (action == 'document') {
        //出档
        for (let key in statusArr) {
          if (statusArr[key] != '5') {
            //如果内容状态不是审核通过
            this.errorMessage('只有归档的内容才能出档')
            mark = false
            this.loading = false
            return true
          }
        }
      }
      if (mark) {
        axios
          .post(url, { ids: this.ids })
          .then(res => {
            this.loading = false
            if (res.code == '200') {
              this.successMessage('操作成功')
            } //else if(res.code == "362"){
            //   this.errorMessage("部分内容审核失败");
            // }
            this.getTableData(this.params)
            this.getAllTotal()
          })
          .catch(error => {
            this.loading = false
          })
      }
    },
    batch(url) {
      //只需要ids参数的批量操作
      this.loading = true;
      axios
        .post(url, { ids: this.ids })
        .then(res => {
          this.loading = false;
          if (res.code == "200") {
            this.successMessage("操作成功"), this.getTableData(this.params);
            this.getAllTotal();
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getPushSite(arr) {
      var ids = [];
       for (var i in arr) {
                ids.push(arr[i].id);
            }
      this.pushSites = ids.join(",");
    },
    pushSite() {
      let params = {
        ids: this.ids,
        channelIds: this.pushSites
      };
      this.siteVisble = false;
      this.loading = true;
      axios
        .post(this.$api.contentPush, params)
        .then(res => {
          this.loading = false;
          if (res.code == "200") {
            this.successMessage("推送成功");
          }
        })
        .catch(err => {
          this.siteVisble = false;
        });
    },
    sendWeiXin(url, ids) {
      axios.post(url, { ids: ids }).then(res => {
        if (res.code == "200") {
          this.successMessage(res.message);
        }
      });
    },
	reject() {
      //退回操作
      this.loading = true
      let statusArr = this.status.split(',')
      let mark = true
        for (let key in statusArr) {
          if (statusArr[key] != '1'||statusArr[key] != '2'||statusArr[key] != '4') {
            //如果内容状态不是审核通过
            this.errorMessage('只有审核通过、审核中、投稿状态的内容才能退回')
            mark = false
            this.loading = false
            return true
          }
        }
      if (mark) {
        this.$prompt('请输入退回原因', '提示', {
        })
          .then(({ value }) => {
            axios
              .post(this.$api.contentReject, { ids: this.ids, rejectOpinion: value })
              .then(res => {
                if (res.code == '200') {
                  this.successMessage('退回成功')
                  this.getTableData(this.params)
                  this.getAllTotal()
                }
              })
          })
          .catch(() => {})
          }
      },
    recommend(state) {
      //推荐操作
      if (state) {
        this.$prompt("请输入推荐等级", "提示", {
          inputPattern: /^[0-9]+$/,
          inputErrorMessage: "请输入正整数"
        })
          .then(({ value }) => {
            axios
              .post(this.$api.contentRecommend, { ids: this.ids, level: value })
              .then(res => {
                if (res.code == "200") {
                  this.successMessage("推荐成功");
                  this.getTableData(this.params);
                  this.getAllTotal();
                }
              });
          })
          .catch(() => {});
      } else {
        axios
          .post(this.$api.contentRecommend, { ids: this.ids, level: -1 })
          .then(res => {
            if (res.code == "200") {
              this.successMessage("取消推荐成功");
              this.getTableData(this.params);
              this.getAllTotal();
            }
          });
      }
    },
    operate(type) {
      //复制及引用打开dialog触发事件
      this.channelVisble = true;
      this.operateType = type;
      this.labelDialogTitle = "选择栏目(" + this.$getSiteName() + ")";
    },
    topicClick() {
      //专题弹窗触发
      axios.post(this.$api.topicListAll).then(res => {
        if (res.code == "200") {
          this.topicVisble = true;
          this.labelDialogTitle = "选择专题(" + this.$getSiteName() + ")";
          this.topicList = res.body;
        }
      });
    },
    //栏目dialog节点选中事件，处理checkbox 只能选择一个
    checkChange(node, checkStatus, childStatus) {
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
        this.$refs["channelTree"].setCheckedKeys([node.id], true);
      }
    },
    ansyTree(node, resolve) {
      //异步加载栏目树形结构
      if (node.level === 0) {
        return resolve([
          {
            name: "根目录",
            id: "",
            isChild: true
          }
        ]);
      }
      if (node.level > 0) {
        axios
          .post(this.$api.channelList, { parentId: node.data.id })
          .then(res => {
            const data = [];
            for (let i in res.body) {
              let obj = {};
              obj.id = res.body[i].id;
              obj.isChild = res.body[i].childCount > 0 ? false : true;
              obj.name = res.body[i].name;
              data.push(obj);
            }
            return resolve(data);
          });
      }
    },
    //栏目dialog取消按钮操作
    cancel() {
      this.channelVisble = false;
      this.$refs['channelTree'].setCheckedKeys([]);
    },
    //栏目dialog确认按钮操作
    confirm() {
      let url = "";
      let params = {}; //请求api参数对象
      params.channelId = this.currentCheckChannelId;
      params.ids = this.ids;
      if (this.operateType == "move") {
        url = this.$api.contentMove;
      } else if (this.operateType == "copy") {
        url = this.$api.contentCopy;
        params.siteId = this.$getSiteId();
      } else {
        return false;
      }
      this.loading = true;
      axios
        .post(url, params)
        .then(res => {
          if (res.code == "200") {
            this.loading = false;
            this.channelVisble = false;
            this.$refs['channelTree'].setCheckedKeys([]);
            this.successMessage("操作成功");
            this.getTableData(this.params);
            this.getAllTotal();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
     handleClose(done) {
       done();
        },
    topicCancel(){
      // for (let key in this.topicList) {
      //   this.$set(this.checked, key, [])
      // }
      this.topicVisble = false;
    },

    handleChange() {
        this.$emit('change', this.checked)
      },
    confirmTopic() {
      let params = {
        ids: this.ids,
        topicIds: this.topicIds.join(",")
      };
      this.loading = true;
      axios
        .post(this.$api.contentSend, params)
        .then(res => {
          if (res.code == "200") {
            this.topicVisble = false;
            this.loading = false;
            this.successMessage("操作成功");
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    prioritysBatch(url) {
      //保存置顶
      let params = {
        ids: this.ids,
        topLevel: []
      };
      for (let i in this.checkedList) {
        params.topLevel.push(this.checkedList[i].topLevel);
        // params.topLevel.push(1);
      }
      params.topLevel = params.topLevel.join(",");
      axios.post(url, params).then(res => {
        if (res.code == "200") {
          this.successMessage("操作成功"), this.getTableData(this.params);
          this.getAllTotal();
        }
      });
    },
    getChannelId(data, node) {
      //获取栏目树点击
      this.creatBread(node, []);
      this.params.cid = data.id; //传递栏目id
      this.getChannelInfo(data.id); //获取栏目信息
      this.getTableData(this.params); //获取内容信息
      this.getAllTotal();
    },
    getChannelInfo(channelId) {
      //获取模型信息
      let modelList = [];
      axios
        .post(this.$api.modelList, { containDisabled: false, hasContent: true })
        .then(res => {
          if (res.code == "200") {
            modelList = res.body; //获取模型
          }
          if (channelId != "" && channelId != undefined) {
            axios
              .post(this.$api.channelGet, {
                id: channelId,
                showTxt: false
              })
              .then(res => {
                     if(res.body.selfModels.length>0){
                        this.modelList = res.body.models; //获取模型
                     }
                     else{
                       this.modelList = modelList;
                     }
              });
          } else {
            this.modelList = modelList;
          }
        });
    },
    getTypeList() {
      //获取类型列表
      axios
        .post(this.$api.typeList, {
          containDisabled: false
        })
        .then(res => {
          if (res.code == "200") {
            this.typeList = res.body;
          }
        });
    },
    clickBread(id, index) {
      //面包屑
    },
    creatBread(node, arr) {
      if (node.parent != null) {
        let params = {
          name: node.data.name,
          id: node.data.id
        };
        arr.push(params);
        this.creatBread(node.parent, arr);
      } else {
        this.breadItems = arr.reverse();
        return false;
      }
    },
    getAllTotal() {
      //获取分页
      axios.post(this.$api.contentPage, this.params).then(res => {
        if (res.code == 200) {
          this.allTotal = res.body.totalCount;
        }
      });
    },
    query() {
      //查询
      this.getTableData(this.params);
      this.getAllTotal();
    }
  },
  mounted() {
    let clientHeight = document.body.clientHeight;
    $(".cms-body").css("minHeight", clientHeight - 110 + "px");
  },
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    if (this.$route.query.type == "list") {
      if (this.$route.query.id == 0) {
        this.params.cid = "";
      } else {
        this.params.cid = this.$route.query.id;
      }
    }
    this.initTableData(this.$api.contentList, this.params); //请求列表
    this.getAllTotal(); //分页
    this.getChannelInfo(); //模型列表
    this.getTypeList(); //内容类型
    axios.post(this.$api.getSteps).then(res => {
      this.stepList = res.body;
      this.rejectParams.rejectOpinion = res.body[this.stepList.length - 1];
    });
  }
};
</script>

<style >
.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}
.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}
.tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}
/* .iconfont{
    color: #409EFF;
  } */

.red-color {
  color: red;
}
</style>
