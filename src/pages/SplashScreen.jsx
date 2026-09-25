import "./SplashScreen.css";

function SplashScreen({ onSkip }) {
  return (
    <div className="splash" onClick={onSkip}>
      <div className="splash__glow splash__glow--one" />
      <div className="splash__glow splash__glow--two" />

      <div className="splash__content">
        <p className="splash__eyebrow">Welcome To</p>

        <div className="splash__title-wrapper">
          <h1 className="splash__title">JEOPARDY!</h1>

          <div className="splash__line" />
        </div>

        <p className="splash__subtitle">
          Test your knowledge. Challenge yourself.
        </p>

        <div className="splash__loader">
          <span />
          <span />
          <span />
        </div>
      </div>

      <p className="splash__skip">Click anywhere to continue</p>
    </div>
  );
}

export default SplashScreen;
