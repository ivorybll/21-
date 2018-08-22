// pages/paperLists/paperLists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this; 
   var _app=getApp()
   console.log(options.id)
   //试题
    wx.request({
      url: 'http://test.tiku.hqclass.cn/paperLists',
      data: {
        id:options.id
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          datas:res.data.data,
          topic:options.id
        })
 
      }
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})