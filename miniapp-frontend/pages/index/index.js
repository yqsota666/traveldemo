const { request } = require("../../utils/request");
const { saveSession, clearSession, isLoggedIn } = require("../../utils/auth");

Page({
  data: {
    statusText: "等待操作",
    resultText: "点击按钮后显示后端返回结果",
    loggedIn: false,
    phoneNumber: ""
  },

  onShow() {
    this.setData({
      loggedIn: isLoggedIn()
    });
  },

  async handleWxLogin() {
    this.setData({ statusText: "微信登录中..." });
    try {
      const loginRes = await this.wxLogin();
      const data = await request({
        url: "/api/travel/auth/wx/login",
        method: "POST",
        skipAuth: true,
        data: {
          code: loginRes.code
        }
      });

      if (Number(data.status) !== 200 || !data.result) {
        throw new Error(data.message || "登录失败");
      }

      saveSession(data.result);
      this.setData({
        statusText: "登录成功",
        loggedIn: true,
        resultText: JSON.stringify(data, null, 2)
      });
    } catch (err) {
      this.setData({
        statusText: "登录失败",
        resultText: JSON.stringify(err)
      });
    }
  },

  async handleMe() {
    this.setData({ statusText: "查询登录状态..." });
    try {
      const data = await request({
        url: "/api/travel/auth/me",
        method: "GET"
      });
      this.setData({
        statusText: "查询成功",
        loggedIn: isLoggedIn(),
        resultText: JSON.stringify(data, null, 2)
      });
    } catch (err) {
      this.setData({
        statusText: "查询失败",
        loggedIn: false,
        resultText: JSON.stringify(err)
      });
    }
  },

  async handleLogout() {
    this.setData({ statusText: "退出中..." });
    try {
      await request({
        url: "/api/travel/auth/logout",
        method: "POST"
      });
    } finally {
      clearSession();
      this.setData({
        statusText: "已退出",
        loggedIn: false,
        resultText: "本地登录态已清理"
      });
    }
  },

  onPhoneInput(e) {
    this.setData({
      phoneNumber: (e.detail && e.detail.value) || ""
    });
  },

  async handleBindPhone() {
    const phoneNumber = (this.data.phoneNumber || "").trim();
    if (!phoneNumber) {
      this.setData({
        statusText: "请先输入手机号",
        resultText: "手机号不能为空"
      });
      return;
    }

    this.setData({ statusText: "绑定手机号中..." });
    try {
      const data = await request({
        url: "/api/travel/auth/wx/bind-phone",
        method: "POST",
        data: {
          phoneNumber
        }
      });

      if (Number(data.status) !== 200) {
        throw new Error(data.message || "绑定失败");
      }

      this.setData({
        statusText: "绑定成功",
        resultText: JSON.stringify(data, null, 2)
      });
    } catch (err) {
      this.setData({
        statusText: "绑定失败",
        resultText: JSON.stringify(err)
      });
    }
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
        resultText: JSON.stringify(data, null, 2)
      });
    } catch (err) {
      this.setData({
        statusText: "请求失败",
        resultText: JSON.stringify(err)
      });
    }
  },

  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res);
            return;
          }
          reject(new Error("wx.login 未返回 code"));
        },
        fail: (err) => reject(err)
      });
    });
  }
});
