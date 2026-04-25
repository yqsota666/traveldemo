Page({
  data: {
    messages: [
      { role: "service", text: "您好，我是定制顾问，请问您偏好哪个目的地？" },
      { role: "user", text: "想了解北京亲子定制。" },
      { role: "service", text: "好的，建议您填写需求卡片，我会尽快电话联系。" }
    ]
  },

  handleFormTap() {
    wx.navigateTo({
      url: "/pages/consult-form/index"
    });
  }
});
