import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import CardViewItem from "../../../Components/Wallpaper/CardViewItem";
import DiscoverCardViewOrder from "./DiscoverCardViewOrder";

const DiscoverTagList = ({
    discoverType, 
    cardViewList, 
    discoverTags, 
    discoverTagActive, 
    handleClickTagItem, 
    handleClickOrder, 
    sortDropdown, 
    setSortDropdown
  }) => {
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
                      setSortDropdown(!sortDropdown)
                    }}
                    className={sortDropdown ? "active" : ""}
                  >
                    {discoverType.sort}
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
};

export default DiscoverTagList;
