import React from "react";
import { useNavigate } from "react-router-dom";
import "./DexPage.css";

import backArrow from "../assets/imgs/backArrow.png";
import blackBananaImg from "../assets/imgs/BlackBanana.png";

function DexPage({
  score,
  vanana,
  bananaList,
  equippedBanana,
  onBananaClick,
  modalOpen,
  modalBananaIdx,
  onEquip,
  onUnequip,
  onModalClose,
}) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const isUnlocked = modalBananaIdx !== null && vanana[modalBananaIdx];

  return (
    <div className="page-wrapper">
      <div className="side-bar"></div>
      <div className="dex-container">
        {/* 뒤로가기 버튼 */}
        <button
          className="back-button"
          onClick={handleBackClick}
          aria-label="뒤로가기"
        >
          <img src={backArrow} alt="뒤로가기" className="back-icon" />
        </button>
        <h2 className="dex-title">바나나 도감</h2>
        <div className="dex-grid">
          {bananaList.map((banana, index) => {
            const unlocked = vanana[index];
            const equipped = equippedBanana === index && unlocked;
            return (
              <div
                key={index}
                className="dex-item"
                style={{
                  cursor: "pointer",
                  opacity: unlocked ? 1 : 0.5,
                }}
                onClick={() => onBananaClick(index)}
              >
                <div className="banana-wrapper">
                  <img
                    src={unlocked ? banana.img : blackBananaImg}
                    alt={unlocked ? banana.name : "???"}
                    className="dex-img"
                  />
                </div>
                <p>{unlocked ? banana.name : "???"}</p>
                {/* 해금된 경우에만 클릭당 증가 수 표시, 증가량이 0보다 크면 +, 아니면 그대로 표시 */}
                {unlocked && (
                  <p>
                    {banana.clickValue > 0
                      ? `+${banana.clickValue} / 클릭`
                      : `${banana.clickValue} / 클릭`}
                  </p>
                )}
                {equipped && (
                  <div
                    style={{
                      color: "#ffd700",
                      fontWeight: 600,
                      fontSize: "1.08em",
                      padding: "2px 8px",
                      marginTop: 4,
                      background: "none",
                      borderRadius: 8,
                      boxShadow: "none",
                      textShadow: `
                        0 0 2px #222,
                        0 0 4px #222,
                        1px 1px 0 #fff,
                        -1px -1px 0 #fff
                      `,
                      display: "inline-block",
                    }}
                  >
                    장착중
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="side-bar"></div>
      {/* 모달 영역 */}
      {modalOpen && modalBananaIdx !== null && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,30,30,0.5)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inherit",
          }}
          onClick={onModalClose}
        >
          <div
            className="modal-content"
            style={{
              background: "#222",
              color: "#fff",
              padding: "32px 40px",
              borderRadius: "16px",
              minWidth: "260px",
              textAlign: "center",
              position: "relative",
              fontFamily: "inherit",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              fontSize: "1.25em",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isUnlocked ? (
              <>
                {/* 해금된 바나나 정보 */}
                <h3 style={{ fontWeight: 700, fontSize: "1.3em" }}>
                  {bananaList[modalBananaIdx].name}
                </h3>
                <img
                  src={bananaList[modalBananaIdx].img}
                  alt={bananaList[modalBananaIdx].name}
                  style={{ width: 140, height: 140, margin: "20px 0" }}
                />
                {/* 증가량이 0보다 크면 +, 아니면 그대로 표시 */}
                <p style={{ margin: "10px 0" }}>
                  {bananaList[modalBananaIdx].clickValue > 0
                    ? `+${bananaList[modalBananaIdx].clickValue} / 클릭`
                    : `${bananaList[modalBananaIdx].clickValue} / 클릭`}
                </p>
                {equippedBanana === modalBananaIdx ? (
                  <button
                    onClick={onUnequip}
                    style={{
                      marginTop: 14,
                      background: "#444",
                      color: "#ffd700",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 24px",
                      fontWeight: 600,
                      fontSize: "1em",
                      cursor: "pointer",
                    }}
                  >
                    해제
                  </button>
                ) : (
                  <button
                    onClick={onEquip}
                    style={{
                      marginTop: 14,
                      background: "#ffd700",
                      color: "#222",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 24px",
                      fontWeight: 600,
                      fontSize: "1em",
                      cursor: "pointer",
                    }}
                  >
                    장착
                  </button>
                )}
              </>
            ) : (
              <>
                {/* 미해금 바나나 정보 */}
                <h3 style={{ fontWeight: 700, fontSize: "1.3em" }}>???</h3>
                <img
                  src={blackBananaImg}
                  alt="???"
                  style={{
                    width: 140,
                    height: 140,
                    margin: "20px 0",
                    opacity: 0.7,
                  }}
                />
                <p style={{ margin: "20px 0 10px 0" }}>해금되지 않았습니다.</p>
              </>
            )}
            {/* 닫기 버튼 */}
            <button
              onClick={onModalClose}
              style={{
                marginLeft: 8,
                marginTop: 18,
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 22px",
                fontWeight: 500,
                fontSize: "1em",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DexPage;
