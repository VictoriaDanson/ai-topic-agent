// 替换模拟热点为真实API
const axios = require('axios')

// 真实财经热点获取
async function getRealFinanceHotTopics() {
  try {
    // 新浪财经热点API
    const response = await axios.get(
      'http://top.finance.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=finance_0_suda&top_time=20260324&top_show_num=20&top_order=DESC&js_var=all_1_data&get_new=1',
      {}
    )
    const str = response.data
    // 1. 去掉前面的 var 赋值和末尾分号，只保留 JSON 部分
    const jsonStr = str.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '')
    // 2. 安全解析为对象
    const allData = JSON.parse(jsonStr).data
    // 转换完成！
    hotTopics = allData.map((v) => v.title)
    // 简单解析（实际项目可用cheerio库解析）
    // const html = response.data
    // const hotTopics = []
    // // 匹配标题（简易正则）
    // const titleRegex = /<a href=".*?" target="_blank">(.*?)<\/a>/g
    // let match
    // let count = 0
    // while ((match = titleRegex.exec(html)) && count < 5) {
    //   const title = match[1].replace(/<.*?>/g, '').trim()
    //   if (title && title.length > 5) {
    //     hotTopics.push(title)
    //     count++
    //   }
    // }
    console.log('hotTopics===', hotTopics)
    return hotTopics.length > 0 ? hotTopics : ['暂无实时热点']
  } catch (error) {
    console.error('获取财经热点失败:', error.message)
    return ['获取热点失败，使用默认热点：A股震荡整理，资金面保持宽松']
  }
}

// 自定义工具函数
const tools = {
  // 获取当前日期
  getCurrentDate: () => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long'
    })
  },

  // 模拟获取财经热点
  getFinanceHotTopics: getRealFinanceHotTopics
  // () => {
  //   // 实际项目中替换为真实API调用
  //   return [
  //     '央行逆回购操作加码，市场流动性宽松',
  //     'A股三大指数震荡，新能源板块领涨',
  //     '北向资金单日净流入超50亿',
  //     'LPR利率维持不变，房贷利率暂未调整'
  //   ];
  // }
}

// 工具描述（给AI看）
const toolDescriptions = [
  {
    name: 'getCurrentDate',
    description: '获取当前日期和星期，用于生成时效性选题',
    parameters: []
  },
  {
    name: 'getFinanceHotTopics',
    description: '获取最新财经热点列表，用于生成热门选题',
    parameters: []
  }
]

module.exports = { tools, toolDescriptions }
