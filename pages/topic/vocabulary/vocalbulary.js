// pages/topic/vocabulary/vocalbulary.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choice:'',
    subject:'',
    brr:['A','B','C','D'],
    flag:'',
    Hint:true,
    Punch:false

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that=this;
    var _app=getApp()
    var arr=[];//选项
    var srr=[]//题
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
        console.log(res.data.data[0].items)
        for(var i=0;i<res.data.data[0].items.length;i++){
          var brr=[];
          srr.push('subjectA')
          for(var j=0;j<res.data.data[0].items[i].options.length;j++){
            brr.push('choiceA')
          }
          arr.push(brr)
        }
        console.log(arr)
   
        that.setData({
          choice:arr,
          subject:srr,
          datas: res.data.data,
          topic: options.id,
          sid:options.sid
        })
      }
    })
 
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //提交答案
  sub:function(){
    var _app=getApp()
    var that=this
    var flag=[]
    var num=0;
    console.log(that.data.choice)
    //判断有没有选项
    for(var i=0;i<that.data.choice.length;i++){
     
      flag[i]=false
      if(that.data.choice[i].indexOf('choiceB')!==-1){
        num++       
         flag[i]=true
      }
      console.log(that.data.choice[i])

    }
    that.setData({
      flag:flag
    })
    
    //判断
    if(num!==20){
      for (var i = 0; i < flag.length; i++) {
        if (flag[i] == false) {
          that.data.subject[i] = 'subjectB'
        }
        else{
          that.data.subject[i] = 'subjectA'
        }
      }
      console.log(that.data.subject)
      that.setData({
        subject: that.data.subject
      })
      that.setData({
        Hint: false
      })
      setTimeout(function(){
        that.setData({
          Hint:true
        })
      },2000)
     
    }
    if(num==20) {
      for (var sen = 0; sen < flag.length; sen++) {
        if (flag[sen] == true) {
          that.data.subject[sen] = 'subjectA'
        }
        else {
          that.data.subject[sen] = 'subjectB'
        }
      }
      that.setData({
        subject:that.data.subject
      })
       var len=that.data.datas[0].items.length;
      
      //显示答案      
      
      for(var j=0;j<that.data.datas[0].items.length;j++){       
        for(var n=0;n<that.data.datas[0].items[j].options.length;n++){
          if(that.data.choice[j][n]=='choiceB'){
              that.data.choice[j][n]='choiceD';
             
          }
          if(that.data.datas[0].items[j].options[n].isAnswer==1){
            that.data.choice[j][n]='choiceC'
            
          }               
        }
      }
      //计算正确题目个数
      var rnum=0;//正确题目基数
      for(var r=0;r<that.data.choice.length;r++){
        if(that.data.choice[r].indexOf('choiceD')==-1){
          rnum++
        }
        
      }
      console.log(rnum)
      
      that.setData({
        choice:that.data.choice,
        Punch:true
      })
      console.log(that.data.choice)
      that.setData({
        len: len,
        rnum: rnum,
      })
      
    }    
    
   },
  //单选题
  choicequestion:function(e){
    var that=this;
    var ind=e.target.dataset
    console.log(ind.index,ind.ind)
    for (var i=0;i<that.data.choice[ind.index].length;i++){
                  that.data.choice[ind.index][i]="choiceA"
    }
    console.log(that.data.choice[ind.index])
    that.data.choice[ind.index][ind.ind] ='choiceB'
    that.setData({
      choice:that.data.choice
    })
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
    var that=this
    //预打卡
    // wx.request({
    //   url: 'http://test.xcx.hqclass.cn/api/train/savePunch',
    //   data: {
    //     openid: _app.globalData.openid,//用户的openid
    //     app_id: _app.globalData.appid,//小程序的appid
    //     open_gid: _app.globalData.openGid,//群组id
    //     question_id: that.data.sid,//试题id
    //     choice_total: that.data.len,//选择题数量
    //     choice_right: that.data.rnum,//正确数量
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
      path: '/pages/index/index',
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
                choice_total: that.data.len,//选择题数量
                choice_right: that.data.rnum,//正确数量
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

  },
})