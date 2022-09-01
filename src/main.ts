import { createApp } from 'vue'
import App from './App.vue'

// 引入element-ui组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn' // 中文
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文

// 创建Vue3实例
const app = createApp(App)
// 使用Element UI Plus
app.use(ElementPlus, { locale })
// 挂载到根组件上
app.mount('#app')
