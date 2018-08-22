// pages/finish/finish.js
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
    console.log(111)
    var _app=getApp()
    var that=this
    wx.request({
      url:'http://test.xcx.hqclass.cn/api/train/getFinshData',
      data: {
        user_id: _app.globalData.userId,
        group_id: _app.globalData.groupId,
        app_id:_app.globalData.appid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var days=[];    
        var str=res.data.data.jsjyInfo.content
        var arr=str.replace(/[^0-9]+/g, ',').split(',')
        var brr=arr.slice(1,arr.length-1)        
        that.setData({
          datas:res.data.data,
          brr:brr
        })
        console.log(that.data.datas.score)
        var month=[]//月份
        for(var i=0;i<that.data.datas.score.length;i++){
          var days=that.data.datas.score[i].day.split('-')     
          if(month.indexOf(days[1])==-1){
            month.push(days[1])
          }
        }
        var datarr=[]
        for(var j=0;j<month.length;j++){ 
          datarr.push({month:month[j],days:[],dan:[]})               
          for(var n=0;n<that.data.datas.score.length;n++){
            var days = that.data.datas.score[n].day.split('-')
            if (month[j] == days[1]){                       
              datarr[j].days.push(that.data.datas.score[n].score)
              datarr[j].dan.push(that.data.datas.score[n].day.split('-')[2])           
           }
          }
        }
         console.log(datarr)
         for(var z=0;z<datarr.length;z++){
           if (datarr[z].month[0] == '0') {
             datarr[z].month = datarr[z].month[1]
           }
         }        
        that.setData({
          datarr:datarr
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