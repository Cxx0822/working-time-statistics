<template>
  <div class="app-div">
    <div class="title-div">
      <h1>公司工时统计系统</h1>
    </div>

    <div class="workTime-div">
      <div class="workTime-table">
        <el-table
          :data="workingTimeInfo.workTime"
          border
          style="width: 1100px"
          @cell-dblclick="tabClick"
          :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName"
        >
          <el-table-column align="center" label="序号" width="100">
            <template #default="scope">
              {{ scope.row.index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="id" align="center" label="工号" width="200" />
          <el-table-column prop="name" align="center" label="姓名" width="200" />
          <el-table-column prop="date" align="center" label="日期" width="200" />
          <el-table-column align="center" label="上班时间" width="200">
            <template #default="scope">
              <div v-if="scope.row.index === workingTimeInfo.clickRow && scope.column.index === workingTimeInfo.clickCell">
                <el-input
                  v-model="scope.row.startTime"
                  maxlength="300"
                  size="small"
                  @keyup.enter="updateData"
                  @blur="updateData"
                />
              </div>
              <div v-else>{{ scope.row.startTime }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下班时间" width="200" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.index === workingTimeInfo.clickRow && scope.column.index === workingTimeInfo.clickCell">
                <el-input
                  v-model="scope.row.endTime"
                  maxlength="300"
                  size="small"
                  @keyup.enter="updateData"
                  @blur="updateData"
                />
              </div>
              <div v-else>{{ scope.row.endTime }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="workTime-use">
        <div class="function">
          <h1>功能模块</h1>
          <el-button type="primary" @click="readFile">读取文件</el-button>

          <input
            v-if="workingTimeInfo.isShowUpLoadFile"
            id="upLoadFile"
            ref="upLoadFileRef"
            type="file"
            accept=".txt"
            style="display: none"
            @change="getWorkTimeData"
          >

          <el-button type="primary" @click="calWorkTime" style="margin-left: 10px;">计算工时</el-button>
        </div>

        <div class="info">
          <h1>工时统计</h1>
          当月工作时长：{{ workingTimeInfo.workTime.length }} 天
          <br>
          总工时：{{ workingTimeInfo.totalWorkTime}} 时
          <br>
          日平均工时： {{ workingTimeInfo.dailyWorkTime }} 时
          <br>
        </div>

        <div class="guide">
          <h1 style="text-align: center">使用说明</h1>
          <div style="margin-left: 10px;">
            <h5>1.在OA系统中，将需要计算的工时复制到txt文本中；(参考src/assets/test.txt格式)</h5>
            <h5>2.点击读取文件按钮，打开工时文件；</h5>
            <h5>3.将有上下班未打卡的时间补充完整(双击单元格更改)；</h5>
            <h5>4.点击计算工时按钮，查看工时统计信息。</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const upLoadFileRef = ref()

interface WorkTimeIt {
  index: number,
  id: string,
  name: string,
  date: string,
  startTime: string,
  endTime: string
}

const workingTimeInfo = reactive({
  isShowUpLoadFile: true,
  workTime: [] as Array<WorkTimeIt>,
  clickRow: 0, // 当前点击的行
  clickCell: 0, // 当前点击的列
  tabClickLabel: '', // 当前点击的列名
  totalWorkTime: '0',
  dailyWorkTime: '0'
})

// 读取文件
const readFile = () => {
  workingTimeInfo.isShowUpLoadFile = true
  // 确保模板加载完毕再执行
  nextTick(() => {
    upLoadFileRef.value.click()
  })
}

// 读取blockly代码
const getWorkTimeData = () => {
  if (window.FileReader) {
    // 获取读取的文件File对象
    const file = upLoadFileRef.value.files[0]

    // 判断是否是txt文件
    if (file.name.split('.').slice(-1)[0] === 'txt') {
      var reader = new FileReader()

      // 文件读取成功完成时触发
      reader.onload = (event:any) => {
        try {
          // 清空表格数据
          workingTimeInfo.workTime.splice(0)
          // 读取工时统计文件中的每行数据
          const workTimeRawDataList = event.target.result.split('\n')

          for (let i = 0; i < workTimeRawDataList.length; i++) {
            if (workTimeRawDataList[i] !== '') {
              // 读取工时统计文件中每行中的每列数据
              // 并添加至表格数据中
              const workTimeRawItemDataList = workTimeRawDataList[i].split('\t')
              workingTimeInfo.workTime.push({
                index: i,
                id: workTimeRawItemDataList[1],
                name: workTimeRawItemDataList[2],
                date: workTimeRawItemDataList[3],
                startTime: workTimeRawItemDataList[4],
                endTime: workTimeRawItemDataList[5]
              })
            }
          }
          workingTimeInfo.isShowUpLoadFile = false
        } catch (error) {
          ElMessage.error('无法正确解析该txt文件')
        }
      }
      // 将文件读取为文本
      reader.readAsText(file)
    } else {
      ElMessage.error('请选择正确的txt文件')
    }
  } else {
    ElMessage.error('该浏览器不支持文件读取 请更改浏览器 推荐使用谷歌浏览器')
  }
}

const calWorkTime = () => {
  if (workingTimeInfo.workTime.length === 0) {
    ElMessage.error('请先读取工时文件！')
    return
  }

  let totalWorkTime = 0

  for (let i = 0; i < workingTimeInfo.workTime.length; i++) {
    if (workingTimeInfo.workTime[i].startTime === ' ' || workingTimeInfo.workTime[i].endTime === ' ') {
      ElMessage.error('第' + (i + 1).toString() + '列有未完成的上下班打卡 请先双击表格填写完整！')
      return
    } else {
      const startTime = new Date(workingTimeInfo.workTime[i].date + ' ' + workingTimeInfo.workTime[i].startTime)
      if (startTime.getHours() <= 8 && startTime.getMinutes() <= 30) {
        workingTimeInfo.workTime[i].startTime = '08:30:00'
      }

      const dailyWorkTime = Date.parse(workingTimeInfo.workTime[i].date + ' ' + workingTimeInfo.workTime[i].endTime) -
        Date.parse(workingTimeInfo.workTime[i].date + ' ' + workingTimeInfo.workTime[i].startTime)

      if (dailyWorkTime > 0) {
        // 转换为分钟并求和
        totalWorkTime += dailyWorkTime / 1000 / 60
      } else {
        ElMessage.error('第' + (i + 1).toString() + '列数据打卡时间异常！请确定下班时间大于上班时间！')
        return
      }
    }
  }

  workingTimeInfo.totalWorkTime = (totalWorkTime / 60).toFixed(2)
  workingTimeInfo.dailyWorkTime = (totalWorkTime / 60 / workingTimeInfo.workTime.length).toFixed(2)
}

// 控制input显示 row 当前行 column 当前列
const tabClick = (row:WorkTimeIt, column:TableColumnCtx<WorkTimeIt>) => {
  if (column.label === '上班时间' || column.label === '下班时间') {
    workingTimeInfo.clickRow = row.index
    workingTimeInfo.clickCell = column.index as number
    workingTimeInfo.tabClickLabel = column.label
  }
}

const tableRowClassName = ({ row, rowIndex }: {row: WorkTimeIt, rowIndex: number}) => {
  row.index = rowIndex
}

// 把每一列的索引放进column
const tableCellClassName = ({ column, columnIndex }: {column: WorkTimeIt, columnIndex: number}) => {
  column.index = columnIndex
}

// 更新数据
const updateData = () => {
  workingTimeInfo.clickRow = 0
  workingTimeInfo.clickCell = 0
  workingTimeInfo.tabClickLabel = ''
}
</script>

<style lang="scss">
.app-div {
  .title-div {
    text-align: center
  }

  .workTime-div {
    margin-top: 50px;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;

    .workTime-table {
      border: 2px solid #008B93;
    }

    .workTime-use {
      height: 520px;
      width: 520px;
      margin-left: 10px;
      border: 2px solid #008B93;

      .function {
        text-align: center
      }

      .info {
        text-align: center
      }

    }
  }
}

</style>
