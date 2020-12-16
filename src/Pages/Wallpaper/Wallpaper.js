import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { WORKS, WALLPAPER, DISCOVERTABLIST, TOKEN } from "../../config";
import TopCreator from "./Components/TopCreator";
import DiscoverTagList from "./Components/DiscoverTagList";
import DiscoverColorList from "./Components/DiscoverColorList";
import DiscoverTypeList from "./Components/DiscoverTypeList";
import Slide from "./Components/Slide";
import "./Wallpaper.scss";

const Wallpaper = () => {
  const [menuTabActiveId, setMenuTabActiveId] = useState(1);
  const [editorsPickTagActive, setEditorsPickTagActive] = useState(1);
  const [discoverTabActive, setDiscoverTabActive] = useState(1);
  const [editorsPickTagList, setEditorsPickTagList] = useState([]);
  const [editorsPickSlides, setEditorsPickSlides] = useState([]);
  const [topCreators, setTopCreators] = useState([]);

  useEffect(() => {
    fetch(`${WALLPAPER}/editorpick`)
      .then((res) => res.json())
      .then((res) => {
        setEditorsPickTagList(res.editorsPickData.TagList);
        setEditorsPickSlides(res.editorsPickData.Slides);
        setEditorsPickTagActive(res.editorsPickData.TagList[0].id);
      });

    if (!TOKEN) {
      fetch(`${WALLPAPER}/topcreators`)
        .then((res) => res.json())
        .then((res) => {
          setTopCreators(res.topCreators);
        });
    } else {
      fetch(`${WALLPAPER}/topcreators`, {
        headers: {
          Authorization: TOKEN,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setTopCreators(res.topCreators);
        });
    }
  }, []);

  const [discoverType, setDiscoverType] = useState({
    filter: "태그별",
    sortCurrent: "인기순",
    sort: "인기순",
  });
  const [cardViewList, setCardViewList] = useState([]);
  const [discoverTags, setDiscoverTags] = useState([]);
  const [discoverTagActive, setDiscoverTagActive] = useState(0);
  const [sortDropdown, setSortDropdown] = useState(false);

  useEffect(() => {
    axios.get(`${WALLPAPER}/cardlist?sort=${discoverType.filter}&order=${discoverType.sort}`)
      .then(res => {
        setCardViewList(res.data.discoverTagData.cardViewList);
        setDiscoverTags(res.data.discoverTagData.tagList);
        setDiscoverTagActive(res.data.discoverTagData.tagList[0].id);
      })
      .catch(err => {
        console.log(err.response);
      }
    );
  }, []);

  const handleClickTagItem = (id) => {
    axios.get(`${WALLPAPER}/cardlist?sort=${discoverType.filter}&id=${id}&order=${discoverType.sortCurrent}`)
      .then(res => {
        setCardViewList(res.data.discoverTagData.cardViewList);
        setDiscoverTagActive(id);
        setDiscoverType.sort("인기순");
      })
      .catch(err => {
        console.log(err.response);
    });
  }

  const handleClickOrder = (name) => {
    axios.get(`${WALLPAPER}/cardlist?sort=${discoverType.filter}&order=${name}&id=${discoverTagActive}`)
      .then(res => {
        setCardViewList(res.data.discoverTagData.cardViewList);
        setDiscoverType.sort(name);
      })
      .catch(err => {
        console.log(err.response);
    });
  };

  console.log(discoverType.sort);

  const handleClickEditorPickTag = (id) => {
    fetch(`${WALLPAPER}/editorpick?tag=${id}`)
      .then((res) => res.json())
      .then((res) => {
        setEditorsPickTagActive(id);
        setEditorsPickSlides(res.editorsPickData.Slides);
      });
  };

  const handleClickFollow = (id) => {
    const index = topCreators.findIndex((topCreators) => topCreators.id === id);
    const selected = topCreators[index];
    const nextTopCreator = [...topCreators];

    if (!TOKEN) {
      alert("로그인을 해주세요.");
    } else {
      fetch(`${WORKS}/follow`, {
        method: "post",
        headers: {
          Authorization: TOKEN,
        },
        body: JSON.stringify({
          creator_id: id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          nextTopCreator[index] = {
            ...selected,
            followBtn: res.data.followBtn,
          };

          setTopCreators(nextTopCreator);
        });
    }
  };

  const handleClickDiscoverTab = (id) => {
    setDiscoverTabActive(id);
    setMenuTabActiveId(id);
  };

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  const menuTabObj = {
    1: (
      <DiscoverTagList
        discoverType={discoverType}
        cardViewList={cardViewList}
        discoverTags={discoverTags}
        discoverTagActive={discoverTagActive}
        sortDropdown={sortDropdown}
        setSortDropdown={setSortDropdown}
        handleClickTagItem={handleClickTagItem}
        handleClickOrder={handleClickOrder}
      />
    ),
    2: <DiscoverColorList />,
    3: <DiscoverTypeList />,
  };

  const editorsPickSlideList = editorsPickSlides.map(
    ({
      wallpaper_id,
      wallpaperSrc,
      wallpaperUrl,
      subject,
      profileImgSrc,
      name,
      downloadNum,
      downloadSrc,
    }) => (
      <Slide
        key={wallpaper_id}
        wallpaper_id={wallpaper_id}
        wallpaperSrc={wallpaperSrc}
        wallpaperUrl={wallpaperUrl}
        subject={subject}
        profileImgSrc={profileImgSrc}
        name={name}
        downloadNum={downloadNum}
        downloadSrc={downloadSrc}
      />
    )
  );

  const topCreatorList =
    topCreators &&
    topCreators.map(({ id, user_name, profile_image_url, followBtn }) => (
      <TopCreator
        key={id}
        id={id}
        user_name={user_name}
        profile_image_url={profile_image_url}
        followBtn={followBtn}
        handleClickFollow={handleClickFollow}
      />
    ));

  return (
    <div className="Wallpaper">
      <main>
        <article className="editorsPick">
          <div className="container">
            <h2 className="mainTit">
              Editor&#39;s Pick
              <ul className="tagList clearFix">
                {editorsPickTagList.map((tag) => (
                  <li
                    key={tag.id}
                    className={editorsPickTagActive === tag.id ? "active" : ""}
                  >
                    <button
                      onClick={() => {
                        handleClickEditorPickTag(tag.id);
                      }}
                    >
                      {tag.name}
                    </button>
                  </li>
                ))}
              </ul>
            </h2>
            <Slider {...settings} className="slideWrap">
              {editorsPickSlideList}
            </Slider>
          </div>
        </article>
        <article className="topCreators">
          <div className="container">
            <h2 className="mainTit">Top Creators</h2>
            <ul>{topCreatorList}</ul>
          </div>
        </article>
        <article className="discover">
          <div className="container">
            <h2 className="mainTit">
              Discover
              <ul className="categoryType clearFix">
                {DISCOVERTABLIST.map((tab) => (
                  <li
                    key={tab.id}
                    className={discoverTabActive === tab.id ? "active" : ""}
                  >
                    <button
                      onClick={() => {
                        handleClickDiscoverTab(tab.id);
                      }}
                    >
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </h2>
          </div>
          {menuTabObj[menuTabActiveId]}
        </article>
      </main>
    </div>
  );
};

export default Wallpaper;
