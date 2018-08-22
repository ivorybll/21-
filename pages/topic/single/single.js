// pages/topic/single/single.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Punch:false,
    hidden:true,
    china:'',
    english:'',
    crr:[],
    singclass:'listC'
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.sid)
    var _app=getApp()
    wx.showShareMenu({
      withShareTicket: true
    })
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
        
        that.setData({
          lists:res.data.data
        })
       
        var arr=[];//英译汉
        var fn=function(num){
           var arr=[]
          for (var i = 0; i < that.data.lists[num].items.length; i++) {
            arr.push(that.data.lists[num].items[i].answers[0].answer)
          }
          return arr
        }
        console.log(that.data.lists)
        var lnum=0;
        for(var j=0;j<that.data.lists.length;j++){
          for(var n=0;n<that.data.lists[j].items.length;n++){
            lnum++
          }
        }
        that.data.crr.push(fn(0))
        that.data.crr.push(fn(1))
        that.setData({
          crr:that.data.crr,
          topic: options.id,
          lnum:lnum,
          sid:options.sid
        })      
      }
    })
  
  
  },
  //拍照上传
  sub:function(){
    var that=this;
    this.photo()
   
    
  },
  //拍照
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
          imgs:imgs[0],
          hidden: false
        })
      }
    })
  },
 //重拍
  againload:function(){
    this.photo()

  },
   //上传
  upload:function(){
    var that=this;
    this.uload()
    this.setData({
        hidden:true,
        china:that.data.crr[0],
        english:that.data.crr[1],
      singclass:'listD'
    })
    console.log(that.data.china)
    wx.showToast({
      title: '上传成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
    
  },
  uload:function(){
    //时间戳
    var timestamp = Date.parse(new Date());
    console.log(timestamp)
    var that=this;
    wx.uploadFile({
      url:'http://test.xcx.hqclass.cn/api/train/uploadImg',
      filePath: that.data.imgs,
      name: 'img',
      formData: {
        newName:timestamp
      },
      success: function (res) {
        console.log(res) 
        that.setData({
          Punch:true,
         
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
    console.log(that.data.lnum)
    //预打卡
    // wx.request({
    //   url: 'http://test.xcx.hqclass.cn/api/train/savePunch',
    //   data: {
    //     openid: _app.globalData.openid,//用户的openid
    //     app_id: _app.globalData.appid,//小程序的appid
    //     open_gid: _app.globalData.openGid,//群组id
    //     question_id: that.data.sid,//试题id
    //     choice_total: that.data.lnum,//选择题数量
    //     choice_right:0,//正确数量
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
      path: '/pages/topic/single/single',
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
              choice_total: that.data.lnum,//选择题数量
              choice_right:0,//正确数量
              exercise_img: that.data.imgn//图片
            },
            method: 'post',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              wx.reLaunch({
                url: '../../training/training',
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