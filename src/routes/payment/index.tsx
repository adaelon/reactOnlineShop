import React, { PureComponent } from "react";
import { Row, Col, Radio, Button } from "antd";
import { Link } from "dva/router";
import { connect } from "dva";
import ImgWraper from 'components/common/imgWraper';
import WithFooter from "components/hocs/withFooter";
import Iconfont from 'components/iconfont/index';
import './style.css'; // 导入样式文件
import event from "utils/event";
interface CartItem {
    productPrice: number;
    productId: number;
    productName: string;
    productImage: string;
    number: number;
  }
  
  interface ShopCart {
    cart: { [key: string]: CartItem };
    cartTotalNum: string;
    cartTotalPrice: string;
  }
  
  interface Props {
    app?: any;
    shopCart?: ShopCart;
    dispatch?: (args) => void;
  }
@connect(({ app,shopCart }) => ({ app,shopCart }))
@WithFooter
class PaymentPage extends PureComponent<Props> {
  state = {
    paymentMethod: 'alipay'
  };

  handlePaymentChange = e => {
    this.setState({ paymentMethod: e.target.value });
  };
  removeThisGood = goodId => {
    this.props.dispatch({ type: "shopCart/removeFromCart", payload: goodId });
  };
  handlePaymentConfirm = async () => {
    
    const { user } = this.props.app;
    const { shopCart } = this.props;
    console.log(user);
    console.log(shopCart);

    const option = { loadingTxt: "支付中……" };
    const url = window.$api.order.addOrder;

    console.log(option)
    // 确保购物车对象存在并且有商品
    if (shopCart && shopCart.cart) {

      const cartItems = Object.values(shopCart.cart);
      console.log(cartItems)
      // 使用 for...of 循环处理异步操作
      for (const item of cartItems) {
        const query = {
          customerId: user.userId,
          paymentMethod: this.state.paymentMethod,
          orderMoney: item.productPrice*item.number,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          productNum: item.number,
          productPrice:item.productPrice
        };

        try {
          const res = await window.$http.post(url, { query, option });
          this.removeThisGood(item.productId)
          console.log('订单创建成功:', res);
        } catch (err) {
          window.$commonErrorHandler(url)(err);
        }
      }

      setTimeout(() => {
        window.location.reload();
      }, 0);

      console.log('确认支付:', this.state.paymentMethod);
      
    } else {
      console.error('购物车为空或未定义');
    }
  };

  render() {
    const { user} = this.props.app;
    const { shopCart} = this.props;
    const { paymentMethod } = this.state;
    return (
      <div className="payment-page">
        <h4>支付</h4>
        <div className="total-amount">支付金额 ¥{shopCart.cartTotalPrice}</div>
        <Radio.Group onChange={this.handlePaymentChange} value={paymentMethod}>
          <div className="payment-option">
            <Radio value="alipay">
              <ImgWraper
                style={{ width: '0.5rem', height: '0.5rem' }}
                src='assets/img/alipay.jpg'
                alt={'支付宝'}
                data-errorimgsrc={require('assets/img/alipay.jpg')}
              />支付宝支付
            </Radio>
          </div>
          <div className="payment-option">
            <Radio value="wechat">
              <ImgWraper
                style={{ width: '0.5rem', height: '0.5rem' }}
                src='assets/img/what-pay.jpg'
                alt={'微信'}
                data-errorimgsrc={require('assets/img/what-pay.jpg')}
              />微信支付
            </Radio>
          </div>
        </Radio.Group>
        <Link to="/paymentDone">
          <Button type="primary" className="confirm-button" onClick={this.handlePaymentConfirm}>
            确认支付
          </Button>
        </Link>
      </div>
    );
  }
}

export default PaymentPage;
