import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'dva/router';
import ImgWraper from 'components/common/imgWraper';

interface Props {
  order: any;
}

export default class OrderItem extends Component<Props> {
  render() {
    const { order } = this.props;
    return (
      <div className="order-item bg-fff pd-20">
        <Link to={`/orderDetail/${order.orderId}`}>
          <Row>
            <Col span={7}>
              <ImgWraper
                style={{ width: '1.5rem', height: '1.5rem' }}
                src={order.productImage}
                alt={'商品'}
                data-errorimgsrc={require('assets/img/default-good.jpg')}
              />
            </Col>
            <Col span={12}>
              <div>
                <p>{order.productName}</p>
                <p className="good-itm-p-2">订单创建时间: {order.createTime}</p>
              </div>
            </Col>
            <Col span={5}>
              <div>
                <span>¥{order.orderMoney * order.productNum}</span>
              </div>
            </Col>
          </Row>
        </Link>
      </div>
    );
  }
}
