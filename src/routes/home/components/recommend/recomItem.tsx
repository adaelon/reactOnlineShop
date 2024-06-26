import React, { Component } from 'react';
import { Link } from 'dva/router';
import ImgWraper from 'components/common/imgWraper';
import WithLoadable from 'components/hocs/WithLoadable';

interface Props {
  good: any;
}
export default class RecomItem extends Component<Props> {
  render() {
    const { good } = this.props;
    /**
     * 鼠标移动到商品时 预加载商品详情页
     */
    const LoadableComponent = WithLoadable({
      loader: () => import('routes/goodDetail')
    });
    return (
      <div
        className="home-good-item"
        onTouchStart={() => {
          LoadableComponent.preload();
        }}
      >
        <Link to={`/goodDetail/${good.imgId}`}>
          <div className="flex-box flex-ver-box">
            <ImgWraper
              className="good-item-img"
              data-errorimgsrc={require('assets/img/default-good.jpg')}
              src={good.productImage}
            />
            <div className="flex-box flex-ver-box flex-al-st good-item-text">
              <p className="good-itm-p-1  ">{good.productName}</p>
              <p className="price">¥{good.productPrice}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
