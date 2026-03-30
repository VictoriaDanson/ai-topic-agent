// 多源金融API封装
class FinanceAPIs {
  // 新浪财经热点
  static async getSinaHotTopics() {
    try {
      // 新浪财经热点API
      const response = await fetch(
        'http://top.finance.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=finance_0_suda&top_time=20260324&top_show_num=20&top_order=DESC&js_var=all_1_data&get_new=1'
      )
      const str = await response.text()
      // 1. 去掉前面的 var 赋值和末尾分号，只保留 JSON 部分
      const jsonStr = str.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '')
      // 2. 安全解析为对象
      const allData = JSON.parse(jsonStr).data
      const hotTopics = allData.map((v) => v.title)
      return hotTopics.length > 0 ? hotTopics : ['暂无实时热点']
    } catch (error) {
      console.error('获取财经热点失败:', error.message)
      return ['获取热点失败，使用默认热点：A股震荡整理，资金面保持宽松']
    }
  }

  // 东方财富行情
  static async getEastMoneyMarket() {
    try {
      const url =
        'https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&np=1&fltt=2&invt=2&fs=bk:1000165&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18'
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      const json = await response.json()
      const stocks = (json && json.data && json.data.diff) || []
      return stocks.map(
        (stock) =>
          `${stock.f14}（${stock.f2}）：${stock.f3 > 0 ? '+' : ''}${stock.f3}%`
      )
    } catch (error) {
      console.error('东方财富API失败:', error.message)
      return ['获取行情失败']
    }
  }

  // 央行政策
  static async getPBOCNews() {
    try {
      const response = await fetch(
        'http://www.pbc.gov.cn/goutongjiaoliu/113456/113469/index.html',
        {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }
      )
      // 简易解析
      const html = await response.text()
      const regex = /<a href=".*?" target="_blank">(.*?)<\/a>/g
      const news = []
      let match

      while ((match = regex.exec(html)) && news.length < 5) {
        const title = match[1].replace(/<.*?>/g, '').trim()
        if (title && title.length > 10) news.push(title)
      }

      return news.length > 0 ? news : ['暂无最新央行政策']
    } catch (error) {
      console.error('央行API失败:', error.message)
      return ['获取央行政策失败']
    }
  }

  // 聚合所有热点
  static async getAllHotTopics() {
    const [sina, eastMoney, pboc] = await Promise.all([
      this.getSinaHotTopics(),
      this.getEastMoneyMarket(),
      this.getPBOCNews()
    ])
    return {
      财经热点: sina,
      金融板块行情: eastMoney,
      央行政策: pboc
    }
  }
}

module.exports = FinanceAPIs
