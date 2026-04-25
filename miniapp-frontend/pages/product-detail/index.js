Page({
  handleThirdPartyTap() {
    wx.showModal({
      title: "即将离开小程序",
      content: "将跳转至第三方官方平台（淘宝/拼多多等）",
      confirmText: "继续",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: "已跳转示意",
            icon: "none"
          });
        }
      }
    });
  }
});
