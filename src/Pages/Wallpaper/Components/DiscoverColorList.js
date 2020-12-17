import React, { Component } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { WALLPAPER, COLORS } from "../../../config";
import CardViewItem from "../../../Components/Wallpaper/CardViewItem";
import DiscoverCardViewOrder from "./DiscoverCardViewOrder";

class DiscoverColorList extends Component {
  constructor() {
    super();
    this.state = {
      discoverSort: "색상별",
      discoverOrderCurrent: "인기순",
      discoverOrder: "인기순",
      cardViewList: [],
      discoverColorActive: 1,
      orderActive: false,
    };
  }

  componentDidMount() {
    const { discoverSort, discoverOrder, discoverColorActive } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrder}&id=${discoverColorActive}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverColorData.cardViewList,
        });
      });
  }

  handleClickColorItem = (id) => {
    const { discoverSort, discoverOrderCurrent } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrderCurrent}&id=${id}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          discoverColorActive: id,
          cardViewList: res.discoverColorData.cardViewList,
          discoverOrder: "인기순",
        });
      });
  };

  handleClickOrder = (name) => {
    const { discoverSort, discoverColorActive } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${name}&id=${discoverColorActive}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverColorData.cardViewList,
          discoverOrder: name,
        });
      });
  };

  render() {
    const {
      cardViewList,
      discoverColorActive,
      discoverOrder,
      orderActive,
    } = this.state;
    const { handleClickColorItem, handleClickOrder } = this;
    return (
      <div className="DiscoverColorList discoverCardListStyle">
        <div className="container">
          <ul className="colorItems clearFix">
            {COLORS.map((tag) => (
              <li
                key={tag.id}
                className={discoverColorActive === tag.id ? "active" : ""}
              >
                <button
                  onClick={() => {
                    handleClickColorItem(tag.id);
                  }}
                >
                  {tag.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="wallpaperCardView">
          <div className="container">
            <div className="selectRanking">
              <ul>
                <li>
                  <h5
                    onClick={() => {
                      this.setState({ orderActive: !orderActive });
                    }}
                    className={orderActive ? "active" : ""}
                  >
                    {discoverOrder}
                    <span>
                      <IoMdArrowDropdown />
                    </span>
                  </h5>
                  <DiscoverCardViewOrder handleClickOrder={handleClickOrder} />
                </li>
              </ul>
            </div>
            <ul className="CardViewList clearFix">
              {cardViewList.map((card) => (
                <CardViewItem
                  key={card.wallpaper_id}
                  wallpaper_id={card.wallpaper_id}
                  wallpaperSrc={card.wallpaperSrc}
                  name={card.name}
                  subject={card.subject}
                  profileImgSrc={card.profileImgSrc}
                  downloadNum={card.downloadNum}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default DiscoverColorList;
