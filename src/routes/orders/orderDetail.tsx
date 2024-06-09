import React, { Component } from 'react';
import { Row, Col } from 'antd';
// import { Link } from "dva/router";
import ImgWraper from 'components/common/imgWraper';
import './OrderDetail.css';
interface Props {
  match?: any;
}

interface State {
  orderDetail: any;
  loading: boolean;
}

class OrderDetail extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {
      },
      loading: true
    };
  }

  componentDidMount() {
    this.getOrderDetail();
  }

  getOrderDetail = async () => {
    const { orderId } = this.props.match.params;
    const url = `${window.$api.order.getOrderDetail}/${orderId}`;
    
    window.$http.get(url)
      .then(res => {
        console.log(res);
        if (res) {
          this.setState({
            orderDetail: res,
            loading: false
          });
        }
      })
      .catch(err => {
        window.$commonErrorHandler(url)(err);
        this.setState({ loading: false });
      });
  }
  
   

  render() {
    const { orderDetail, loading } = this.state;
    if (loading) {
      return <div>加载中...</div>;
    }

    return (
      <div className="order-detail">
        <div className="order-status">
          <h4>等待发货</h4>
        </div>
        <div className="order-section">
          <div className="order-address">
            <div className="address-title">大梨 18033441849</div>
            <div className="address-detail">广东省 深圳市 福田区 东海花园</div>
          </div>
          <div className="divider"></div>
          <div className="order-product">
            <h4>商品信息</h4>
            <Row>
              <Col span={6}>
                {orderDetail && (
                  <ImgWraper
                    style={{ width: '100px', height: '100px' }}
                    src={orderDetail.productImage || require('assets/img/default-good.jpg')}
                    alt={'商品'}
                    data-errorimgsrc={require('assets/img/default-good.jpg')}
                  />
                )}
              </Col>
              <Col span={18}>
                <p>{orderDetail.productName}</p>
                <p>{orderDetail.productDescription}</p>
                <p>¥{orderDetail.productPrice} x {orderDetail.productNum}</p>
              </Col>
            </Row>
          </div>
          <div className="divider"></div>
          <div className="order-info">
            <h4>订单信息</h4>
            <p>商品合计：¥{orderDetail.orderMoney}</p>
            
            <p>实付款：¥{orderDetail.orderMoney}</p>
            <p>订单编号：{orderDetail.orderId}</p>
            <p>创建时间：{orderDetail.createTime}</p>
            <p>支付方式：{orderDetail.paymentMethod}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderDetail;
