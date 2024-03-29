import UserSettings from "./pages/user/settings/userSettings";
import UserPageMain from "./pages/user/userpagemain";
import UserPageFollowers from "./pages/user/userPageFollowers";
import UserPageFollowing from "./pages/user/userPageFollowing";
import UserPageFavourites from "./pages/user/userPageFavourites";
import Navbar from "./components/navbar";
import Search from "./pages/search/search";
import Login from "./pages/user/auth/login";
import Register from "./pages/user/auth/register";
import { Router, Route, Routes } from "@solidjs/router";
import ScrobbleLibrary from "./pages/user/library/scrobbleLibrary";
import SubjectLibrary from "./pages/user/library/subjectLibrary";
import SubjectPage from "./pages/subject/subject";
import Charts from "./pages/charts/charts";
import Collage from "./pages/collage/collage";
import MainPage from "./pages/mainpage/mainpage";
import UserSettingsPassword from "./pages/user/settings/changePassword";
import WeekReports from "./pages/reports/WeekReports";
import MonthReports from "./pages/reports/MonthReports";
import YearReports from "./pages/reports/YearReports";

function App() {
  return (
    <div class="flex w-screen h-screen bg-[#313338]">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/charts" element={Charts} />
        <Route path="/user/settings" element={<UserSettings />} />
        <Route
          path="/user/settings/change-password"
          element={<UserSettingsPassword />}
        />
        <Route path="/user/:username/main" element={<UserPageMain />} />
        <Route path="/user/:username/library" element={<ScrobbleLibrary />} />
        <Route
          path="/user/:username/library/:subject"
          element={<SubjectLibrary />}
        />
        <Route
          path="/user/:username/following"
          element={<UserPageFollowing />}
        />
        <Route
          path="/user/:username/followers"
          element={<UserPageFollowers />}
        />
        <Route
          path="/user/:username/favourites"
          element={<UserPageFavourites />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:subject/:name" element={<SubjectPage />} />
        <Route path="/collage" element={<Collage />} />
        <Route path="reports/week" element={<WeekReports />} />
        <Route path="reports/month" element={<MonthReports />} />
        <Route path="reports/year" element={<YearReports />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
