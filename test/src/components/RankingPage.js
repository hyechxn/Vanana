import React from "react";
import { useNavigate } from "react-router-dom";
import "./RankingPage.css";
import backArrow from "../assets/imgs/backArrow.png";

function RankingPage({ userName, score, ranking }) {
  const navigate = useNavigate();

  // 랭킹 데이터가 없으면 빈 배열
  const rankingList = ranking || [];

  // 내 랭크 찾기 (displayName 또는 name 필드 모두 비교)
  const myRank = rankingList.findIndex(
    r =>
      (r.name && r.name === userName) ||
      (r.displayName && r.displayName === userName)
  );

  // 내 이름과 비교 함수
  const isMe = r =>
    (r.name && r.name === userName) ||
    (r.displayName && r.displayName === userName);

  return (
    <div className="page-wrapper">
      <div className="side-bar"></div>
      <div
        className="ranking-center"
        style={{
          borderLeft: "none",
          borderRight: "none",
          background: "#e3c800"
        }}
      >
        {/* 뒤로가기 버튼 */}
        <button
          className="back-button"
          onClick={() => navigate("/")}
          aria-label="뒤로가기"
        >
          <img src={backArrow} alt="뒤로가기" className="back-icon" />
        </button>
        <h2 className="dex-title">랭킹</h2>
        {/* 상위 3등 */}
        <div className="ranking-top3">
          {/* 2등 */}
          <div className="ranking-top3-box second">
            <div style={{ fontWeight: "bold", fontSize: 18, marginTop: 8 }}>2</div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>{rankingList[1]?.name || rankingList[1]?.displayName}</div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>{rankingList[1]?.score}</div>
          </div>
          {/* 1등 */}
          <div className="ranking-top3-box first">
            <div style={{ fontWeight: "bold", fontSize: 22, marginTop: 8 }}>1</div>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{rankingList[0]?.name || rankingList[0]?.displayName}</div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>{rankingList[0]?.score}</div>
          </div>
          {/* 3등 */}
          <div className="ranking-top3-box third">
            <div style={{ fontWeight: "bold", fontSize: 18, marginTop: 8 }}>3</div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>{rankingList[2]?.name || rankingList[2]?.displayName}</div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>{rankingList[2]?.score}</div>
          </div>
        </div>
        {/* 랭킹 테이블 */}
        <div className="ranking-table-wrap">
          <table className="ranking-table">
            <tbody>
              {rankingList.map((r, i) => (
                <tr key={i} className={isMe(r) ? "me" : ""}>
                  <td style={{ width: 40 }}>{i + 1}</td>
                  <td>
                    {isMe(r) && (
                      <span className="ranking-me-badge">me</span>
                    )}
                    {r.name || r.displayName}
                  </td>
                  <td style={{ width: 60 }}>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 내 순위 표시 */}
        {myRank > 2 && (
          <div className="ranking-my-rank">
            내 순위: {myRank + 1}위 / {rankingList.length}명
          </div>
        )}
      </div>
      <div className="side-bar"></div>
    </div>
  );
}

export default RankingPage;