const { request } = require("../../utils/request");

Page({
  data: {
    statusText: "等待请求",
    resultText: "点击按钮后显示后端返回结果"
  },

  async handlePing() {
    this.setData({
      statusText: "请求中..."
    });

    try {
      const data = await request({
        url: "/api/test/ping"
      });

      this.setData({
        statusText: "请求成功",
        resultText: JSON.stringify(data)
      });
    } catch (err) {
      this.setData({
        statusText: "请求失败",
        resultText: JSON.stringify(err)
      });
    }
  }
});
