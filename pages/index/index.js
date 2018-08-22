// pages/index/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxGid:'GHFX64iByOO_j1higb4Gx1tYVFf8',
    hide:false,
  
  },

  //倒计时
  click1:function(){
    wx.navigateTo({
      url: '../CountDown/CountDown',
    })
  },
  //新用户登陆
  onGotUserInfo:function(e){
    var that = this
    var users = e.detail.userInfo
    var _app = getApp()
    _app.globalData.users = users;
    console.log()
    wx.clearStorageSync()
   
    wx.setStorageSync('usej',users)
    
      that.setData({
        hide: false
      })
    console.log(_app.globalData.sessionKey)
    //获取用户详细信息
    setTimeout(function(){
      wx.getUserInfo({
        success: function (res) {
          console.log(res.userInfo)
          console.log(_app.globalData.openGid)
          wx.request({
            url: 'http://test.xcx.hqclass.cn/api/train/bindUser',
            data: util.json2Form({
              openid: _app.globalData.openid,//用户的openid
              app_id: _app.globalData.appid,//小程序的appid
              open_gid: _app.globalData.openGid,//群组id
              nick_name: users.nickName,//用户昵称
              avatar_url: users.avatarUrl,//头像
              gender: res.userInfo.gender,//性别
              city: res.userInfo.city,//城市
              province: res.userInfo.province,//省份
              country: res.userInfo.country,//国家
              phone: '',//手机号
              language: res.userInfo.language,//语言
              session_key: _app.globalData.sessionKey,//用户sessionkey
              group_name: ''//群组名称       
            }),
            method: 'post',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              _app.globalData.userId=res.data.data.user_id
              _app.globalData.groupId=res.data.data.group_id
              wx.navigateTo({
                url: '../Military/Military',
              })

            }, fail: function (res) {
              console.log(res)
            }
          })
        }
      })

    },1000)
     
  },
  Supplement:function(){
    console.log(111)
    wx.navigateTo({
      url: '../Supplement/Supplement',
    })
  },
  ordersen:function(){
    console.log(111)
       wx.navigateTo({
              url: '../Military/Military',
            })
  },
  phase:function(){
    wx.navigateTo({
      url: '../phase/phase',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  rules:function(){
    wx.navigateTo({
      url: '../rules/rules',
    })
  },
  cheat:function(){
    wx.navigateTo({
      url: '../Cheat/Cheat',
    })
  },
  onLoad: function (options) {
    var _app = getApp()
    var that=this;
    setTimeout(function(){
      that.setData({
        hide: _app.globalData.hide
      })
      console.log(that.data.hide)
    },2000)
    
    wx.showShareMenu({
      withShareTicket:true
    })   
  
  },
  //完成训练
  finish:function(){
    wx.navigateTo({
      url: '../finish/finish',
    })
  },
  //转发
  onShareAppMessage: function () {
    　　var that = this
    　　return {
      　　title: "转发标题",
      　　path: '/pages/index/index',
      　　success:function(res) {
              console.log(res)
        　　wx.getShareInfo({
          　　shareTicket: res.shareTickets[0],
          　　success(res) {
              //微信
                var _app = getApp()
               console.log(res)
               var wxAppid=_app.globalData.appid
               var wxsessionKey=_app.globalData.sessionKey
               var wxGid = res.encryptedData
               var wxIv=res.iv
            　　// 后台解密，获取 openGId
              wx.request({
                url: 'http://test.xcx.hqclass.cn/api/train/getWxPrivateInfo',                
                data: util.json2Form({
                  appid:wxAppid,
                  sessionKey:wxsessionKey,
                  encryptedData:wxGid,
                  iv:wxIv,
                  type:2
                }),
                method: 'post',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res.data.data,123987)
                  that.setData({
                    wxGid: JSON.parse(res.data.data.data)
                  })
                  console.log(that.data.wxGid)
                }
              })
          　　}
        　　})
      　　},
         fail:function(){
           console.log(111)
         }
    　　}
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
  sign:function(){
    wx:wx.navigateTo({
      url: '../sign/sign',
    })
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

 
  
})