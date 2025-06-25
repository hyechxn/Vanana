import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { saveUserData, getUserData, getRanking } from "./utils/firebaseUser";
import { useNavigate, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SettingsPage from "./components/SettingsPage";
import DexPage from "./components/DexPage";
import RankingPage from "./components/RankingPage";
import AchievementsPage from "./components/AchievementsPage";

import "./App.css";
import bananaImg from "./assets/imgs/Vanana.png";
import stonenanaImg from "./assets/imgs/Stonenana.png";
import firenanaImg from "./assets/imgs/Firenana.png";
import peelnanaImg from "./assets/imgs/Peelnana.png";
import waternanaImg from "./assets/imgs/Waternana.png";
import onanaImg from "./assets/imgs/Onana.png";
import rotnanaImg from "./assets/imgs/Rotnana.png";

import blackBananaImg from "./assets/imgs/BlackBanana.png";
import rankingIcon from "./assets/imgs/Ranking.png";
import bookIcon from "./assets/imgs/Book.png";
import settingsIcon from "./assets/imgs/Setting.png";
import achievementIcon from "./assets/imgs/Achievement.png"; // 업적 아이콘 이미지 추가

const BANANA_LIST = [
  { name: "바나나", img: bananaImg, clickValue: 1 },
  { name: "돌나나", img: stonenanaImg, clickValue: 2 },
  { name: "불나나", img: firenanaImg, clickValue: 7 },
  { name: "깐나나", img: peelnanaImg, clickValue:  30},
  { name: "물나나", img: waternanaImg, clickValue: 5 },
  { name: "오나나", img: onanaImg, clickValue: 240 },
  { name: "썩나나", img: rotnanaImg, clickValue: -5 },
  { name: "???", img: onanaImg, clickValue: 24 },
];

function App() {
  // 로그인 및 로딩 상태
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [vanana, setVanana] = useState(null);
  const [equippedBanana, setEquippedBanana] = useState(null);
  const [userName, setUserName] = useState("");
  const [ranking, setRanking] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBananaIdx, setModalBananaIdx] = useState(null);
  // 알림 큐로 여러 알림을 순차적으로 처리
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  // 업적 해금 알림 중복 방지용 (알림을 로컬스토리지에 기록)
  const [shownAchievements, setShownAchievements] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shownAchievements") || "{}");
    } catch {
      return {};
    }
  });

  const achievementsData = [
    {
      id: "click_100",
      name: "100번 클릭!",
      description: "버튼을 100번 클릭했습니다.",
      image: require("./assets/imgs/achv_click_100.png"),
      achieved: false,
    },
    {
      id: "minus_100",
      name: "-100점 달성!",
      description: "점수가 -100점이 되었습니다.",
      image: require("./assets/imgs/achv_minus_100.png"),
      achieved: false,
    },
    {
      id: "score_500",
      name: "500점 돌파!",
      description: "점수가 500점을 넘었습니다.",
      image: require("./assets/imgs/achv_score_500.png"),
      achieved: false,
    },
    {
      id: "score_1000",
      name: "1000점 돌파!",
      description: "점수가 1000점을 넘었습니다.",
      image: require("./assets/imgs/achv_score_1000.png"),
      achieved: false,
    },
    {
      id: "play_time_10",
      name: "10분 플레이!",
      description: "게임을 10분 이상 플레이했습니다.",
      image: require("./assets/imgs/achv_play_time_10.png"),
      achieved: false,
    },
    {
      id: "play_time_30",
      name: "30분 플레이!",
      description: "게임을 30분 이상 플레이했습니다.",
      image: require("./assets/imgs/achv_play_time_30.png"),
      achieved: false,
    },
    {
      id: "click_1000",
      name: "1000번 클릭!",
      description: "버튼을 1000번 클릭했습니다.",
      image: require("./assets/imgs/achv_click_1000.png"),
      achieved: false,
    },
    {
      id: "minus_500",
      name: "-500점 달성!",
      description: "점수가 -500점이 되었습니다.",
      image: require("./assets/imgs/achv_minus_500.png"),
      achieved: false,
    },
  ];

  const [achievements, setAchievements] = useState(achievementsData);
  const navigate = useNavigate();

  // 로그인 상태 감지 및 Firestore에서 데이터 불러오기
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        // Firestore에서 유저 데이터 불러오기
        const data = await getUserData(firebaseUser.uid);
        // 이름 우선순위: displayName → name → "익명"
        const name =
          firebaseUser.displayName ||
          (data && (data.name || data.displayName)) ||
          "익명";
        setUserName(name);
        setScore(data?.score ?? 0);
        setVanana(data?.vanana ?? [true, false, false, false, false, false, false, false]);
        setEquippedBanana(data?.equippedBanana ?? 0);
      } else {
        // 로그아웃 시 상태를 undefined로 초기화
        setScore(undefined);
        setVanana(undefined);
        setEquippedBanana(undefined);
        setUserName("");
        setRanking([]);
      }
    });
    return () => unsub();
  }, []);

  // shownAchievements가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("shownAchievements", JSON.stringify(shownAchievements));
  }, [shownAchievements]);

  // shownAchievements 최신값을 항상 참조하기 위한 ref (최상단에서 선언)
  const shownAchievementsRef = { current: {} };

  // shownAchievements 최신값 useRef로 연결
  shownAchievementsRef.current = shownAchievements;

  // 알림 추가 함수
  const pushAlert = (alertContent, alertKey) => {
    // alertKey가 있으면 이미 보여준 알림(업적/스킨)은 중복으로 추가하지 않음 (로컬스토리지 기반)
    // 항상 최신 shownAchievementsRef.current를 참조
    if (alertKey && shownAchievementsRef.current && shownAchievementsRef.current[alertKey]) return;
    setAlertQueue((prev) => {
      // prev는 이전 큐, alertKey가 있으면 큐에 이미 있는지 확인
      if (alertKey && prev.some(a => a.key === alertKey)) return prev;
      return [...prev, { content: alertContent, key: alertKey }];
    });
  };

  // 알림 큐 처리 및 shownAchievements 기록 (업적/스킨 해금 알림 모두)
  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      const alertObj = alertQueue[0];
      setCurrentAlert(alertObj.content);
      setAlertQueue((prev) => prev.slice(1));
      // 알림이 실제로 화면에 표시될 때 shownAchievements에 기록 (업적/스킨 모두)
      if (alertObj.key) {
        setShownAchievements((prev) => ({ ...prev, [alertObj.key]: true }));
      }
    }
  }, [alertQueue, currentAlert]);

  // 알림 자동 닫기
  useEffect(() => {
    if (currentAlert) {
      const timer = setTimeout(() => setCurrentAlert(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentAlert]);

  // 바나나 해금 로직 + 해금 알림
  useEffect(() => {
    if (!user || score === null || !Array.isArray(vanana)) return;
    let changed = false;
    let newVanana = [...vanana];
    let alert = null;
    // 돌나나 해금
    if (score >= 10 && !newVanana[1]) {
      newVanana[1] = true;
      changed = true;
      alert = { name: "돌나나", idx: 1 };
    }
    // 불나나 해금
    if (score >= 300 && !newVanana[2]) {
      newVanana[2] = true;
      changed = true;
      alert = { name: "불나나", idx: 2 };
    }
    // 깐나나 해금
    if (score >= 1000 && !newVanana[3]) {
      newVanana[3] = true;
      changed = true;
      alert = { name: "깐나나", idx: 3 };
    }
    // 물나나 해금 (5% 확률)
    const numW = Math.floor(Math.random() * 20 + 1);
    if (numW === 1 && score !== 0 && !newVanana[4]) {
      newVanana[4] = true;
      changed = true;
      alert = { name: "물나나", idx: 4 };
    }
    // 오나나 해금 (0.08% 확률)
    const numO = Math.floor(Math.random() * 1250 + 1);
    if (numO === 1 && score !== 0 && !newVanana[5]) {
      newVanana[5] = true;
      changed = true;
      alert = { name: "오나나", idx: 5 };
    }
    // 썩나나 해금 (0.5% 확률)
    const numS = Math.floor(Math.random() * 200 + 1);
    if (numS === 1 && score !== 0 && !newVanana[6]) {
      newVanana[6] = true;
      changed = true;
      alert = { name: "썩나나", idx: 6 };
    }
    if (changed) {
      setVanana(newVanana);
      if (alert) {
        pushAlert(
          <>
            <img
              src={BANANA_LIST[alert.idx].img}
              alt={alert.name}
              style={{ width: 48, height: 48, verticalAlign: "middle", marginRight: 10 }}
            />
            <span style={{ fontWeight: 600 }}>{alert.name}</span>가 해금됐어요!
          </>,
          `skin_${alert.idx}`
        );
      }
    }
  }, [score, user, vanana]);
  
  // 클릭 횟수, 플레이 타임(분) 상태 추가
  const [clickCount, setClickCount] = useState(0);
  const [playMinutes, setPlayMinutes] = useState(0);

  // 최초 Firestore에서 유저 데이터 불러오기 (초기화 방지, 저장 X)
  const didInit = useRef(false);

  // Firestore에서 최초 데이터 불러오기 (새로고침시 저장 방지)
  useEffect(() => {
    if (!user || didInit.current) return;
    getUserData(user.uid).then((data) => {
      if (data) {
        if (typeof data.score === "number") setScore(data.score);
        if (Array.isArray(data.vanana)) setVanana(data.vanana);
        if (typeof data.equippedBanana === "number") setEquippedBanana(data.equippedBanana);
        if (typeof data.name === "string") setUserName(data.name);
        if (Array.isArray(data.achievements) && data.achievements.length === achievementsData.length) {
          setAchievements(data.achievements);
        }
        if (typeof data.clickCount === "number") setClickCount(data.clickCount);
        if (typeof data.playMinutes === "number") setPlayMinutes(data.playMinutes);
      }
      didInit.current = true;
    });
    // eslint-disable-next-line
  }, [user]);

  // 클릭할 때마다 Firestore에 저장
  function MainPage({
    score,
    setScore,
    bananaList,
    vanana,
    equippedBanana,
    onSettingsClick
  }) {
    const navigate = useNavigate();
    const currentBanana = bananaList[equippedBanana] || bananaList[0];

    const handleClick = () => {
      setScore((prev) => {
        const newScore = prev + currentBanana.clickValue;
        if (didInit.current && user && Array.isArray(vanana) && equippedBanana !== null) {
          saveUserData(user.uid, {
            name: userName,
            score: newScore,
            vanana,
            equippedBanana,
            achievements,
            clickCount: clickCount + 1,
            playMinutes,
          });
        }
        return newScore;
      });
      setClickCount((prev) => prev + 1);
    };

    return (
      <div className="container">
        <div className="side black"></div>
        <div className="main">
          <div className="score">{score}</div>
          <img
            src={currentBanana.img}
            alt={currentBanana.name}
            onClick={handleClick}
            className="banana"
          />
          <div className="bottom-buttons">
            {/* 도감, 랭킹, 업적, 설정 버튼 */}
            <img
              src={bookIcon}
              alt="바나나 도감"
              className="small-icon"
              onClick={() => navigate("/dex")}
            />
            <img
              src={rankingIcon}
              alt="랭킹"
              className="small-icon"
              onClick={() => navigate("/ranking")}
            />
            <img
              src={achievementIcon}
              alt="업적"
              className="small-icon"
              style={{ marginLeft: 8, cursor: "pointer" }}
              onClick={() => navigate("/achievements")}
            />
            <img
              src={settingsIcon}
              alt="설정"
              className="small-icon"
              style={{ marginLeft: 275 }}
              onClick={onSettingsClick}
            />
          </div>
        </div>
        <div className="side black"></div>
      </div>
    );
  }

  // Firestore에 저장하는 useEffect 완전히 제거
  // ...existing code...

  // 플레이 타임 측정 (1분마다 playMinutes 증가)
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      setPlayMinutes((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [user]);

  // 업적 체크 함수 (조건별로 구현)
  useEffect(() => {
    if (score == null) return;
    let changed = false;
    let newAchievements = [...achievements];
    let alertAchv = null;

    // 100번 클릭 업적
    if (!newAchievements[0].achieved && clickCount >= 100) {
      newAchievements[0].achieved = true;
      changed = true;
      alertAchv = newAchievements[0];
    }
    // -100점 달성 업적
    if (!newAchievements[1].achieved && score <= -100) {
      newAchievements[1].achieved = true;
      changed = true;
      alertAchv = newAchievements[1];
    }
    // 500점 돌파 업적
    if (!newAchievements[2].achieved && score >= 500) {
      newAchievements[2].achieved = true;
      changed = true;
      alertAchv = newAchievements[2];
    }
    // 1000점 돌파 업적
    if (!newAchievements[3].achieved && score >= 1000) {
      newAchievements[3].achieved = true;
      changed = true;
      alertAchv = newAchievements[3];
    }
    // 10분 플레이 업적
    if (!newAchievements[4].achieved && playMinutes >= 10) {
      newAchievements[4].achieved = true;
      changed = true;
      alertAchv = newAchievements[4];
    }
    // 30분 플레이 업적
    if (!newAchievements[5].achieved && playMinutes >= 30) {
      newAchievements[5].achieved = true;
      changed = true;
      alertAchv = newAchievements[5];
    }
    // 1000번 클릭 업적
    if (!newAchievements[6].achieved && clickCount >= 1000) {
      newAchievements[6].achieved = true;
      changed = true;
      alertAchv = newAchievements[6];
    }
    // -500점 달성 업적
    if (!newAchievements[7].achieved && score <= -500) {
      newAchievements[7].achieved = true;
      changed = true;
      alertAchv = newAchievements[7];
    }

    if (changed) {
      setAchievements(newAchievements);
      if (alertAchv) {
        pushAlert(
          <>
            <img
              src={alertAchv.image}
              alt={alertAchv.name}
              style={{ width: 48, height: 48, verticalAlign: "middle", marginRight: 10 }}
            />
            <span style={{ fontWeight: 600 }}>{alertAchv.name}</span> 업적을 해금했어요!
          </>,
          `achv_${alertAchv.id}`
        );
      }
    }
  }, [score, achievements, clickCount, playMinutes]);

  // 업적 상태를 Firestore에 저장/불러오기
  useEffect(() => {
    if (!user) return;
    // 불러오기
    getUserData(user.uid).then((data) => {
      if (data && Array.isArray(data.achievements) && data.achievements.length === achievements.length) {
        setAchievements(data.achievements);
      }
    });
    // eslint-disable-next-line
  }, [user]);

  // 랭킹 불러오기 (user 있을 때만)
  useEffect(() => {
    if (!user) return;
    getRanking(10).then(setRanking);
  }, [user, score]);

  // 도감 모달 핸들러
  const handleDexBananaClick = (idx) => {
    setModalBananaIdx(idx);
    setModalOpen(true);
  };
  const handleEquip = () => {
    setEquippedBanana(modalBananaIdx);
    setModalOpen(false);
  };
  const handleUnequip = () => {
    setEquippedBanana(0);
    setModalOpen(false);
  };
  const handleModalClose = () => setModalOpen(false);

  // 로그아웃 핸들러
  const handleLogout = () => {
    auth.signOut();
    // 상태를 undefined로 초기화 (null이 아닌 undefined)
    setUser(null);
    setScore(undefined);
    setVanana(undefined);
    setEquippedBanana(undefined);
    setUserName("");
    setRanking([]);
    navigate("/");
  };

  // 데이터 초기화 팝업 상태
  const [resetPopupOpen, setResetPopupOpen] = useState(false);

  // 데이터 초기화 함수 (팝업에서 실제 초기화)
  const handleResetData = async () => {
    setResetPopupOpen(true);
  };

  // 실제 초기화 실행
  const doResetData = async () => {
    if (!user) return;
    setResetPopupOpen(false);
    setScore(0);
    setVanana([true, false, false, false, false, false, false, false]);
    setEquippedBanana(0);
    setAchievements(achievementsData);
    setClickCount(0);
    setPlayMinutes(0);
    setShownAchievements({}); // 알림(업적/스킨) 표시 기록도 초기화
    await saveUserData(user.uid, {
      name: userName,
      score: 0,
      vanana: [true, false, false, false, false, false, false, false],
      equippedBanana: 0,
      achievements: achievementsData,
      clickCount: 0,
      playMinutes: 0,
    });
    navigate("/"); // 초기화 후 첫 페이지로 이동
  };

  // 팝업에서 보여줄 정보 계산
  const unlockedBananaCount = Array.isArray(vanana) ? vanana.filter(Boolean).length : 0;
  const unlockedAchievementCount = Array.isArray(achievements) ? achievements.filter(a => a.achieved).length : 0;

  // 업적 진행도 계산
  const achievementProgress =
    achievements && achievements.length > 0
      ? Math.round(
          (achievements.filter((a) => a.achieved).length / achievements.length) * 100
        )
      : 0;

  // 업적별 진행도 계산 함수
  function getAchievementProgress(achv) {
    if (achv.achieved) return 100;
    switch (achv.id) {
      case "click_100":
        return Math.min(100, Math.floor((clickCount / 100) * 100));
      case "click_1000":
        return Math.min(100, Math.floor((clickCount / 1000) * 100));
      case "score_500":
        return Math.min(100, Math.floor((score / 500) * 100));
      case "score_1000":
        return Math.min(100, Math.floor((score / 1000) * 100));
      case "minus_100":
        return Math.min(100, Math.floor((Math.abs(Math.min(score, 0)) / 100) * 100));
      case "minus_500":
        return Math.min(100, Math.floor((Math.abs(Math.min(score, 0)) / 500) * 100));
      case "play_time_10":
        return Math.min(100, Math.floor((playMinutes / 10) * 100));
      case "play_time_30":
        return Math.min(100, Math.floor((playMinutes / 30) * 100));
      default:
        return 0;
    }
  }

  // Firestore에서 데이터가 로드되기 전에는 렌더링하지 않음
  if (authLoading || score === undefined || vanana === undefined || equippedBanana === undefined) {
    if (!authLoading && !user) {
      return <LoginPage onLogin={setUser} />;
    }
    return (
      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "#e3c800"
      }}>
        <div style={{ flex: 1, background: "#222" }} />
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
            padding: "48px 36px 36px 36px",
            minWidth: 320,
            textAlign: "center",
            width: 340,
            maxWidth: "100%"
          }}>
            <h2 style={{ color: "#222" }}>로딩중...</h2>
          </div>
        </div>
        <div style={{ flex: 1, background: "#222" }} />
      </div>
    );
  }

  return (
    <>
      {currentAlert && (
        <div
          className="alert-message"
          style={{
            position: "fixed",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            textAlign: "center",
            minWidth: "200px",
            fontSize: "1.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            padding: "12px 24px"
          }}
        >
          {currentAlert}
        </div>
      )}
      {resetPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              padding: "32px 28px 24px 28px",
              minWidth: 320,
              maxWidth: "90vw",
              textAlign: "center",
              position: "relative"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.2em", marginBottom: 12 }}>
              데이터 초기화 확인
            </div>
            <div style={{ marginBottom: 18, fontSize: "1.05em" }}>
              <div>정말로 데이터를 초기화하시겠습니까?</div>
              <div style={{ color: "#d00", marginTop: 4, fontSize: "0.98em" }}>
                이 작업은 되돌릴 수 없습니다.
              </div>
            </div>
            <div style={{
              background: "#f7f7f7",
              borderRadius: 10,
              padding: "14px 0",
              marginBottom: 18,
              fontSize: "1em"
            }}>
              <div>현재 계정 정보</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ color: "#e3c800", fontWeight: 600 }}>점수</span>: {score}
              </div>
              <div>
                <span style={{ color: "#e3c800", fontWeight: 600 }}>해금된 바나나</span>: {unlockedBananaCount} / {Array.isArray(vanana) ? vanana.length : 0}
              </div>
              <div>
                <span style={{ color: "#e3c800", fontWeight: 600 }}>해금된 업적</span>: {unlockedAchievementCount} / {achievements.length}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                style={{
                  background: "#e3c800",
                  color: "#222",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: "bold",
                  fontSize: "1.07em",
                  cursor: "pointer"
                }}
                onClick={doResetData}
              >
                초기화
              </button>
              <button
                style={{
                  background: "#eee",
                  color: "#444",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: "bold",
                  fontSize: "1.07em",
                  cursor: "pointer"
                }}
                onClick={() => setResetPopupOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              score={score}
              setScore={setScore}
              userName={userName}
              bananaList={BANANA_LIST}
              vanana={vanana}
              equippedBanana={equippedBanana}
              onSettingsClick={() => navigate("/settings")}
            />
          }
        />
        <Route
          path="/dex"
          element={
            <DexPage
              score={score}
              vanana={Array.isArray(vanana) ? vanana : []}
              bananaList={Array.isArray(BANANA_LIST) ? BANANA_LIST : []}
              equippedBanana={equippedBanana}
              onBananaClick={handleDexBananaClick}
              modalOpen={modalOpen}
              modalBananaIdx={modalBananaIdx}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
              onModalClose={handleModalClose}
            />
          }
        />
        <Route
          path="/ranking"
          element={
            <RankingPage
              userName={userName}
              score={score}
              ranking={ranking}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              userName={userName}
              setUserName={setUserName}
              onLogout={handleLogout}
              onResetData={handleResetData}
            />
          }
        />
        <Route
          path="/achievements"
          element={
            <AchievementsPage
              achievements={achievements}
              getAchievementProgress={getAchievementProgress}
            />
          }
        />
      </Routes>
    </>
  );
}

// ⚠️ 현재 이 프로젝트는 백엔드 서버 없이 Firebase만 사용하고 있습니다.
// 실제 서비스에서는 데이터 보호, 치트 방지, 신뢰성 있는 랭킹을 위해
// Node.js/Express, Python(Django/Flask), Java(Spring) 등 별도의 백엔드 서버와 데이터베이스가 필요합니다.
// 백엔드가 없으면 모든 데이터가 클라이언트/파이어베이스에 저장되어 보안에 취약합니다.

// 백엔드 서버가 없으므로, 아래 구조는 학습/개인용/테스트 용도로만 사용하세요.

// 예시:
// fetch("/api/login", { method: "POST", body: JSON.stringify({ email, pw }) })
// fetch("/api/score", { method: "POST", body: JSON.stringify({ score }) })
// fetch("/api/ranking")

// 이 코드는 Firebase만 사용하는 구조이므로
// 실제 배포/서비스에서는 반드시 백엔드 서버와 연동하도록 리팩터링해야 합니다.

export default App;