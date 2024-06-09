import React, { PureComponent } from "react";
import { Tabs } from "antd-mobile";
import OrderItem from "./components/order-item";
import ErrorBoundary from "components/common/errorBoundary";
import { connect } from "dva";
import WithFooter from "components/hocs/withFooter";
interface Order {
  orderId: number;
  orderSn: string | null;
  customerId: number;
  productErm: string | null;
  shippingUser: string | null;
  createTime: string;
  orderMoney: number;
  paymentMethod: string;
  productId: number;
  productImage: string;
  productName: string;
  productNum: number;
  productPrice: number | null;
  // other fields...
}

interface State {
  orderList: Order[];
}

interface Props {
  app?: any;
  
}
@connect(({ app }) => ({ app}))
@WithFooter
class Orders extends PureComponent<Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      orderList: []
    };
  }

  componentDidMount() {
    this.getOrders();
  }

  async getOrders() {
    const { user } = this.props.app;

    const url = `${window.$api.order.getOrders}/${user.userId}`;
    try {
      const res = await window.$http.get(url);
      console.log('res', res);
      if (!res) return;
      this.setState({
        orderList: res.data 
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }

  renderOrders(orders: Order[]) {
    if (orders.length === 0) {
      return <div>没有订单</div>;
    }
    return orders.map((order, index) => (
      <div
        key={index}
        style={{
          borderRadius: ".5rem",
          padding: " .15rem",
          boxSizing: "content-box"
        }}>
        <OrderItem key={order.orderId} order={order} />
      </div>
    ));
  }

  render() {
    const { orderList } = this.state;
    const tabs = [{ title: "未发货" }];

    const divStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "150px",
      backgroundColor: "#fff"
    };

    return (
      <div>
        <ErrorBoundary>
          <Tabs tabs={tabs} initialPage={0}>
            <div>{this.renderOrders(orderList)}</div>
          </Tabs>
        </ErrorBoundary>
      </div>
    );
  }
}

export default Orders;
