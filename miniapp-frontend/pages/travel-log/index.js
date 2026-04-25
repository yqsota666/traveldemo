Page({
  data: {
    list: [
      { id: "1", province: "北京", city: "朝阳区", note: "第一次带孩子看博物馆", family: "爸爸+妈妈+孩子" },
      { id: "2", province: "陕西", city: "西安市", note: "兵马俑体验很棒", family: "全家4人" }
    ]
  },

  handleAdd() {
    wx.showToast({
      title: "示意：新增足迹",
      icon: "none"
    });
  }
});
