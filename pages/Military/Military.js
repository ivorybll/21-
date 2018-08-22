// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: '',
    username: '',
    hide: false,
    imagePath: '',
    loadingHidden:false,
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onGotUserInfo: function (e) {
    var that = this
    var users = e.detail.userInfo
    console.log(users)
    this.setData({
      users: users
    })   
  },
  onLoad: function (options) {
    var _app=getApp() 
    var that=this
    wx.getStorage({
      key:'usej',
      success:function(res){
        console.log(res,1234)
        console.log(res.data.nickName)
        that.setData({
          myname:res.data.nickName
        })


      }
    })
    //军令状
    setTimeout(function () {
     console.log(_app.globalData)
      wx.request({
        url: _app.globalData.urlstr + '/api/train/getMilitary',
        data: {
          user_id: _app.globalData.userId,
          open_gid: _app.globalData.openGid
        },
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          //军令状时间
          var armydays = res.data.data.rightdate.split('-')
          var index = res.data.data.content.indexOf('在')
          var content = res.data.data.content.slice(index, res.data.data.content.length - 1)
          that.setData({
            armydays,
            content
          })
          console.log(res)
          //获取usej数据
          wx.getStorage({
            key: 'usej',
            success: function (res) {
              console.log(res.data)
            }
          })

          that.createNewImg()
        }
      })
    },2000)    
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
  },
  createNewImg: function () {
    let ratio = 0;
    let mobile = wx.getSystemInfoSync();
    if (mobile.windowWidth < 350) {
      ratio = mobile.windowWidth / 750 * 0.724;
    } else if (mobile.windowWidth > 400) {
      ratio = mobile.windowWidth / 750 * 0.725;
    } else {
      ratio = mobile.windowWidth / 750 * 0.726;
    }
    var that = this
    that.setData({
      x: ratio * 2.7
    })
    var that = this
    console.log(this.data.x)
    var _app=getApp()
    var name = that.data.myname;
    var path ='../imgs/Military2.png'
    console.log(name)
    //绘制分享图片
    var context = wx.createCanvasContext('mycanvas')
    
    //banner图片
    context.drawImage(path, 0 * that.data.x, 0 * that.data.x, 291 * that.data.x, 470 * that.data.x)
    //昵称
    context.setFontSize(12 * that.data.x);
    context.setFillStyle('#333333');
    context.setTextAlign('center');    
    context.fillText(name, 192* that.data.x, 383 * that.data.x);
    context.stroke();
    context.setFontSize(12 * that.data.x);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(that.data.armydays[0]+'年'+that.data.armydays[1]+'月'+that.data.armydays[2]+'日', 228 * that.data.x, 414* that.data.x);
    context.stroke();    
    context.setFontSize(12 * that.data.x);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    //数据
    var starday ="2018年07月12日"
    var endday ="2018年08月02日"
    var content=that.data.content
    var datas=`      本人 ${name} ${content}`
    var chr=datas.split('')   //这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(18 * that.data.x)
    context.setFillStyle("#000")
    for (var a = 0; a < chr.length; a++) {
     
      if (context.measureText(temp).width < 310* that.data.x) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
        
      }
      
    }
    //添加下划线
    mysign(name)
    function mysign(data){
      var sign=''
      var re = /^[u4E00-u9FA5]+$/;
      if (re.test(data)){
        for (var i = 0; i < data.length; i++) {
          sign += '_'
        }
      }
      else{
        for (var i = 0; i < data.length; i++) {
          sign += '__'
        }
      }
      
      
      console.log(sign)
      context.setFontSize(12 * that.data.x);
      context.setFillStyle('#333333');
      context.setTextAlign('left');
      context.fillText(sign,81* that.data.x,180 *that.data.x);
      context.stroke();


    }
    row.push(temp);
    //渲染
    for(var i=0;i<row.length;i++){
      context.setFontSize(12 * that.data.x);
      context.setFillStyle('#333333');
      context.setTextAlign('left');
      context.fillText(row[i], 50* that.data.x, 200+25*i* that.data.x);
      context.stroke();
    }  
    
    context.draw()
    //生成图片
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log('成功生成图片')
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
          console.log(that.data.imagePath)
        },
        fail: function (res) {
          console.log(res);
        }
      });
      that.setData({
        loadingHidden:true
      })
    },1000);

  },
  //保存相册
  keep: function () {
    console.log(111)
    var that = this
    console.log(that.data.imagePath)
    if (that.data.imagePath){
     
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        console.log(res)
        wx.navigateTo({
          url: '../training/training?img='+that.data.imagePath,
        })
       
      }, fail: function (res) {
        console.log(res)
        if (res.errMsg === "saveImageToPhotosAlbum:fail filePath invalid") {
          console.log("打开设置窗口");
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                console.log("获取权限成功，再次点击图片保存到相册")
              } else {
                console.log("获取权限失败")
              }
            }
          })
        }
        else {
          console.log(1234)
        }
      }
    })
    }
    else{
  
    }



  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    var _app=getApp()
    //  wx.request({
    //           url: 'http://test.xcx.hqclass.cn/api/train/saveMilitaryShare',
    //           data:{
    //             user_id:_app.globalData.userId,
    //             group_id:_app.globalData.groupId
    //           },
    //           method: 'post',
    //           header: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //           },
    //           success: function (res) {
    //             console.log(res)
    //             wx.navigateTo({
    //               url: '../training/training',
    //             })

    //           }
    //         })
   
    return {
      title: "转发标题",
      path: '/pages/training/training',
      success: function (res) {
        console.log(res,12345)
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success(res) {
            //微信
            var _app = getApp()
              console.log(res)
            // 分享信息
            console.log(_app.globalData.userId)
            console.log(_app.globalData.groupId)
            wx.request({
              url: 'http://test.xcx.hqclass.cn/api/train/saveMilitaryShare',
              data:{
                user_id:_app.globalData.userId,
                group_id:_app.globalData.groupId
              },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res)
                wx.reLaunch({
                  url: '../training/training',
                })                
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

 
 
})