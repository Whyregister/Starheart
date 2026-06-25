import { Route, Routes } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import CardsPage from "../pages/CardsPage";
import HomePage from "../pages/HomePage";
import LuckyPage from "../pages/LuckyPage";
import MBTIPage from "../pages/MBTIPage";
import MBTIResultPage from "../pages/MBTIResultPage";
import NicknamePage from "../pages/NicknamePage";
import ZodiacPage from "../pages/ZodiacPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mbti" element={<MBTIPage />} />
      <Route path="/mbti/result" element={<MBTIResultPage />} />
      <Route path="/zodiac" element={<ZodiacPage />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/lucky" element={<LuckyPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
