import React, { Component } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { WALLPAPER, CATEGORY } from "../../../config";
import CardViewItem from "../../../Components/Wallpaper/CardViewItem";
import DiscoverCardViewOrder from "./DiscoverCardViewOrder";

class DiscoverTypeList extends Component {
  constructor() {
    super();
    this.state = {
      discoverSort: "유형별",
      discoverOrderCurrent: "인기순",
      discoverOrder: "인기순",
      cardViewList: [],
      discoverTypes: CATEGORY,
      discoverTypeActive: 11,
      discoverTypeCategory: 11,
      orderActive: false,
    };
  }

  componentDidMount() {
    const { discoverSort, discoverOrder, discoverTypeCategory } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrder}&id=${discoverTypeCategory}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverTypeData.cardViewList,
        });
      });
  }

  handleClickTypeItem = (id) => {
    const { discoverSort, discoverOrderCurrent } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrderCurrent}&id=${id}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          discoverTypeActive: id,
          cardViewList: res.discoverTypeData.cardViewList,
          discoverOrder: "인기순",
        });
      });
  };

  handleClickOrder = (name) => {
    const { discoverSort, discoverTypeActive } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${name}&id=${discoverTypeActive}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverTypeData.cardViewList,
          discoverOrder: name,
        });
      });
  };

  render() {
    const {
      discoverTypes,
      cardViewList,
      discoverTypeActive,
      orderActive,
      discoverOrder,
    } = this.state;
    const { handleClickTypeItem, handleClickOrder } = this;
    return (
      <div className="DiscoverTypeList discoverCardListStyle">
        <div className="container">
          <ul className="tagItems clearFix">
            {discoverTypes.map((tag) => (
              <li
                key={tag.id}
                className={discoverTypeActive === tag.id ? "active" : ""}
              >
                <button
                  onClick={() => {
                    handleClickTypeItem(tag.id);
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

export default DiscoverTypeList;
