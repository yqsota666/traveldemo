Page({
  data: {
    redirect: "/pages/profile/index"
  },

  onLoad(options) {
    if (options.redirect) {
      this.setData({ redirect: decodeURIComponent(options.redirect) });
    }
  },

  handleWechatLogin() {
    wx.setStorageSync("mockLoggedIn", 1);
    wx.showToast({ title: "登录成功", icon: "success" });
    setTimeout(() => {
      wx.redirectTo({ url: this.data.redirect });
    }, 500);
  },

  handlePhoneLogin() {
    this.handleWechatLogin();
  }
});
