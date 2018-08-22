// pages/CountDown/CountDown.js
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
    var _app=getApp();
    var that=this
  
    console.log(_app.globalData.openGid)
    console.log(_app.globalData.userId)

    wx.request({
      url: _app.globalData.urlstr + '/api/train/getNotStartData',
      data: {
        user_id: _app.globalData.userId,
        open_gid: _app.globalData.openGid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var arr=res.data.data.foot_time.split('-')
        console.log(arr)
        that.setData({
          datas:res.data.data,
          days:arr
        })
        var nums=''
        var san=that.data.datas.content;
        var index1=san.indexOf('始');
        var index2=san.indexOf('天')
        nums=san.slice(index1+1,index2)
        console.log(nums)
        if(nums==1){
          wx:wx.navigateTo({
            url: '../Military/Military'
          })
        }        
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