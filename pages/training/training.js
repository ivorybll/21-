// pages/training/training.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerclass:'trainingBarA',
    userhide:true,

    lists: '',//数据
    //模拟数据
    datas: [
            {
              Military:{

              }
            },
            {
              title:'Day 01',
              lists:[
                      {imgsT:'../imgs/listenT.png',imgsF:'../imgs/listenF.png',text:'听力听写练习',Punch:'已打卡'},
                      {imgsT:'../imgs/writeT.png',imgsF:'../imgs/writeF.png',text:'写作单句练习',Punch:'已打卡'},
                      {imgsT:'../imgs/readT.png',imgsF: '../imgs/readF.png',text:'阅读泛读',Punch:'待打卡'},
                      {imgsT:'../imgs/readT.png',imgsF:'../imgs/readF.png',text:'阅读词汇练习',Punch:'待打卡'},
                      {imgsT:'',imgsF:'../imgs/clockF.png',text:'16:00更新'}
                    ],
               days:['07','15'] 
            },
            {
              title:'Day 02',
              lists:[
                      {imgsT:'../imgs/listenT.png',imgsF:'../imgs/listenF.png',text:'听力听写练习',Punch:'已打卡'},
                      {imgsT:'../imgs/writeT.png',imgsF:'../imgs/writeF.png',text:'写作单句练习',Punch:'已打卡'},
                      {imgsT:'../imgs/readT.png',imgsF: '../imgs/readF.png',text:'阅读泛读',Punch:'待打卡'},
                      {imgsT:'../imgs/readT.png',imgsF:'../imgs/readF.png',text:'阅读词汇练习',Punch:'待打卡'},
                      {imgsT:'',imgsF:'../imgs/clockF.png',text:'16:00更新'}
                    ],
               days:['07','16']
            },
            {
              title:'Day 03',
              lists:[
                      {imgsT:'../imgs/listenT.png',imgsF:'../imgs/listenF.png',text:'听力听写练习',Punch:'已打卡'},
                      {imgsT:'../imgs/writeT.png',imgsF:'../imgs/writeF.png',text:'写作单句练习',Punch:'已打卡'},
                      {imgsT:'../imgs/readT.png',imgsF: '../imgs/readF.png',text:'阅读泛读',Punch:'待打卡'},
                      {imgsT:'../imgs/readT.png',imgsF:'../imgs/readF.png',text:'阅读词汇练习',Punch:'待打卡'},
                      {imgsT:'',imgsF:'../imgs/clockF.png',text:'16:00更新'}
                    ],
              days: ['07', '17']  
            },
            {
              Lack:{
                  title:'Day 11',
                  notice:'通知',
                  text:'由于连续3个训练日存在缺卡,训练暂停,请学员两天内完成补卡,恢复训练。',
                  contimg:'../imgs/suspend.png',
                  bottext:'魔鬼训练营管理委员会',
                  days:'11/21'
                 }
            }
           ],
          stage: {
            num: 1,
            days: '2018/7/18',
            imgs: '../imgs/pledge.png',
            todays: '07/21'
          },
          stageS:'',//用户分数信息
           

    dataclass:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var _app = getApp()
    console.log(_app.globalData.openGid)
    var that=this
    console.log(_app.globalData.lull)
    this.data.datas[0].imgs=options.img
    this.setData({    
      datas:this.data.datas,
      lull:_app.globalData.lull
    })
   
    var arr = ['swiper-itemP']
    for(var i=1;i<this.data.datas.length;i++){
      arr.push('')
    }
    console.log(arr)
    this.setData({
      dataclass:arr
    })
    //试题详情
    console.log(_app.globalData.groupId)
    console.log(_app.globalData.userId)
     wx.request({
       url: _app.globalData.urlstr +'/api/train/list',
   
      data:{
        user_id: _app.globalData.userId,
       group_id: _app.globalData.groupId
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        
       that.setData({
         lists:res.data.data
       })
       
       //21天判断详情
       var daylen=''
       var num=0
        for(var n=0;n<that.data.lists.length;n++){
          if(that.data.lists[n].day_num>num){
            num = that.data.lists[n].day_num
          }        
        }
       console.log(num)
       that.setData({
         num:num
       })
       let arr=[]
       arr.push({})
       for(var i=1;i<=num;i++){
         var datas = {
           title:'',
           brr: []
         }
         //时间
         if(i<10){
           datas.title='Day 0'+i     
         }
         else{
           datas.title='Day '+i
         }
         for(var j=0;j<that.data.lists.length;j++){
           if(i===that.data.lists[j].day_num){            
              var obj={}
              var words=that.data.lists[j].q_desc[0]                             
              switch(words){
                case '写':
                  obj.imgT='../imgs/writeT.png';
                  obj.imgF='../imgs/writeF.png';
                  break;
                case '阅':
                  obj.imgT='../imgs/readT.png';
                  obj.imgF='../imgs/readF.png';
                  break;
                case '听':
                  obj.imgT='../imgs/listenT.png';
                  obj.imgF='../imgs/listenF.png';
                  break;
                default:return;  
              }
              console.log(that.data.lists)
              var date=that.data.lists[j].day.split('-')
              
              
             obj.days=[date[1],date[2]]
             obj.lists = that.data.lists[j]
             obj.Punch = that.data.lists[j].is_puch===0?'待打卡':'已打卡'
             datas.brr.push(obj)
           }
         }
         datas.days=[date[1],date[2]]   
         arr.push(datas)
         
       }
      
       console.log(_app.globalData.groupId)
        //用户阶段信息
        wx.request({
          url: 'http://test.xcx.hqclass.cn/api/train/stageSummary',
          data: {
            user_id: _app.globalData.userId,
            group_id: _app.globalData.groupId
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {  
          
            console.log(res.data.data) 
             
            var stageA = ''
           var hnum=Math.ceil(arr.length/7)
           console.log(arr.length/7)
           console.log(hnum)
            switch (hnum) {
              case 1:
                stageA = '一';
                break;
              case 2:
                stageA = '二'
                break;
              case 3:
                stageA = "三"
                break;
              default:
                return;
            }      
            console.log(arr)
            console.log(res)
            
            that.setData({
              stageS: [res.data.data,stageA],
            })
            console.log(that.data.stageS)

          }, fail: function (res) {
            console.log(new Error)

          }
        })
        console.log(arr)
        console.log(that.data.lull)
        if(that.data.lull==0&&date!=undefined){
          var stop =arr.length - 1< 2 ? '0' + arr.length - 1 : arr.length - 1;
          console.log(stop)
          arr[arr.length-1]={
                  title:'Day'+stop,
                  notice:'通知',
                  text:'由于连续3个训练日存在缺卡,训练暂停,请学员两天内完成补卡,恢复训练。',
                  contimg:'../imgs/suspend.png',
                  bottext:'魔鬼训练营管理委员会',
                  days: [date[1], date[2]]
                 }
        }
        console.log(arr)
       //数据
      that.setData({
        lists:arr
      })
     }
    })  //军令状
    wx.request({
      url: _app.globalData.urlstr+'/api/train/getMilitary',
      data:{
        user_id: _app.globalData.userId,
        open_gid: _app.globalData.openGid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       //军令状时间
       console.log(res)
        var armydays = res.data.data.rightdate.split('-')
        var index=res.data.data.content.indexOf('在')
        var content = res.data.data.content.slice(index, res.data.data.content.length-1)
        that.setData({
          armydays,
          content
        })
        // that.data.datas[0].Military=res.data.data
        // that.setData({
        //   datas:that.data.datas
        // })
        // console.log(that.data.datas)
      }
    })
  },
  //跳转到试题详情  
  paperLists:function(e){
    console.log(e.target.dataset.nid)
    if (e.target.dataset.nid!=="已打卡"){
    var ids = e.target.dataset.id;
    var sid=e.target.dataset.sid;
    console.log(ids) 
    //判断题型
    switch(ids){
      case 6:
        wx.navigateTo({
          url: '../topic/single/single?id='+ids+'&sid='+sid
        })
      break;
      case 7:
        wx.navigateTo({
          url: '../topic/reading/reading?id='+ids+'&sid='+sid
        })
      break;
      case 8:
        wx.navigateTo({
          url: '../topic/vocabulary/vocalbulary?id='+ids+'&sid='+sid
        })
      break;
      case 9:
        wx.navigateTo({
          url: '../topic/writing/writing?id='+ids+'&sid='+sid
        })
      break;
      case 12:
        wx.navigateTo({
          url: '../topic/dictation/dictation?id='+ids+'&sid='+sid
        })
      break;
      case 11:
        wx.navigateTo({
          url: '../topic/special/special?id='+ids+'&sid='+sid
        })

    }
  }
  else{
      wx.showToast({
        title: '已答题',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
   }
  },
  //轮播图
  listenSwiper:function(e){
    var _app = getApp()
    var index=e.detail.current
    var that=this
    this.setData({
      dataclass:''
    })
    var arr=[];
    for (var i = 0; i < this.data.datas.length; i++) {
      arr.push('')
    }
    arr[index] ='swiper-itemP'
    this.setData({
      dataclass:arr
    })
    if(e.detail.current!=0){
      this.setData({
        userhide:false,
      })
    }
    console.log(that.data.lull)
    var daynum=that.data.lists.length-1//天数
    var phase = that.data.lists.length / 7;
    wx.request({
      url: 'http://test.xcx.hqclass.cn/api/train/getUserAndTrainStatus',//用户与训练营状态
      data: ({
        openid: _app.globalData.openid,
        app_id: _app.globalData.appid,
        open_gid: _app.globalData.openGid,  
      }),
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {        
        that.setData({
          shareStatus:res.data.data.userInfo
        })
      }})
     var date=new Date();
     var m=(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1);
     var d=date.getDate()<10?'0'+date.getDate():date.getDate();    
     //完成21天训练营
     var lists=that.data.lists
    // if (lists[lists.length-1].days[0]<m||lists[lists.length-1].days[1]<d){
    //   wx.navigateTo({
    //     url: '../finish/finish'
    //   })

    //  }
     console.log(m,d)
     switch(daynum){
       case 7: 
       if(that.data.shareStatus!=2){             
         wx.navigateTo({
        url:'../phase/phase?phase='+phase+'&&days='+that.data.lists[that.data.lists.length-1].days+'&&stageS='+JSON.stringify(that.data.stageS[0])
      })
       }
      break;
      case 14:
       if(that.data.shareStatus!=3){
         wx.navigateTo({
           url: '../phase/phase?phase=' + phase + '&&days=' + that.data.lists[that.data.lists.length - 1].days + '&&stageS=' + JSON.stringify(that.data.stageS[0])
         })
       };
     break;
     default:
     return; 
     }
  
    // console.log(that.data.lists.length)
    // if (that.data.lists.length==21){      
    //   var phase=that.data.lists.length/7   
  
      
    //   wx.navigateTo({
    //     url:'../phase/phase?phase='+phase+'&&days='+that.data.lists[that.data.lists.length-1].days+'&&stageS='+JSON.stringify(that.data.stageS[0])
    //   })
    // }
    if(that.data.lull==0){
      if(index==that.data.lists.length-1){
        console.log(index)
        that.setData({
          headerclass: 'trainingBarB'
        })
      }
      else{
        this.setData({
          headerclass: 'trainingBarA'
        })
      }
    }
    
    // if (e.detail.current == 4) {
    //   this.setData({
    //     headerclass:'trainingBarB'
    //   })
    // }
    // else{
     
    // }

  
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