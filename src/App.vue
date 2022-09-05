<template>
  <div class="app-div">
    <div class="title-div">
      <h1>公司工时统计系统</h1>
    </div>

    <div class="workTime-div">
      <el-row>
        <el-col :span="18">
          <div class="workTime-table">
            <el-table
              :data="workingTimeInfo.workTime"
              border
              stripe
              @cell-dblclick="tabClick"
              :row-class-name="tableRowClassName"
              :cell-class-name="tableCellClassName"
              style="width: 100%"
            >
              <el-table-column align="center" label="序号" width="65">
                <template #default="scope">
                  {{ scope.row.index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="id" align="center" label="工号" width="200" />
              <el-table-column prop="name" align="center" label="姓名" width="200" />
              <el-table-column align="center" label="日期" width="200">
                <template #default="scope">
                  <div v-if="scope.row.index === workingTimeInfo.clickRow && scope.column.index === workingTimeInfo.clickCell">
                    <el-input
                      ref="dateRef"
                      v-model="scope.row.date"
                      maxlength="300"
                      size="small"
                      @keyup.enter="updateData"
                      @blur="updateData"
                    />
                  </div>
                  <div v-else>{{ scope.row.date }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上班时间" width="200">
                <template #default="scope">
                  <div v-if="scope.row.index === workingTimeInfo.clickRow && scope.column.index === workingTimeInfo.clickCell">
                    <el-input
                      ref="startTimeRef"
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
                      ref="endTimeRef"
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

            <el-upload
              v-show="workingTimeInfo.workTime.length === 0"
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
              :on-change="handleChange"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <h3>将文件拖拽到此处或点击图标上传文件</h3>
              </div>
              <template #tip>
                <div class="el-upload__tip" style="text-align: center;">
                  <h3>请上传文本文件！</h3>
                </div>
              </template>
            </el-upload>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="workTime-use">
            <div class="function">
              <h1>功能模块</h1>
              <el-tooltip  class="box-item"  effect="dark" content="重新读取文本" placement="top">
                <el-button type="primary" :icon="UploadFilled" circle @click="resumeWorkTimeData()"/>
              </el-tooltip>

              <el-tooltip  class="box-item"  effect="dark" content="保存本地数据" placement="top">
                <el-button type="primary" :icon="FolderChecked" circle @click="saveWorkTimeFromLocal()"/>
              </el-tooltip>

              <el-tooltip  class="box-item"  effect="dark" content="读取本地数据" placement="top">
                <el-button type="primary" :icon="FolderOpened" circle @click="readWorkTimeFromLocal()"/>
              </el-tooltip>

              <el-tooltip  class="box-item"  effect="dark" content="增加一行数据" placement="top">
                <el-button type="primary" :icon="Plus" circle @click="addWorkTimeData()"/>
              </el-tooltip>

              <el-tooltip  class="box-item"  effect="dark" content="减少一行数据" placement="top">
                <el-button type="primary" :icon="Minus" circle @click="minusWorkTimeData()"/>
              </el-tooltip>

              <el-tooltip  class="box-item"  effect="dark" content="计算工时" placement="top">
                <el-button type="primary" :icon="HelpFilled" circle @click="calWorkTime()"/>
              </el-tooltip>
            </div>

            <div class="info">
              <h1>工时统计</h1>
              当月工作时长：<span>{{ workingTimeInfo.workTime.length }}</span> 天
              <br>
              总工时：<span>{{ workingTimeInfo.totalWorkTime}}</span> 时
              <br>
              日平均工时： <span>{{ workingTimeInfo.dailyWorkTime }}</span> 时
              <br>
            </div>

            <div class="info" v-if="workingTimeInfo.isCalWorkTime">
              <h3 v-if="parseFloat(workingTimeInfo.dailyWorkTime) >= 8.5" style="color: green;">您的工时已达到公司要求 请再接再厉！</h3>
              <h3 v-else style="color: red;">您的工时未达到公司要求 请及时调整！</h3>
            </div>

            <div class="guide">
              <h1 style="text-align: center">使用说明</h1>
              <div style="margin-left: 10px;">
                <h5>1.在OA系统中，将需要计算的工时复制到txt文本中；(参考src/assets/test.txt格式)</h5>
                <h5>2.点击表格区域的上传文件按钮打开工时文件，或将工时文件拖拽至目标区域；</h5>
                <h5>3.将有上下班未打卡的时间补充完整(双击单元格更改)；</h5>
                <h5>4.点击计算工时按钮，查看工时统计信息。</h5>
                <h5>
                  <el-link href="https://github.com/Cxx0822/working-time-statistics" target="_blank" type="primary">Github地址</el-link>
                </h5>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { UploadFilled, FolderChecked, FolderOpened, Plus, Minus, HelpFilled } from '@element-plus/icons-vue'
import type { UploadProps, UploadFile } from 'element-plus'

const dateRef = ref()
const startTimeRef = ref()
const endTimeRef = ref()

interface WorkTimeIt {
  index: number,
  id: string,
  name: string,
  date: string,
  startTime: string,
  endTime: string
}

const workingTimeInfo = reactive({
  workTime: [] as Array<WorkTimeIt>,
  clickRow: 0, // 当前点击的行
  clickCell: 0, // 当前点击的列
  tabClickLabel: '', // 当前点击的列名
  totalWorkTime: '0',
  dailyWorkTime: '0',
  isCalWorkTime: false
})

let saveWorkTimeData = ''

// 处理上传文件功能
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  if (uploadFile.name.split('.').slice(-1)[0] === 'txt') {
    if (window.FileReader) {
      // 获取读取的文件File对象
      var reader = new FileReader()

      // 文件读取成功完成时触发
      reader.onload = (event:any) => {
        // 清空表格数据
        workingTimeInfo.workTime.splice(0)
        // 读取工时统计文件中的每行数据
        const workTimeRawDataList = event.target.result.split('\n')
        readWordTimeData(workTimeRawDataList)
      }
      // 将文件读取为文本
      reader.readAsText(uploadFile.raw as File)
    } else {
      ElMessage.error('该浏览器不支持文件读取 请更改浏览器 推荐使用谷歌浏览器')
    }
  } else {
    ElMessage.error('请选择正确的txt文件')
  }
}

// 解析工时统计数据
const readWordTimeData = (workTimeRawDataList:Array<string>) => {
  try {
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
    ElMessage.success('读取数据成功！')
  } catch (error) {
    ElMessage.error('无法正确解析该txt文件')
  }
}

// 重新读取数据
const resumeWorkTimeData = () => {
  workingTimeInfo.workTime.splice(0)
  workingTimeInfo.totalWorkTime = '0'
  workingTimeInfo.dailyWorkTime = '0'
  workingTimeInfo.isCalWorkTime = false
}

// 增加工时数据
const addWorkTimeData = () => {
  if (workingTimeInfo.workTime.length !== 0 &&
    (workingTimeInfo.workTime[workingTimeInfo.workTime.length - 1].startTime === '' ||
    workingTimeInfo.workTime[workingTimeInfo.workTime.length - 1].endTime === '')) {
    ElMessage.error('有未完成的上下班打卡！')
    return
  }

  const date = new Date()

  workingTimeInfo.workTime.push(
    {
      index: workingTimeInfo.workTime.length + 1,
      id: '',
      name: '',
      date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      startTime: '',
      endTime: ''
    }
  )

  workingTimeInfo.clickRow = workingTimeInfo.workTime.length - 1
  workingTimeInfo.clickCell = 3

  nextTick(() => {
    dateRef.value.input.focus()
  })
}

// 减少工时数据
const minusWorkTimeData = () => {
  if (workingTimeInfo.workTime.length === 0) {
    ElMessage.error('没有工时数据！')
    return
  }
  workingTimeInfo.workTime.pop()
  ElMessage.success('减少最后一个数据成功！')
}

// 计算工时
const calWorkTime = () => {
  if (workingTimeInfo.workTime.length === 0) {
    ElMessage.error('没有工时数据！')
    return
  }

  let totalWorkTime = 0

  for (let i = 0; i < workingTimeInfo.workTime.length; i++) {
    // 判断是否有未完成的上下班打卡
    if (workingTimeInfo.workTime[i].startTime === ' ') {
      ElMessage.error('第' + (i + 1).toString() + '列有未完成的上班打卡 请先双击表格填写完整！')
      workingTimeInfo.clickRow = i
      workingTimeInfo.clickCell = 4
      workingTimeInfo.workTime[i].startTime = '08:30:00'
      nextTick(() => {
        startTimeRef.value.input.focus()
      })
      return
    } else if (workingTimeInfo.workTime[i].endTime === ' ') {
      ElMessage.error('第' + (i + 1).toString() + '列有未完成的下班打卡 请先双击表格填写完整！')
      workingTimeInfo.clickRow = i
      workingTimeInfo.clickCell = 5
      workingTimeInfo.workTime[i].endTime = '17:00:00'
      nextTick(() => {
        endTimeRef.value.input.focus()
      })
      return
    } else {
      const startTime = new Date(workingTimeInfo.workTime[i].date + ' ' + workingTimeInfo.workTime[i].startTime)
      // 判断是否有上班打卡时间小于8：30
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
  workingTimeInfo.isCalWorkTime = true
}

// 控制input显示 row 当前行 column 当前列
const tabClick = (row:WorkTimeIt, column:TableColumnCtx<WorkTimeIt>) => {
  if (column.label === '日期' || column.label === '上班时间' || column.label === '下班时间') {
    const date = new Date()
    switch (column.label) {
      case '日期':
        if (workingTimeInfo.workTime[row.index].date.trim() === '') {
          workingTimeInfo.workTime[row.index].date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
        break
      case '上班时间':
        if (workingTimeInfo.workTime[row.index].startTime.trim() === '') {
          workingTimeInfo.workTime[row.index].startTime = '08:30:00'
        }
        break
      case '下班时间':
        if (workingTimeInfo.workTime[row.index].endTime.trim() === '') {
          workingTimeInfo.workTime[row.index].endTime = '17:00:00'
        }
        break
      default:
        break
    }

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

const saveWorkTimeFromLocal = () => {
  saveWorkTimeData = ''

  if (workingTimeInfo.workTime.length === 0) {
    ElMessage.error('没有工时数据！')
    return
  }
  for (let i = 0; i < workingTimeInfo.workTime.length; i++) {
    saveWorkTimeData += workingTimeInfo.workTime[i].index + '\t' + workingTimeInfo.workTime[i].id + '\t' +
    workingTimeInfo.workTime[i].name + '\t' + workingTimeInfo.workTime[i].date + '\t' + workingTimeInfo.workTime[i].startTime + '\t' +
    workingTimeInfo.workTime[i].endTime + '\n'
  }
  localStorage.setItem('workTimeData', saveWorkTimeData)
  ElMessage.success('保存数据成功！')
}

const readWorkTimeFromLocal = () => {
  workingTimeInfo.workTime.splice(0)

  if (localStorage.getItem('workTimeData') === null) {
    ElMessage.error('没有工时数据！')
    return
  }

  const workTimeData = localStorage.getItem('workTimeData') as string
  const workTimeRawDataList = workTimeData.split('\n')
  readWordTimeData(workTimeRawDataList)
}
</script>

<style lang="scss">
.app-div {
  .title-div {
    text-align: center
  }

  .workTime-div {
    margin-top: 30px;

    .workTime-table {
      border: 2px solid #008B93;
    }

    .workTime-use {
      // height: 550px;
      margin-left: 10px;
      border: 2px solid #008B93;

      .function {
        text-align: center;
      }

      .info {
        text-align: center;

        span {
          font-size: 24px;
          font-weight: bold;
        }
      }

    }
  }
}
</style>
