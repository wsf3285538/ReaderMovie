var postsData = require("../../../data/posts-data.js") //只能用相对路径
var app = getApp();
Page({
  data: {
    isplayingMusic: false
  },
  onLoad: function(option) {
    // var globalData = app.globalData;
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId]; //postList属性才是数组
    // this.setData.postData = postData;
    this.setData({
      shuju: postData
    })
    

    //读取收藏的功能的缓存值
    var postsCollected = wx.getStorageSync('posts_collected')
    // console.log(postsCollected);
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({
          collectde: postCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    //设置音乐播放曲目对应的文章
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currrentMusicPostId === postId) {
      this.setData({
        isplayingMusic: true
      })
    }
    this.setMusicMonitor();
  },



  //设置音乐播放和暂停
  setMusicMonitor: function() {
    var that = this;
    //音乐播放时
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isplayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currrentMusicPostId = that.data.currentPostId;
    });

    //音乐暂停时
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isplayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currrentMusicPostId = null;//音乐暂停时清空当前播放的音乐的id
    });
  },


  //设置缓存方式
  onColletionTap: function(event) {
    // this.getPostsCollectedAsy();异步
    this.getPostsCollectedSyc() //同步
  },

  // getPostsCollectedAsy: function (event) {
  //   var that = this;
  //   wx.getStorage({
  //     key: "posts_collected",
  //     success: function (res) {
  //       var postsCollected = res.data;
  //       var postCollected = postsCollected[that.data.currentPostId];
  //       //收藏变成未收藏，未收藏变成收藏
  //       postCollected = !postCollected;
  //       postsCollected[that.data.currentPostId] = postCollected;
  //       that.showToast(postsCollected, postCollected);
  //     }
  //   })
  // },


//实现收藏功能
  getPostsCollectedSyc: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected')
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  // showModal: function (postsCollected, postCollected) {
  //   var that = this;//this调用的上下文环境
  //   wx.showModal({
  //     title: '收藏',
  //     content: postCollected?'收藏该文章？':"取消收藏该文章？",
  //     showCancel: "true",
  //     cancelText: "取消",
  //     cancelColor: "#333",
  //     confirmText: "确认",
  //     confirmColor: "#405f80",
  //     success: function (res) {
  //       if (res.confirm) {
  //         //更新文章是否的缓存值
  //         wx.setStorageSync('posts_collected', postsCollected);
  //         //这里如果是this，就不是Page下的data{}中的this,是success中单独的，注意上下文环境，对应上才能调用
  //         that.setData({
  //           //更新数据绑定变量，从而实现切换图片
  //           collected: postCollected
  //         })
  //       }
  //     }
  //   })

  // },

  showToast: function(postsCollected, postCollected) {
    var that = this;
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // console.log(postsCollected);
    that.setData({
      //更新数据绑定变量，从而实现切换图片
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000, //显示时间
      icon: "success", //图标
    })
  },

  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        //res.cancel 用户是不是点击了取消按钮
        //res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + '现在无法实现分享功能',

        })
      }

    })
  },

  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    // var postData = postsData.postList[currentPostId];//获取不到，暂时不知道原因，暂不采用
    var isplayingMusic = this.data.isplayingMusic;
    if (isplayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isplayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg,
      })
      this.setData({
        isplayingMusic: true
      })
    }

  }

})