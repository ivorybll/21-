// pages/phase/phase.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num1:'',
    num2:'',
    days:'',
    textnum:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp =new Date()
    var year = timestamp.getFullYear()
    console.log(options)
    var that=this
    var textnum=''
    console.log(JSON.parse(options.stageS))
    switch(Math.floor(options.phase)){
      case 1:
      textnum='一';
      break;
      case 2:
      textnum='二';
      break;
      case 3:
      textnum='三';
      break;
      default:
      return; 
    }

    this.setData({
      textnum:textnum,
      num1:Math.floor(options.phase),
      num2:Math.floor(options.phase)+1,
      days:options.days.split(','),
      year:year,
      stageS: JSON.parse(options.stageS)
    })
    console.log(that.data)
  
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
    var that = this
    var _app = getApp()
    wx.request({
      url: 'http://test.xcx.hqclass.cn/api/train/saveMilitaryShare',
      data: {
        user_id: _app.globalData.userId,
        group_id: _app.globalData.groupId
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: '../training/training',
        })

      }
    })

    return {
      title: "转发标题",
      path: '/pages/index/index',
      success: function (res) {
        console.log(res)
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success(res) {
            //微信
            var _app = getApp()
            console.log(res)
            // 分享信息
            console.log(_app.globalData.userId)
            console.log(_app.globalData.groupId)
            // wx.request({
            //   url: 'http://test.xcx.hqclass.cn/api/train/saveMilitaryShare',
            //   data:{
            //     user_id:_app.globalData.userId,
            //     group_id:_app.globalData.groupId
            //   },
            //   method: 'post',
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   success: function (res) {
            //     console.log(res)
            //     wx.navigateTo({
            //       url: '../training/training',
            //     })

            //   }
            // })

          }

        })

      },
      fail: function () {
        console.log(111)
      }

    }

  },
})