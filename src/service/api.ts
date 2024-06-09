export const api:any = {
  good: {
    getGoodsByCate: "/good/cate/:cateId",
    getGoodById: "/img/find/:goodId",
    getNewGoods: "/img/findNew",
    getHotGoods: "/img/findHot",
    searchGood: "/good/searchGood",
    collectGood: "/collect/collectGood/:goodId",
    getCollectGood: "/collect/list",
    getGoodComment: "/comment/list/:goodId",
    addGoodComment: "/comment/add/:goodId"
  },
  category: {
    getCates: "/onlineshop/pmscategory/findAll"
  },
  banner: {
    getHomeBanner: "/banner/list"
  },
  user: {
    login: "/logins",
    signup: "/user/register",
    uploadAvatar: "/user/uploadAvatar"

  },
  phone: {
    bindPhone: "/sms/bindPhone",
    sendSms: "/sms/sendSms"
  },
  order: {
    getOrders: "/master/findByCustomerId/",
    addOrder: "/master/add",
    getOrderDetail: "/master/find/"
  },
  upload: "/oss/upload"
};
export default api;
