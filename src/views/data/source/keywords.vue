<template>
  <section class="cms-body cms-chart-box">
    <div class="cms-list-header" style="padding-left:0">
      <h5 class="data-header-title">搜索词({{time}})</h5>
      <div class="flex-date">
        <label class="cms-label" style="margin-left:0">日期：</label>
        <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="-1">昨天</el-radio-button>
          <el-radio-button :label="-7">最近7天</el-radio-button>
          <el-radio-button :label="-30">最近30天</el-radio-button>
        </el-radio-group>
        <el-date-picker v-model="dateArr" value-format="yyyy/MM/dd" :editable='false' @change="rangeTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>

    </div>
    <el-table :data="tableData" border height="400" style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="搜索词">
      </el-table-column>
      <el-table-column prop="pv_count" label="浏览量（PV）">
      </el-table-column>
      <el-table-column prop="visitor_count" label="访客数（UV）">
      </el-table-column>
      <el-table-column prop="ip_count" label="IP数">
      </el-table-column>
      <el-table-column prop="bounce_ratio" label="跳出率">
      </el-table-column>
      <el-table-column prop="avg_visit_time" label="平均访问时长">
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import axios from 'axios'
import listMixins from '@/mixins/list'
export default {
  mixins: [listMixins],
  data() {
    return {
      dateArr: '',
      params: {
        flag:0,
        start_date: '',
        end_date: ''
      },
      time: '',
    }
  },
  methods: {
    rangeTime(val) {
      //格式化时间
      if (val != null) {
        this.params.start_date = val[0]
        this.params.end_date = val[1]
        if (val[0] === val[1]) {
          this.time = val[0]
        } else {
          this.time = val[0] + ' - ' + val[1]
        }
      } else {
        this.params.start_date = ''
        this.params.end_date = ''
      }
      this.getDataInfo()
    },
    query(val) {
      this.time = new Date().getDateSpan(val)
      this.params.start_date = this.time
      this.getDataInfo()
    },
    getDataInfo() {
      this.params.method = 'source/searchword/a'
      this.params.metrics =
        'pv_count,visitor_count,ip_count,bounce_ratio,avg_visit_time'
      axios
        .post(this.$api.flowSearchWordList, this.params)
        .then(res => {
          let base = res.body.items
          base[1].unshift(res.body.sum[0]) //加上统计行
          let source = []
          source.push('合计') //合计行
          for (let item of base[0]) {
            source.push(item[0]['name'])
          }
          let count = 0
          let detail = []
          for (let item of base[1]) {
            let tojson = {}
            tojson['name'] = source[count]
            tojson['pv_count'] = item[0]
            tojson['visitor_count'] = item[1]
            tojson['ip_count'] = item[2]
            tojson['bounce_ratio'] = item[3] + '%'
            tojson['avg_visit_time'] = new Date().timeFormat(item[4])
            count = count + 1
            detail.push(tojson)
          }
          this.tableData = detail
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
    this.params.start_date = this.params.end_date = this.time = new Date().toLocaleDateString();
    this.getDataInfo()
  }
}
</script>

<style scoped lang='scss'>
.data-item {
  float: left;
  min-width: 170px;
  margin-top: 30px;
  .data-title {
    font-size: 12px;
    color: #878d99;
    margin-bottom: 17px;
  }
  .data-num {
    color: #353535;
    font-size: 24px;
  }
}
.chart-style {
  width: 100%;
  height: 380px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 15px;
}
</style>
