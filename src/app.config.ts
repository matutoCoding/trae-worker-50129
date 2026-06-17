export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/queue/index',
    'pages/trade/index',
    'pages/market/index',
    'pages/weighing/index',
    'pages/bidding/index',
    'pages/coldchain/index',
    'pages/settlement/index',
    'pages/register/index',
    'pages/inspection/index',
    'pages/debt/index',
    'pages/transactions/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0077B6',
    navigationBarTitleText: '渔港渔获交易',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F0F8FF'
  },
  tabBar: {
    color: '#8AA5B3',
    selectedColor: '#0077B6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/queue/index',
        text: '靠港排队'
      },
      {
        pagePath: 'pages/trade/index',
        text: '交易中心'
      },
      {
        pagePath: 'pages/market/index',
        text: '行情结算'
      }
    ]
  }
})
