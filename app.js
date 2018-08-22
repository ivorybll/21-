//app.js
var util = require('utils/util.js')
var aldstat = require("./utils/ald-stat.js");
console.log(1111)
App({
  globalData: {
    appid: 'wxceec248cc3d8ca2e',
    // secret: '12fd2cd17095da4c7e730742bd53f5bc',
    apiToken: '',
    openid: '',
    ticket: '',
    sessionKey:'',
    users:'',
    openGid: 'GHFX64oc1JWpj5-anmgyYor743Ws',//用户从微信群进入小程序获取的openGID
    hide:false,
    secrtet:'',
    userId:'',
    groupId:'',
    urlstr:'http://test.xcx.hqclass.cn',
    lull:1,
  
  },
  onLaunch: function (ops){  
    
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      console.log(2123)
      that.userLogin()
    }
    wx.checkSession({
      success: function () {
        console.log("登录状态正常");
        console.log(ops.scene)
        if (ops.scene == 1044) {
          console.log(ops.shareTicket)
          wx.getShareInfo({
            shareTicket:ops.shareTicket,
            complete(res){
              console.log(res.encryptedData)
              // 后台解密，获取 openGId
              setTimeout(function(){
                wx.request({
                  url: 'http://test.xcx.hqclass.cn/api/train/getWxPrivateInfo',
                  data: util.json2Form({
                    appid: that.globalData.appid,
                    sessionKey: that.globalData.sessionKey,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    type: 2
                  }),
                  method: 'post',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    console.log(res)
                    that.globalData.openGid = JSON.parse(res.data.data.data).openGId
               
                    //  console.log(that.globalData.openGId,1111111)   
                    
                  }
                })

              },500)
              
            }
          })
        }
        return true;
      },
      fail: function () {
        console.log("登录状态失效进入登录");
        that.userLogin();
      }
    })
  },
  userLogin: function () {
    var that = this
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //获取微信小程序openid与session_key
          console.log(res.code)
          wx.request({
            url: 'http://test.xcx.hqclass.cn/api/train/getWxOpenInfo',
            data: util.json2Form({
              js_code: res.code,
              type: 2
            }),
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {              
              console.log(JSON.parse(res.data.data))
              var obj = {};
              obj.openid = JSON.parse(res.data.data).openid;
              console.log(obj.openid)
              that.globalData.openid = JSON.parse(res.data.data).openid
              obj.session_key = JSON.parse(res.data.data).session_key
              that.globalData.sessionKey = JSON.parse(res.data.data).session_key 
              console.log(that.globalData.sessionKey)
             
              console.log(obj)
              
              //测试用户和训练营的状态
              console.log(that.globalData.openid)
              console.log(that.globalData.appid)
              console.log(that.globalData.openGid)
            setTimeout(function(){
              wx.request({
                url: 'http://test.xcx.hqclass.cn/api/train/getUserAndTrainStatus',//用户与训练营状态
                data: util.json2Form({
                  openid: that.globalData.openid,
                  app_id: that.globalData.appid,
                  open_gid: that.globalData.openGid,
                  group_name: ''

                }),
                method: 'post',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res)
                  that.globalData.userStatus = res.data.data
                  that.globalData.userId = res.data.data.userInfo.user_id
                  that.globalData.groupId = res.data.data.userInfo.group_id
                  console.log(that.globalData.groupId)
                  //用户
                  if (res.data.data.userInfo.length === 0) {
                    //新用户
                    console.log('新用户')
                    that.globalData.hide = true;
                  }
                  //训练营
                  else if (res.data.data.trainInfo.length === 0) {
                    //非训练营
                    console.log('非训练营')
                    wx: wx.navigateTo({
                      url: '../sign/sign',
                    })

                  }
                  //成功
                  else {
                    console.log(res.data.data)
                    //训练营与用户数据
                    //判断用户状况                    
                    //移除
                    if (res.data.data.userInfo.join_status === 2) {
                      console.log('移除')
                      //移除原因
                      //没有在规定时间内打卡
                      if (res.data.data.userInfo.out_reason == 1) {
                        console.log('没有在规定时间内打卡')
                        wx.navigateTo({
                          url: '../Supplement/Supplement',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })


                      }
                      //累计两次作弊
                      else if (res.data.data.userInfo.out_reason == 2) {
                        console.log('累计两次作弊')
                        wx.navigateTo({
                          url: '../Cheat/Cheat',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }
                      //违反群规则
                      else {
                        console.log('违反群规则')
                        wx.navigateTo({
                          url: '../rules/rules',
                        })
                      }

                    }
                    //正常||暂停
                    else {
                      console.log(res.data.data.userInfo.join_status)
                      console.log('正常')
                      //是否为训练营
                      //不是
                      if (res.data.data.trainInfo.if_battlion == 0) {
                        console.log('不是训练营')
                        //不是训练营对应的页面
                      }
                      //是
                      else if (res.data.data.trainInfo.if_battlion == 1) {
                        console.log('是训练营')
                        //训练营状态
                        //未开营
                        if (res.data.data.trainInfo.status == 0) {
                          console.log('未开营')
                          console.log(that.globalData.userId)
                          //开营倒计时
                          wx.navigateTo({
                            url: '../CountDown/CountDown',
                          })
                        }
                        //开营了
                        else {
                          console.log('开营')
                          //用户id


                          //分享状态
                          //未分享
                          if (res.data.data.userInfo.share_status == 0) {
                            console.log('未分享')

                            wx.navigateTo({
                              url: '../Military/Military',
                            })

                          }
                          //分享
                          else {
                            console.log(res.data.data.userInfo.share_status)
                            console.log('分享')
                            //暂停
                            if (res.data.data.userInfo.join_status === 1) {
                              console.log('暂停')
                              that.globalData.lull = 0
                              wx.reLaunch({
                                url: '../training/training',
                              })
                            }
                            else {
                              console.log('正常登陆')
                              //正常登陆
                              that.globalData.lull = 1
                              wx.reLaunch({
                                url: '../training/training',
                              })
                             

                            }

                          }

                        }

                      }
                    }
                  }
                },
                fail: function (res) {
                  console.log(res)
                }

              })
              
            },1000)
              
            },
            fail:function(res){
              console.log(res)

            }     
          })    
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }, fail(res) {
        console.log(res)
      }
    });
  }
})