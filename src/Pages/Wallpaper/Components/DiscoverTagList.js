import React, { Component } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { WALLPAPER } from "../../../config";
import CardViewItem from "../../../Components/Wallpaper/CardViewItem";
import DiscoverCardViewOrder from "./DiscoverCardViewOrder";

const LIMIT = 9;

class DiscoverTagList extends Component {
  constructor() {
    super();
    this.state = {
      discoverSort: "태그별",
      discoverOrderCurrent: "인기순",
      discoverOrder: "인기순",
      cardViewList: [],
      discoverTags: [],
      discoverTagId: 0,
      discoverTagActive: 1,
      orderActive: false,
      cardDataOrder: 0,
      timeSet: false,
    };
  }

  componentDidMount() {
    const { discoverSort, discoverOrder, cardDataOrder } = this.state;
    const { infiniteScroll } = this;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrder}&limit=${LIMIT}&offset=${cardDataOrder}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverTagData.cardViewList,
          discoverTags: res.discoverTagData.tagList,
          discoverTagActive: res.discoverTagData.tagList[0].id,
          cardDataOrder: cardDataOrder + LIMIT,
        });
      });

    window.addEventListener("scroll", infiniteScroll);
  }

  componentWillUnmount() {
    const { infiniteScroll } = this;
    window.removeEventListener("scroll", infiniteScroll);
  }

  handleClickTagItem = (id) => {
    const { discoverSort, discoverOrderCurrent } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&id=${id}&order=${discoverOrderCurrent}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          discoverTagActive: id,
          cardViewList: res.discoverTagData.cardViewList,
          discoverOrder: "인기순",
        });
      });
  };

  handleClickOrder = (name) => {
    const { discoverSort, discoverTagActive } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${name}&id=${discoverTagActive}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: res.discoverTagData.cardViewList,
          discoverOrder: name,
        });
      });
  };

  infiniteScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight * 0.95 &&
      !this.state.timeSet
    ) {
      this.setState({ timeSet: true });
      this.getCardData();
    }
  };

  getCardData = () => {
    const { discoverTagActive } = this.state;

    const {
      cardViewList,
      discoverOrder,
      discoverSort,
      cardDataOrder,
    } = this.state;

    fetch(
      `${WALLPAPER}/cardlist?sort=${discoverSort}&order=${discoverOrder}&limit=${LIMIT}&offset=${cardDataOrder}&id=${discoverTagActive}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          cardViewList: cardViewList.concat(res.discoverTagData.cardViewList),
          cardDataOrder: cardDataOrder + LIMIT,
          timeSet: false,
        });
      });
  };

  render() {
    const {
      discoverTags,
      cardViewList,
      discoverTagActive,
      discoverOrder,
      orderActive,
    } = this.state;

    const { handleClickTagItem, handleClickOrder } = this;

    return (
      <div className="DiscoverTagList discoverCardListStyle">
        <div className="container">
          <ul className="tagItems clearFix">
            {discoverTags.map((tag) => (
              <li
                key={tag.id}
                className={discoverTagActive === tag.id ? "active" : ""}
              >
                <button
                  onClick={() => {
                    handleClickTagItem(tag.id);
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

export default DiscoverTagList;
