const STORAGE_KEYS = {
  TOKEN: "travel_token",
  REFRESH_TOKEN: "travel_refresh_token",
  EXPIRES_AT: "travel_expires_at"
};

function saveSession(session) {
  if (!session) {
    return;
  }
  wx.setStorageSync(STORAGE_KEYS.TOKEN, session.token || "");
  wx.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken || "");
  wx.setStorageSync(STORAGE_KEYS.EXPIRES_AT, session.expires || "");
}

function getToken() {
  return wx.getStorageSync(STORAGE_KEYS.TOKEN) || "";
}

function getRefreshToken() {
  return wx.getStorageSync(STORAGE_KEYS.REFRESH_TOKEN) || "";
}

function clearSession() {
  wx.removeStorageSync(STORAGE_KEYS.TOKEN);
  wx.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN);
  wx.removeStorageSync(STORAGE_KEYS.EXPIRES_AT);
}

function isLoggedIn() {
  return !!getToken();
}

module.exports = {
  saveSession,
  getToken,
  getRefreshToken,
  clearSession,
  isLoggedIn
};

