Page({
  data: {
    bannerList: [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60f?auto=format&fit=crop&w=1400&q=80"
    ],
    cityList: [
      {
        id: "beijing",
        name: "北京",
        status: "已上线",
        image: "https://images.unsplash.com/photo-1547981609-4b6bf67db8df?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "xian",
        name: "西安",
        status: "已上线",
        image: "https://images.unsplash.com/photo-1606236929522-e3f0a6d7f6a5?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "xinjiang",
        name: "新疆",
        status: "即将上线",
        image: "https://images.unsplash.com/photo-1511231881203-129dae6ed647?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "chengdu",
        name: "成都",
        status: "规划中",
        image: "https://images.unsplash.com/photo-1621417930015-6643cf67ff8e?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    hotelList: [
      {
        id: "h1",
        name: "北京亲子五星酒店代订",
        tag: "会员专享价",
        image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "h2",
        name: "西安古城酒店代订",
        tag: "会员专享价",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    navList: [
      { key: "home", label: "首页" },
      { key: "about", label: "About Us" },
      { key: "mall", label: "商城" },
      { key: "profile", label: "个人" }
    ]
  },

  handleCityTap(e) {
    const { name, id, status } = e.currentTarget.dataset;
    if (status !== "已上线") {
      wx.showToast({
        title: `${name}${status}`,
        icon: "none"
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/city/index?cityId=${id}&cityName=${name}`
    });
  },

  handleHotelTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/hotel-detail/index?id=${id}`
    });
  },

  handleConsultTap() {
    wx.navigateTo({
      url: "/pages/im/index?source=home"
    });
  },

  handleFooterTap(e) {
    const { key } = e.currentTarget.dataset;
    const map = {
      home: "/pages/index/index",
      about: "/pages/about/index",
      mall: "/pages/mall/index",
      profile: "/pages/profile/index"
    };
    wx.navigateTo({
      url: map[key]
    });
  },

  handlePretripTap() {
    wx.navigateTo({
      url: "/pages/pretrip/index"
    });
  },

  handleTravelLogTap() {
    wx.navigateTo({
      url: "/pages/travel-log/index"
    });
  },

  handleWishTap() {
    wx.navigateTo({
      url: "/pages/wishlist/index"
    });
  }
});
