const BASE_URL = "http://127.0.0.1:8080";

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      timeout: 10000,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  request
};
