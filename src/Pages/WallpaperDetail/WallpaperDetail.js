import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { ST_URL } from "../../config";
import CardViewItem from "../../Components/Wallpaper/CardViewItem";

import "./WallpaperDetail.scss";

class WallpaperDetail extends Component {
  constructor() {
    super();
    this.state = {
      wallpaperDetailData: [],
      SimilarCardListData: [],
      wallpaperDate: "",
      themecolorId: 1,
      workId: 1,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const adr = this.props.match.params.id;
    
    fetch(`${ST_URL}/works/wallpaper/${adr}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        const date = res.wallpaperDetails.created_at;
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        const resultDate = year + "." + month + "." + day;

        this.setState(
          {
            wallpaperDetailData: res.wallpaperDetails,
            wallpaperDate: resultDate,
            themecolorId: res.wallpaperDetails.themecolor_id,
            workId: res.wallpaperDetails.work_id,
          },
          () => {
            this.changeThemeColor();
          }
        );
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getData();
    }
  }

  changeThemeColor = () => {
    const adr = this.props.location.pathname.split("/");
    const { themecolorId } = this.state;
    fetch(
      `${ST_URL}/works/wallpaper/cardlist?sort=색상별&id=${themecolorId}&wallpaper_id=${adr[2]}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          SimilarCardListData: res.discoverColorData.cardViewList,
        });
      });
  };

  render() {
    const {
      title,
      image_url,
      creator,
      views,
      downloadNum,
      tag,
    } = this.state.wallpaperDetailData;

    const { wallpaperDate, SimilarCardListData, workId } = this.state;

    return (
      <div className="WallpaperDetail">
        <main>
          <div className="container">
            <div className="imgWrap">
              <img
                src={image_url}
                className="wallpaperImg"
                alt="배경화면 이미지"
              />
            </div>
            <div className="creatorInfo">
              <h4>
                <Link to={`/DetailPages/${workId}`}>{title}</Link>
              </h4>
              <ul className="detailes">
                <li>
                  <img
                    className="profileImg"
                    src={image_url}
                    style={{
                      backgroundImage: `url(${image_url})`,
                    }}
                    alt="프로필 이미지"
                  />
                  <em className="creator">{creator}</em>
                </li>
                <li>
                  <em>{wallpaperDate}</em>
                </li>
                <li>
                  <span>조회</span>
                  <em>{views}</em>
                </li>
                <li>
                  <span>다운로드</span>
                  <em className="color">{downloadNum}</em>
                </li>
              </ul>
              <div className="btnWrap">
                <ul>
                  <li>
                    <span className="share">
                      <button>공유</button>
                    </span>
                  </li>
                  <li>
                    <span className="declaration">
                      <button>신고</button>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="tag">
                <ul className="clearFix">
                  {tag && tag.map((tag, idx) => <li key={idx}>{tag}</li>)}
                </ul>
              </div>
              <div className="copyRight">
                <p>
                  Copyright &copy; <em>{creator}</em> All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </main>
        <aside>
          <div className="container">
            <h4 className="similarTit">유사한 배경화면</h4>
            <ul className="CardViewList clearFix">
              {SimilarCardListData.map((tag) => (
                <CardViewItem
                  key={tag.wallpaper_id}
                  wallpaper_id={tag.wallpaper_id}
                  wallpaperSrc={tag.wallpaperSrc}
                  name={tag.name}
                  subject={tag.subject}
                  profileImgSrc={tag.profileImgSrc}
                  downloadNum={tag.downloadNum}
                />
              ))}
            </ul>
          </div>
        </aside>
      </div>
    );
  }
}

export default withRouter(WallpaperDetail);
