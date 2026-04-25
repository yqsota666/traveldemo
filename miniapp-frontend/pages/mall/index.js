Page({
  data: {
    list: [
      { id: "p1", title: "北京亲子博物馆路线包", subtitle: "价格透明，咨询获取" },
      { id: "p2", title: "西安历史文化深度包", subtitle: "价格透明，咨询获取" },
      { id: "p3", title: "亲子城市漫游通用包", subtitle: "价格透明，咨询获取" }
    ]
  },

  handleItemTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/index?id=${id}`
    });
  }
});
