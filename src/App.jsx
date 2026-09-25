import { useEffect, useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import Gamepage from "./pages/Gamepage";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen onSkip={() => setShowSplash(false)} />;
  }

  return <Gamepage />;
}

export default App;
