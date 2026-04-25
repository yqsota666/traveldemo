Page({
  data: {
    imageList: [
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
    ]
  },

  handleConsultTap() {
    wx.navigateTo({
      url: "/pages/im/index?source=travelDetail"
    });
  }
});
