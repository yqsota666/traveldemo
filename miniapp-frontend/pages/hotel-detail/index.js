Page({
  handleConsultTap() {
    wx.navigateTo({
      url: "/pages/im/index?source=hotel"
    });
  },

  handleFavoriteTap() {
    wx.showToast({
      title: "已收藏",
      icon: "success"
    });
  }
});
