Page({
  handleCardTap(e) {
    const type = e.currentTarget.dataset.type;
    wx.showToast({
      title: `${type}模块`,
      icon: "none"
    });
  }
});
