import React from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/imgs/backArrow.png";
import "./SettingsPage.css";

function SettingsPage({ userName, setUserName, onLogout, onResetData }) {
  const navigate = useNavigate();

  return (
    <div className="settings-root">
      <div className="side-bar" />
      <div className="settings-main">
        <img
          src={backIcon}
          alt="뒤로가기"
          className="settings-back-img"
          onClick={() => navigate("/")}
        />
        <div className="settings-content">
          <button
            className="settings-btn"
            onClick={onLogout}
          >
            로그아웃
          </button>
          <button
            className="settings-btn"
            onClick={onResetData}
          >
            데이터 초기화
          </button>
        </div>
      </div>
      <div className="side-bar" />
    </div>
  );
}

export default SettingsPage;