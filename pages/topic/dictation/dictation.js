// pages/topic/dictation/dictation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: {
      method: 'pause'
    },
    audioPress:0,
    startTime:['00','00'],
    endTime:['00','00'],
    timer:null,
    play:false,
    Punch: false,
    hidden: true,
    notB:true
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _app=getApp()
    var that=this   
    wx.request({
      url:'http://test.tiku.hqclass.cn/paperLists',
      data: {
        id: options.id
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        var brr = res.data.data[0].answer.answer.split('\n')
        var crr=[]       
        for(var i=0;i<brr.length;i+=10){         
          crr.push(brr.slice(i,i+=10))
          i-=10
        }       
        
        that.setData({
          lists:res.data.data,
         crr:crr,
         sid:options.sid,
        // lnum: that.data.lists.items.length
        })  
        const bgm = wx.createInnerAudioContext()
        bgm.autoplay =false
        bgm.onCanplay(() => {
          console.log(bgm.duration)//0
        })
        bgm.play();
        bgm.onPlay(() => {
          console.log(bgm.duration)//0
        })
        setTimeout(function(){
          console.log(bgm.duration)
        },1000)
        
       
      }
    })
    
  
  },
  /**音频进度 */
  audioPress: function (e) {
    console.log(e.detail.currentTime)   
      var endTime=(e.detail.duration/60).toPrecision(2)
      var endTime=endTime.split('.')
      console.log(endTime)
      for(var i=0;i<endTime.length;i++){
         if(endTime[i]<10){
           endTime[i]=0+endTime[i]
         }         
      }
     
    // duration: (resp.detail.duration / 60).toPrecision(2)
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    console.log(progress)
    this.setData({
      audioPress: progress
    })
  },
  //音频开始
  audioPlay: function () {
    console.log(111)
    var that=this;
    this.setData({
      action: {
        method: 'play'
      },
      play:true
      
    })   
    //进度
    var load = that.data.startTime
    console.log(load[0].length)
    var timer = setInterval(function () {
      load[1]++
      if (load[1] == 60) {
        load[0]++
      }
      console.log(load[0])
      for (var i = 0; i < load.length; i++) {
        load[i] = load[i] + ''

        if (load[i].length < 2) {
          console.log(123)
          load[i] = '0' + load[i]
        }

      }
      that.setData({
        startTime: load
      })

    }, 1000)
    that.setData({
      timer: timer
    })
  },
  
  //音频暂停
  audioPause:function(){
    var that=this;
    clearInterval(that.data.timer)
    this.setData({
      action: {
        method: 'pause'
      },
      timer:null,
      play: false
    })
  },
  sub: function () {
    var that = this;
    this.photo()
  },
  photo: function () {
    var that = this
    var _app = getApp()
    //加载框显示
    this.setData({
      uploadetext: '文本框内显示照片解析后的答题内容',
      answerboard: 'answerContentA',
      flag: false,
      loadingHidden: false
    })
    //照相机
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imgs = res.tempFilePaths
        that.setData({
          imgs: imgs[0],
          hidden: false
        })
      }
    })
  },
  //重拍
  againload: function () {
    this.photo()

  },
  //上传
  upload: function () {
    var that = this;
    this.uload()
    this.setData({
      hidden: true,
      singclass: 'listD',
      notB:false,
      readclass: 'qfenB',
      hide: true
    })


    wx.showToast({
      title: '上传成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },
  uload: function () {
    //时间戳
    var timestamp = Date.parse(new Date());
    console.log(timestamp)
    var that = this;
    wx.uploadFile({
      url: 'http://test.xcx.hqclass.cn/api/train/uploadImg',
      filePath: that.data.imgs,
      name: 'img',
      formData: {
        newName: timestamp
      },
      success: function (res) {
        console.log(JSON.parse(res.data).data)
        that.setData({
          Punch: true,
          imgn: JSON.parse(res.data).data
        })

      },
      fail: function (res) {
        console.log(res);

      },


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
    var _app = getApp()
    var that = this
    
    //预打卡
    // wx.request({
    //   url: 'http://test.xcx.hqclass.cn/api/train/savePunch',
    //   data: {
    //     openid: _app.globalData.openid,//用户的openid
    //     app_id: _app.globalData.appid,//小程序的appid
    //     open_gid: _app.globalData.openGid,//群组id
    //     question_id: that.data.sid,//试题id
    //     choice_total:1,//选择题数量
    //     choice_right: 0,//正确数量
    //     exercise_img: that.data.imgn//图片
    //   },
    //   method: 'post',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     wx.reLaunch({
    //       url: '../../training/training',
    //     })


    //   }, fail: function (res) {
    //     console.log(res)
    //   }
    // })
    var that = this
    return {
      title: "转发标题",
      path: '/pages/topic/dictation/dictation',
      success: function (res) {
        console.log(res)
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success(res) {
            //微信
            var _app = getApp()
            console.log(res)
            //打卡
            wx.request({
              url: 'http://test.xcx.hqclass.cn/api/train/savePunch',
              data: {
                     openid: _app.globalData.openid,//用户的openid
                     app_id: _app.globalData.appid,//小程序的appid
                     open_gid: _app.globalData.openGid,//群组id
                     question_id: that.data.sid,//试题id
                     choice_total:1,//选择题数量
                     choice_right: 0,//正确数量
                     exercise_img: that.data.imgn//图片
                      },
                       method: 'post',
                       header: {
                       "Content-Type": "application/x-www-form-urlencoded"
                               },
                        success: function (res) {
                         console.log(res)
                         wx.reLaunch({
                            url: '../pages/topic/dictation/dictation',
                           })
                          }, fail: function (res) {
                            console.log(res)
                          }
                        })
                    }

                  })

                },
                fail: function () {
                  console.log(111)
                }

              }

            }
          })