import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  // 입력값 초기화
  const resetInputs = () => {
    setEmail("");
    setPw("");
    setPwCheck("");
    setName("");
    setError("");
  };

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
    resetInputs();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (isSignUp) {
      if (!name.trim()) {
        setError("이름을 입력하세요.");
        return;
      }
      if (pw !== pwCheck) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pw);
        await updateProfile(result.user, { displayName: name });
        await result.user.reload();
        onLogin(auth.currentUser);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          setError("이미 가입된 이메일입니다. 로그인 해주세요.");
        } else if (err.code === "auth/invalid-email") {
          setError("이메일 형식이 올바르지 않습니다.");
        } else if (err.code === "auth/weak-password") {
          setError("비밀번호는 6자 이상이어야 합니다.");
        } else {
          setError(err.message);
        }
      }
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, pw);
        onLogin(result.user);
      } catch (err) {
        if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (err.code === "auth/user-not-found") {
          setError("존재하지 않는 계정입니다. 회원가입을 해주세요.");
        } else {
          setError(err.message);
        }
      }
    }
  };

  // SVG 아이콘
  const EyeIcon = ({ open }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" style={{ display: "block" }}>
      {open ? (
        <ellipse cx="11" cy="11" rx="8" ry="6" fill="#fff" stroke="#888" strokeWidth="2"/>
      ) : (
        <>
          <ellipse cx="11" cy="11" rx="8" ry="6" fill="#fff" stroke="#888" strokeWidth="2"/>
          <line x1="5" y1="17" x2="17" y2="5" stroke="#888" strokeWidth="2"/>
        </>
      )}
      <circle cx="11" cy="11" r="2.5" fill="#888"/>
    </svg>
  );

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
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
            padding: "40px 24px 32px 24px",
            minWidth: 340,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0
          }}
        >
          <h2 style={{
            marginBottom: 14, // 아이디/비밀번호 입력창과 동일한 간격
            color: "#222",
            fontWeight: 700,
            fontSize: "2rem"
          }}>
            {isSignUp ? "회원가입" : "로그인"}
          </h2>
          {isSignUp && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 14,
                padding: "14px",
                borderRadius: 8,
                border: "1px solid #bbb",
                fontSize: "1.08em",
                boxSizing: "border-box"
              }}
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 14,
              padding: "14px",
              borderRadius: 8,
              border: "1px solid #bbb",
              fontSize: "1.08em",
              boxSizing: "border-box"
            }}
          />
          {/* 비밀번호 입력 영역 */}
          <div style={{
            width: "100%",
            marginBottom: isSignUp ? 14 : 0,
            display: isSignUp ? "flex" : "block",
            gap: isSignUp ? 12 : 0,
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: isSignUp ? "50%" : "100%",
              minWidth: 0,
              position: "relative",
              marginBottom: isSignUp ? 0 : 0
            }}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="비밀번호"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 38px 14px 14px",
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  fontSize: "1.08em",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                  width: 22,
                  height: 22,
                  padding: 0
                }}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {isSignUp && (
              <div style={{
                width: "50%",
                minWidth: 0,
                position: "relative"
              }}>
                <input
                  type={showPwCheck ? "text" : "password"}
                  placeholder="비밀번호 확인"
                  value={pwCheck}
                  onChange={e => setPwCheck(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 38px 14px 14px",
                    borderRadius: 8,
                    border: "1px solid #bbb",
                    fontSize: "1.08em",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwCheck(v => !v)}
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#888",
                    width: 22,
                    height: 22,
                    padding: 0
                  }}
                  aria-label={showPwCheck ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  <EyeIcon open={showPwCheck} />
                </button>
              </div>
            )}
          </div>
          {error && <div style={{ color: "#f44", marginBottom: 10, marginTop: 2 }}>{error}</div>}
          <button
            type="submit"
            style={{
              background: "#222",
              color: "#ffd700",
              border: "none",
              borderRadius: 8,
              padding: "16px 0",
              fontWeight: 700,
              fontSize: "1.15em",
              cursor: "pointer",
              marginBottom: 18,
              width: "100%",
              marginTop: 4
            }}
          >
            {isSignUp ? "회원가입" : "로그인"}
          </button>
          <div style={{ width: "100%", textAlign: "center" }}>
            <span style={{ color: "#555" }}>
              {isSignUp ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
            </span>
            <button
              type="button"
              onClick={handleSwitchMode}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                marginLeft: 8,
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "1em"
              }}
            >
              {isSignUp ? "로그인" : "회원가입"}
            </button>
          </div>
        </form>
      </div>
      <div style={{ flex: 1, background: "#222" }} />
    </div>
  );
}

export default LoginPage;
