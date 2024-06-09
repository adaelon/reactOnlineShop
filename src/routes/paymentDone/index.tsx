import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import './style.css'; // 导入样式文件
const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        
        <h2>支付成功</h2>
        <div className="button-group">
          <Link to="/orders">
            <Button type="primary" className="check-order-button">
              查看订单
            </Button>
          </Link>
          <Link to="/">
            <Button className="back-home-button">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
