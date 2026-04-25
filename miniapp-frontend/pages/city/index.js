Page({
  data: {
    cityName: "北京",
    categoryList: ["门票", "餐饮", "住宿", "交通", "购物"],
    activeCategory: "门票",
    cardList: [
      { id: "bj1", title: "故宫亲子讲解", desc: "2.5小时 | 文化深度游" },
      { id: "bj2", title: "长城轻徒步", desc: "半日行程 | 亲子友好" },
      { id: "bj3", title: "国家博物馆定制线", desc: "小团讲解 | 可加儿童任务卡" }
    ]
  },

  onLoad(options) {
    const cityName = options.cityName || "北京";
    this.setData({ cityName });
    wx.setNavigationBarTitle({ title: `${cityName}服务` });
  },

  handleCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
  },

  handleCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/travel-detail/index?id=${id}`
    });
  }
});
