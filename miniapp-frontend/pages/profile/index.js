Page({
  data: {
    loggedIn: false,
    score: 1280
  },

  onShow() {
    const loggedIn = Boolean(wx.getStorageSync("mockLoggedIn"));
    this.setData({ loggedIn });
  },

  handleLoginTap() {
    wx.navigateTo({ url: "/pages/login/index?redirect=/pages/profile/index" });
  },

  goPage(e) {
    const url = e.currentTarget.dataset.url;
    if (!this.data.loggedIn) {
      this.handleLoginTap();
      return;
    }
    wx.navigateTo({ url });
  }
});
