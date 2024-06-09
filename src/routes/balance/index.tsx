import React, { PureComponent } from "react";
import { Row, Col, Input, Button, Modal } from "antd";
import { Link } from "dva/router";
import { connect } from "dva";
import event from "utils/event";
import Iconfont from "components/iconfont/index";
import './style.css'; // 导入样式文件

interface Props {
  shopCart?: any;
  dispatch?: (args) => any;
}
interface State {
  sendTime: string;
  remark: string;
}
type ReadonlyState = Readonly<State>;

@connect(({ shopCart }) => ({ shopCart }))
class Balance extends PureComponent<Props, ReadonlyState> {
  constructor(props) {
    super(props);
    this.state = {
      sendTime: "尽快",
      remark: ""
    };
  }

  componentDidMount() {
    event.on("sure-send-time", time => {
      console.log(time);
      this.setState({ sendTime: time });
    });
  }

  toPay = () => {
    Modal.confirm({
      title: '付款',
      content: '马上付款',
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.addOrder(),
      onCancel: () => console.log(1),
    });
  };

  async addOrder() {
    const { shopCart, dispatch } = this.props;
    const goodList = Object.values(shopCart.cart)
      .filter((item: any) => item.isSelect)
      .map((item: any) => {
        const { goodId, price, number } = item;
        return {
          goodId,
          price,
          number
        };
      });
    const query = {
      goodList,
      remark: this.state.remark
    };
    const url = window.$api.order.addOrder;
    const option = { loadingText: "提交中……" };
    try {
      await window.$http.post(url, { query, option });
      goodList.forEach(item => {
        dispatch({ type: "shopCart/removeFromCart", payload: item.goodId });
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }

  handleRemarkChange = (e) => {
    this.setState({ remark: e.target.value });
  };

  render() {
    const iconStyle = { fontSize: ".35rem" };
    const common = { color: "#8a8a8a" };
    const { shopCart } = this.props;
    console.log(shopCart)
    const _cart = shopCart.cart;

    const balance =
      _cart && Object.values(_cart).length
        ? Object.values(_cart).filter((item: any) => item.isSelect)
        : [];
    return (
      <div className="balance-container">
        <div className="balance">
          <div className="address-section bg-fff pd-20">
            <div className="address-title">大梨 18033441849</div>
            <div className="address-detail">
              广东省 深圳市 福田区 东海花园
            </div>
          </div>

          <div className="product-info bg-fff pd-20">
            {balance.map((item: any, idx) => {
              return (
                <div key={idx} className="pd-20">
                  <Row>
                    <Col span={6}>
                      <img src={item.productImage} alt="" style={{ width: "100px", height: "100px" }} />
                    </Col>
                    <Col span={18} className="pd-lf-20">
                      <p>{item.productName}</p>
                      <div className="flex-box flex-ju-c-bt">
                        <span>售价：¥{item.productPrice}元x{item.number}</span>
                        <span>{item.productPrice * item.number}元</span>
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>

          <div className="other-info bg-fff pd-20">
            <div className="flex-box flex-ju-c-bt h-100">
              <span>发票类型</span>
              <div className="flex-box">
                <span>不需要发票</span>
                <Iconfont name="you" {...common} size={20} />
              </div>
            </div>

            <Link to={`/sendTime`}>
              <div className="flex-box flex-ju-c-bt h-100">
                <span>送货时间</span>
                <div className="flex-box">
                  <span>{this.state.sendTime}</span>
                  <Iconfont name="you" {...common} size={20} />
                </div>
              </div>
            </Link>
          </div>

          <div className="remark-section bg-fff pd-20">
            <Input
              placeholder="填写备注信息"
              value={this.state.remark}
              onChange={this.handleRemarkChange}
            />
          </div>
        </div>
        <div className="balance-footer">
          <Row style={{ width: '100%' }}>
            <Col span={14}>
              <div className="flex-box price">
                共{shopCart.cartTotalNum}件,合计：
                {shopCart.cartTotalPrice}元
              </div>
            </Col>
            <Col span={10}>
              <Link to={`/payment`} className="submit-button">提交订单</Link>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Balance;
