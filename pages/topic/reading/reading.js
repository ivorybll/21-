// pages/topic/reading/reading.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:'',
    qsentence:'',
    qfill:'',
    qfen:'',
    essay:'',
    Punch:false,
    hidden: true,
    crr:'',
    readclass:'qfenA',
    hide:false,
    lnum:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.request({
      url: 'http://test.tiku.hqclass.cn/paperLists',
      data: {
        id: options.id
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data[0])
        that.setData({
          lists:res.data.data[0]
        })        
        //数量
        that.setData({
          lnum:that.data.lists.items.length,
          topic: options.id,
          sid:options.sid
        })
            
        var crr=[]
        //文章整理
        for (var n=0; n<that.data.lists.question.question.split('\n').length;n++){
          if (that.data.lists.question.question.split('\n')[n].length>=2){
            crr.push(that.data.lists.question.question.split('\n')[n])
          }
        }   
            
        var qsentence=[]//文章题
        var qfill=[]//填空题
        var rsentce = [];//正确文章题
        var rcorrect = [];//正确填空题
        for(var i=0;i<that.data.lists.items.length;i++){
          if(that.data.lists.items[i].question.question.indexOf('_')!=-1){
              var subject=[]
            for(var v=0;v<that.data.lists.items[i].question.question.split('_').length;v++){
              if (that.data.lists.items[i].question.question.split('_')[v]!==''){
              subject.push(that.data.lists.items[i].question.question.split('_')[v])
              }
            }    
            console.log(that.data.lists.items[i].question.question)            
            qfill.push(that.data.lists.items[i].question.question)
            rsentce.push(that.data.lists.items[i].answer.answer)
          }
          else{
            
            qsentence.push(that.data.lists.items[i].question.question)
            rcorrect.push(that.data.lists.items[i].answer.answer)
          }
        }
        console.log(subject)        
        var fill=rsentce[0].split('.') 
        console.log(fill)
        var darr=[]      
        for(var s=fill.length-1;s>0;s--){
          var reg=/\d+/g
          var sen=fill[s].replace(reg,'')
          console.log(sen)  
          darr.push(sen)        
        }
        var str=''
        for(var n=0;n<subject.length;n++){
          if(darr[n]!=undefined){
            str += subject[n] +'<span class="rn">'+darr[n]+'</span>'
          }           
        }
        
        WxParse.wxParse('filling', 'html', str, that, 5);
        
        
        
        
        var right=[rcorrect,rsentce]
        var essay=[]       
        for(var n=0;n<crr.length;n+=4){                     
          essay.push(crr.slice(n,n+4))
          
        }
        console.log(essay)
        that.setData({
          qsentence,
          qfill,
          essay,
          right
        })        
      }
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
      qfen:that.data.right,
      readclass:'qfenB',
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
      path: '/pages/topic/reading/reading',
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