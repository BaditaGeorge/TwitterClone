const cookieStore = {};

module.exports = {
  setCookie: (key, value) => {
    cookieStore[key] = value;
  },
  getCookie: (key) => {
    return key in cookieStore ? cookieStore[key] : null;
  },
  deleteCookie: (key) => {
    delete cookieStore[key];
  },
};
