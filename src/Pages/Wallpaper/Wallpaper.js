import React, { Component } from "react";
import Slider from "react-slick";
import { TOKEN, WORKS, WALLPAPER, DISCOVERTABLIST } from "../../config";
import TopCreator from "./Components/TopCreator";
import DiscoverTagList from "./Components/DiscoverTagList";
import DiscoverColorList from "./Components/DiscoverColorList";
import DiscoverTypeList from "./Components/DiscoverTypeList";
import Slide from "./Components/Slide";
import "./Wallpaper.scss";

const menuTabObj = {
  1: <DiscoverTagList />,
  2: <DiscoverColorList />,
  3: <DiscoverTypeList />,
};

class Wallpaper extends Component {
  constructor() {
    super();
    this.state = {
      menuTabActiveId: 1,
      editorsPickTagActive: 1,
      topCreatorsActive: 1,
      discoverTabActive: 1,
      editorsPickTagList: [],
      editorsPickSlides: [],
      topCreators: [],
    };
  }

  componentDidMount() {
    fetch(`${WALLPAPER}/editorpick`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          editorsPickTagList: res.editorsPickData.TagList,
          editorsPickSlides: res.editorsPickData.Slides,
          editorsPickTagActive: res.editorsPickData.TagList[0].id,
        });
      });

    if (!TOKEN) {
      fetch(`${WALLPAPER}/topcreators`)
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            topCreators: res.topCreators,
          });
        });
    } else {
      fetch(`${WALLPAPER}/topcreators`, {
        headers: {
          Authorization: TOKEN,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            topCreators: res.topCreators,
          });
        });
    }
  }

  handleClickFollow = (id) => {
    const { topCreators } = this.state;
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
          this.setState({
            topCreators: nextTopCreator,
          });
        });
    }
  };

  handleClickEditorPickTag = (id) => {
    fetch(`${WALLPAPER}/editorpick?tag=${id}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          editorsPickTagActive: id,
          editorsPickSlides: res.editorsPickData.Slides,
        });
      });
  };

  handleClickDiscoverTab = (id) => {
    this.setState({
      discoverTabActive: id,
      menuTabActiveId: id,
    });
  };

  render() {
    const {
      editorsPickTagList,
      editorsPickSlides,
      topCreators,
      menuTabActiveId,
      editorsPickTagActive,
      discoverTabActive,
    } = this.state;

    const {
      handleClickEditorPickTag,
      handleClickDiscoverTab,
      handleClickFollow,
      handleClickUrlDownload,
    } = this;

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
          handleClickUrlDownload={handleClickUrlDownload}
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

    const slideSetting = {
      dots: false,
      arrows: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
    };

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
                      className={
                        editorsPickTagActive === tag.id ? "active" : ""
                      }
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
              <Slider {...slideSetting} className="slideWrap">
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
  }
}

export default Wallpaper;
