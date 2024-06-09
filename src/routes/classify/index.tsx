import React, { PureComponent } from "react";
// 公共组件
import WithFooter from "components/hocs/withFooter";
import "./style.css"; // 引入自定义的CSS文件

interface Props {
  history?: any;
}

interface State {
  categories: any[];
  selectedCategory: number | null;
}

type ReadonlyState = Readonly<State>;

@WithFooter
class Cateify extends PureComponent<Props, ReadonlyState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategory: null,
    };
  }

  componentDidMount() {
    this.getCates();
  }

  async getCates() {
    const url = window.$api.category.getCates;
    try {
      const res = await window.$http.get(url);
      console.log(res)
      const categories = res.list;
      this.setState({ categories });
    } catch (err) {
      window.$commonErrorHandler(url)(err);
    }
  }

  selectCategory = (categoryId: number) => {
    this.setState({ selectedCategory: categoryId });
  };

  toGooddetail = (goodId: string) => {
    this.props.history.push({
      pathname: `/goodDetail/${goodId}`,
    });
  };

  render() {
    const { categories, selectedCategory } = this.state;
    const level1Categories = categories.filter(
      (cate) => cate.catLevel === 1
    );
    const level2Categories = categories.filter(
      (cate) => cate.catLevel === 2 && cate.parentCid === selectedCategory
    );

    return (
      <div className="classify-container">
        <div className="classify-sidebar">
          {level1Categories.map((cate) => (
            <div
              key={cate.catId}
              className={`sidebar-item ${
                selectedCategory === cate.catId ? "active" : ""
              }`}
              onClick={() => this.selectCategory(cate.catId)}
            >
              {cate.name}
            </div>
          ))}
        </div>
        <div className="classify-content">
          {selectedCategory && (
            <div>
              {level2Categories.map((cate) => (
                <div key={cate.catId} className="category-block">
                  <h4 className="category-title">{cate.name}</h4>
                  {/* 假设每个二级分类下有商品列表 */}
                  <div className="goods-list">
                    {/* 使用示例商品数据 */}
                    <div
                      className="goods-item"
                      onClick={() => this.toGooddetail(String(1))} // 示例商品ID
                    >
                      <img
                        className="goods-image"
                        src="https://via.placeholder.com/150"
                        alt="商品示例"
                      />
                      <p>商品名称</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Cateify;
