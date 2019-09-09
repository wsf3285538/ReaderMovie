var postsData = require("../../data/posts-data.js") //只能用相对路径
Page({
  data: {

    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    //而这个动作A的执行，是在onLoad事件执行之后发生的
  },
  onLoad: function(options) {
    //页面初始化，options为页面跳转所带来的参数

    this.setData({
      posts_key: postsData.postList //从postts_data中获取数据
    }); //添加到上面的data中。


  },



  onPostTap: function(event) {
    var that = this;
    var postId = event.currentTarget.dataset.postid;
    // var contents = postsData.postList[postId];//获取点击时对应的文章
    // console.log("on post id is"+postId);获取文章ID
    // var collections = contents.collection;
    // var collections = parseInt(collections);//字符串型转换数字型
    // collections += 1;
    // // console.log(collections);
    // that.setData({
    //   collection: collections
    // });

    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    });

  },


  onswiperTap: function(event) {
    // target 和currentTarget
    // target指的是当前点击的组件, currentTarget 指的是事件捕获的组件
    // target这里指的是image(image中有postId)，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    // console.log("on post id is"+postId);获取文章ID
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})