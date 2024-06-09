import React, { PureComponent } from "react";
import { Toast, Tabs, Modal, Button } from "antd-mobile";
import { connect } from "dva";
// 公共组件
import Banner from "components/common/banner";
import Comments from "./components/comments";
import GoodFooter from "./components/goodFooter";
import Iconfont from "components/iconfont/index";
import './style.css'; // 导入样式文件

interface Props {
  match?: any;
  dispatch?: any;
}
interface State {
  imgList: string[];
  detailList: string[];
  goodInfo: any;
  isCollect: boolean;
  showModal: boolean;
  selectedColor: string;
  selectedSize: string;
}
type ReadonlyState = Readonly<State>;

class GoodDetail extends PureComponent<Props, ReadonlyState> {
  constructor(props) {
    super(props);
    this.state = {
      imgList: [""],
      detailList: [""],
      goodInfo: null,
      isCollect: false,
      showModal: false,
      selectedColor: "",
      selectedSize: ""
    };
  }

  componentDidMount() {
    // 获取上一个路由传参
    const { goodId } = this.props.match.params;
    this.getGoodInfo(goodId);
  }

  async getGoodInfo(goodId) {
    const params = { goodId };
    const url = window.$api.good.getGoodById;
    try {
      const res = await window.$http.get(url, { params });
      this.setState({
        goodInfo: res,
        imgList: [res.productImage],
        detailList: [res.productImage],
        isCollect: true
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }

  // 是否收藏商品
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
      this.setState({ isCollect: !this.state.isCollect });
      Toast.success(this.state.isCollect ? "收藏成功!" : "取消收藏!");
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  };

  // 显示样式选择弹窗
  showModal = () => {
    console.log("嗯了")
    this.setState({ showModal: true });
  };

  // 隐藏样式选择弹窗
  hideModal = () => {
    this.setState({ showModal: false });
  };

  // 选择颜色
  selectColor = (color) => {
    this.setState({ selectedColor: color });
  };

  // 选择尺码
  selectSize = (size) => {
    this.setState({ selectedSize: size });
  };

  render() {
    const tabs = [{ title: "商品详情" }, { title: "商品评论" }];
    const { goodInfo, imgList, detailList, isCollect, showModal, selectedColor, selectedSize } = this.state;
    const colors = ["千人购买 0843蓝色#现货", "0843粉色#现货", "0844小丑鱼#现货", "0845鼻涕猪#现货", "帕恰狗短裤#现货", "美乐蒂短裤#现货", "玉桂狗短裤#现货", "KT猫短裤#现货", "小鸡短裤【可拉伸】#现货", "蓝色大象[短裤+短袖]#现货", "粉色大象[短裤+短袖]#现货", "蓝色大象长裤#现货", "粉色大象长裤#现货"];
    const sizes = ["均码【建议80-150斤】", "加大码【建议150-200斤】"];

    if (!goodInfo) {
      return null;
    }
    return (
      <div>
        <div className="good-detail">
          <Banner imgList={imgList} />
          
          <div className="bg-fff detail-text">
            <p className="p-1">{goodInfo.productName}</p>
            <p className="flex-box flex-ju-c-bt">
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
          <Button onClick={this.showModal}>选择样式</Button>
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

        <Modal
          visible={showModal}
          transparent
          maskClosable={false}
          onClose={this.hideModal}
          title="选择样式"
         
          className="custom-modal" 
          footer={[{ text: '确定', onPress: () => { console.log('ok'); this.hideModal(); } }]}
        >
          <div className="modal-content"> {/* 添加一个包裹层用于控制宽度 */}
            <h5>颜色分类</h5>
            <div className="color-section">
              {colors.map((color, idx) => (
                <div key={idx} className={`color-item ${selectedColor === color ? 'selected' : ''}`} onClick={() => this.selectColor(color)}>
                  {color}
                </div>
              ))}
            </div>
            <h5>尺码</h5>
            <div className="size-section">
              {sizes.map((size, idx) => (
                <div key={idx} className={`size-item ${selectedSize === size ? 'selected' : ''}`} onClick={() => this.selectSize(size)}>
                  {size}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default GoodDetail;
