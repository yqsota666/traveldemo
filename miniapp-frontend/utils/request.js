const { getToken, getRefreshToken, saveSession, clearSession } = require("./auth");

const BASE_URL = "http://127.0.0.1:8080";
let refreshPromise = null;

function rawRequest(options) {
  const token = getToken();
  const header = Object.assign({}, options.header || {});

  if (!options.skipAuth && token) {
    header.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      timeout: options.timeout || 10000,
      header,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    });
  });
}

function extractSession(payload) {
  if (!payload || !payload.result) {
    return null;
  }
  const session = payload.result;
  if (!session.token || !session.refreshToken) {
    return null;
  }
  return {
    token: session.token,
    refreshToken: session.refreshToken,
    expires: session.expires || ""
  };
}

async function refreshToken() {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    throw new Error("refresh_token_not_found");
  }

  const res = await rawRequest({
    url: "/api/travel/auth/refresh",
    method: "POST",
    skipAuth: true,
    data: {
      refreshToken: refreshTokenValue
    }
  });

  if (res.statusCode !== 200 || !res.data || Number(res.data.status) !== 200) {
    throw new Error("refresh_failed");
  }

  const session = extractSession(res.data);
  if (!session) {
    throw new Error("refresh_payload_invalid");
  }
  saveSession(session);
}

async function request(options) {
  const response = await rawRequest(options);
  if (response.statusCode !== 401) {
    return response.data;
  }

  // 避免并发401触发多次刷新
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  try {
    await refreshPromise;
  } catch (err) {
    clearSession();
    throw err;
  }

  const retryResponse = await rawRequest(options);
  if (retryResponse.statusCode === 401) {
    clearSession();
  }
  return retryResponse.data;
}

module.exports = {
  request,
  BASE_URL
};
