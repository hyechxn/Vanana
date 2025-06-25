import React from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/imgs/backArrow.png";
import "./AchievementsPage.css";

const ACHIEVEMENTS = [
  {
    id: "click_100",
    name: "100번 클릭!",
    description: "버튼을 100번 클릭했습니다.",
    image: require("../assets/imgs/achv_click_100.png"),
    achieved: true,
  },
  {
    id: "minus_100",
    name: "-100점 달성!",
    description: "점수가 -100점이 되었습니다.",
    image: require("../assets/imgs/achv_minus_100.png"),
    achieved: false,
  },
  // ...추가 업적...
];

function AchievementsPage({ achievements, getAchievementProgress }) {
  const navigate = useNavigate();

  return (
    <div className="achievements-root">
      <div className="achievements-side" />
      <div className="achievements-main">
        <img
          src={backArrow}
          alt="뒤로가기"
          className="achievements-back-img"
          onClick={() => navigate(-1)}
        />
        <div className="achievements-title">
          업적
        </div>
        <div className="achievements-list-vertical">
          {achievements.map((achv, idx) => (
            <div className="achievement-row-wide" key={achv.id}>
              <img
                className="achievement-img-wide"
                src={achv.image}
                alt={achv.achieved ? achv.name : "???"}
                style={{
                  filter: achv.achieved ? "none" : "grayscale(0.8) opacity(0.6)",
                }}
              />
              <div className="achievement-info-wide">
                <div className="achievement-name-wide">
                  {achv.achieved ? achv.name : "???"}
                  {achv.achieved && (
                    <span style={{ color: "#e3c800", marginLeft: 8, fontWeight: 600 }}>
                      (달성)
                    </span>
                  )}
                </div>
                <div className="achievement-desc-wide">
                  {achv.achieved ? achv.description : "???"}
                </div>
                <div className="achievement-progress-row">
                  <span>
                    진행도: {getAchievementProgress ? getAchievementProgress(achv) : 0}%
                  </span>
                  <div className="achievement-progress-bar-container">
                    <div
                      className="achievement-progress-bar"
                      style={{
                        width: `${getAchievementProgress ? getAchievementProgress(achv) : 0}%`,
                        background: achv.achieved ? "#e3c800" : "#bdbdbd",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="achievements-side" />
    </div>
  );
}

export default AchievementsPage;