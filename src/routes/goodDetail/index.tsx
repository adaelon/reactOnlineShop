import React, { PureComponent } from "react";
import { Toast, Tabs } from "antd-mobile";
// 公共组件

import Banner from "components/common/banner";
// 组件
import Comments from "./components/comments";
import GoodFooter from "./components/goodFooter";
import Iconfont from "components/iconfont/index";
import { type } from "os";

interface Props {
  match?: any;
}
interface State {
  imgList: string[];
  detailList: string[];
  goodInfo: any;
  isCollect: boolean;
}
type ReadonlyState = Readonly<State>;
class GoodDetail extends PureComponent<Props, ReadonlyState> {
  constructor(props) {
    super(props);
    this.state = {
      imgList: [""],
      detailList: [""],
      goodInfo: null,
      isCollect: false
    };
  }
  componentDidMount() {
    //    获取上一个路由传参
    const { goodId } = this.props.match.params;
    this.getGoodInfo(goodId);
  }
  async getGoodInfo(goodId) {
    const params = { goodId };
    console.log(goodId)
    const url = window.$api.good.getGoodById;
    try {
      const res = await window.$http.get(url, { params });
      console.log(res)
      this.setState({
        goodInfo: res,
        // 在jsx中直接传goodInfo.imgList在子组件中取不到
        imgList: [res.productImage],
        detailList: [res.productImage],
        isCollect: true
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }
  //是否收藏商品
  toggleLike = async () => {
    const url = window.$api.good.collectGood;
    const { goodId } = this.props.match.params;
    const params = { goodId };
    const query = {
      isCollect: !this.state.isCollect
    };
    const loading = {
      loadingText: "正在收藏"
    };
    try {
      const res = await window.$http.post(url, { params, query, loading });
      if (!res) return;
      await this.setState({ isCollect: !this.state.isCollect });
      Toast.success(this.state.isCollect ? "收藏成功!" : "取消收藏!");
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  };
  render() {
    const tabs = [{ title: "商品详情" }, { title: "商品评论" }];
    const { goodInfo, imgList, detailList, isCollect } = this.state;
    if (!goodInfo) {
      return null;
    }
    return (
      <div>
        <div className="good-detail">
          <Banner imgList={imgList} />

          <div className="bg-fff detail-text">
            <p className="p-1">{goodInfo.productName  }</p>
            <p className="flex-box flex-ju-c-bt ">
              <span className="p-2 price">¥{goodInfo.productPrice}</span>
              <span onClick={this.toggleLike}>
                {isCollect ? (
                  <Iconfont name="aixin" color="#ff0000" />
                ) : (
                  <Iconfont name="aixin1" />
                )}
              </span>
            </p>
          </div>
          <div className="hr" />
          <div className="bg-fff">
            <Tabs tabs={tabs} initialPage={0}>
              <div>
                {detailList.map((item, idx) => {
                  return (
                    <img
                      key={idx}
                      style={{ width: "100%", height: "auto" }}
                      src={item}
                      alt=""
                    />
                  );
                })}
              </div>
              <div>
                <Comments
                  goodInfo={goodInfo}
                  rateList={goodInfo.comments && goodInfo.comments.rows}
                />
              </div>
            </Tabs>
          </div>
          <GoodFooter goodInfo={goodInfo} />
        </div>
      </div>
    );
  }
}
export default GoodDetail;