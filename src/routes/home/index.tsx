import React, { PureComponent } from "react";
//公共组件
import WithFooter from "components/hocs/withFooter";

// 首页组件
import SearchBar from "./components/searchBar";
import Banner from "components/common/banner";
import Notice from "./components/notice";
import HostList from "./components/hot/hotList";
import RecomList from "./components/recommend/recomList";
import tool from "utils/tool";
import IconRow from "./components/IconRow";
import Footer from "components/common/footer";

// import { Map, is } from "immutable";
interface State {
  imgList: { imgId: string; url: string; }[];
  hotGoods: any[];
  searchStyle: any;
}
type ReadonlyState = Readonly<State>;

//虽然在componentWillUnmount中清除事件监听,但setState没有立刻停止，该变量可用于做每次setState的前提条件
let lock = false;
const searchBarStyle = {
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 1000,
};
const bannerContainerStyle = {
  
  marginTop: "110px", // 确保 Banner 不被固定的 SearchBar 遮挡
  paddingTop: "20px",
};

const data= [
  {
    "imgId": "4a70537c-6cd1-495e-8b13-70548da91bf5",
    "url": "https://img12.360buyimg.com/da/jfs/t5797/279/6185168007/119076/6e369e95/59787d0aN3fbecf7f.jpg"
  },
  {
    "imgId": "e7b53542-1599-4a10-b372-d85a393b00b5",
    "url": "https://img11.360buyimg.com/da/jfs/t6940/65/941243124/104588/c177e6ef/597bde18N65ee0ca3.jpg"
  },
  {
    "imgId": "d3e7ac4a-f88b-4f28-91d9-6467705a5fc1",
    "url": "https://img30.360buyimg.com/da/jfs/t5620/224/8479020426/92719/8cfa606e/597b00e2N6226433c.jpg"
  },
  {
    "imgId": "0ffedb8f-a5f9-4ce5-bbd6-f9ea19ae6ec1",
    "url": "https://img10.360buyimg.com/da/jfs/t5893/278/8441362673/94318/e243635f/597b1a37Na89e3b6c.jpg"
  }
] 
@WithFooter
class Home extends PureComponent<{}, ReadonlyState> {
  // static lock
  constructor(props) {
    super(props);
    this.state = {
      imgList: [],
      hotGoods: [],
      searchStyle: {}
    };
  }
  

  componentDidMount() {
    this.getHomeImgList();
    this.getHotGoods();
    window.addEventListener("scroll", e => {
      this.changeSearchStyle(e);
    });
  }

  async componentWillUnmount() {
    lock = true;
    window.removeEventListener("scroll", e => {
      this.changeSearchStyle(e);
    });
  }
  async getHomeImgList() {
    const url = window.$api.banner.getHomeBanner;
    try {
      const res = await window.$http.get(url);
      console.log(res)
      this.setState({
        imgList: data
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }
  changeSearchStyle(e) {
    const fn = () => {
      if (!lock) {
        const scroTop = document.documentElement.scrollTop;
        if (scroTop > 20) {
          this.setState({
            searchStyle: {
              background: "rgba(72,173,252," + (1 * scroTop) / 200 + ")",
              lineHeight: "1rem"
            }
          });
        } else {
          const _c = {
            top: "0",
            background: "transparent"
          };
          // const map1 = Map(_c);
          // const map2 = Map(this.state.searchStyle);
          // //用 immutable 比较两个对象值是否一致，比深度遍历高效
          // if (is(map1, map2)) {
          //   return;
          // }
          if (tool.checkIfEual(this.state.searchStyle, _c)) {
            return;
          }
          this.setState({
            searchStyle: _c
          });
        }
      }
    };
    //节流
    tool.throttle(fn, 50)();
  }
  async getHotGoods() {
    const url = window.$api.good.getHotGoods;
    try {
      const res = await window.$http.get(url);
      console.log(res)
      this.setState({
        hotGoods: res.data
      });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }
  render() {
    const styleObj1 = {
      position: "relative",
      top: "-.8rem"
    };
    const { searchStyle, imgList, hotGoods } = this.state;
    return (
      <div style={styleObj1 as React.CSSProperties} id="home" ref="home">
        
        <div className="home-search-container" style={{ ...searchStyle, ...searchBarStyle }}>
          <SearchBar />
        </div>
        <div className="banner-container" style={bannerContainerStyle}>
          <Banner imgList={imgList} />
        </div>
        <IconRow />
        <div className="hr" />
        <div className="content">
          <HostList hotGoods={hotGoods} />
          <div className="hr" />
          <RecomList titleText="最新商品" />
        </div>
        
      </div>
    );
  }
}
export default Home;
