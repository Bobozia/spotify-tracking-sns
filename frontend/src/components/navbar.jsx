import NavbarButton from "./navbar-button";
import { getData, postData } from "../getUserData";
import { createEffect, useContext } from "solid-js";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "@solidjs/router";
import AppLogo from "../assets/icons/logo-white.png";
import SearchIcon from "../assets/icons/search.svg";
import UserIcon from "../assets/icons/user.svg";
import ChartsIcon from "../assets/icons/charts.svg";
import SettingsLogo from "../assets/icons/settings.svg";
import LogoutLogo from "../assets/icons/logout.svg";
import CollageLogo from "../assets/icons/collage.svg";
import ReportLogo from "../assets/icons/report.svg";
import { AdminContext } from "../contexts/AdminContext";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const { setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const authorize = async () => {
    if (localStorage.getItem("user") === null) return false;
    const response = await getData("users/user");
    if (response.success) {
      setUser({
        userName: localStorage.getItem("user"),
        id: response.id,
      });
      const response2 = await getData("users/admin");
      if (response2.success) {
        setAdmin({
          userName: localStorage.getItem("user"),
          id: response2.id,
        });
      }
      return true;
    }

    window.location.reload();
    localStorage.removeItem("user");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    const response = await postData("users/logout");
    navigate("/");
    setUser(null);
    setAdmin(null);
  };

  createEffect(() => {
    authorize();
  });

  return (
    <div class="flex flex-col w-20 sticky top-0 bg-[#1e1f22] shadow-lg">
      <div class="flex flex-grow flex-col">
        <NavbarButton destination="/" image={AppLogo} />
        <NavbarButton destination="/search" image={SearchIcon} />
        <NavbarButton destination="/charts" image={ChartsIcon} />
      </div>
      <div class="flex flex-col">
        {user() && (
          <>
            <button
              onclick={handleLogout}
              class="relative flex items-center justify-center h-16 w-16 mt-2 mb-2 mx-auto shadow-lg bg-[#2b2d31] rounded-[30px] hover:bg-[#64748b] hover:rounded-xl transition-all duration-200 ease-linear cursor-pointer"
            >
              <img src={LogoutLogo} alt="Logout" />
            </button>

            <NavbarButton destination="collage" image={CollageLogo} />
            <NavbarButton destination="reports/week" image={ReportLogo} />

            <NavbarButton destination={"/user/settings"} image={SettingsLogo} />
            <NavbarButton
              destination={`/user/${user().userName}/main`}
              image={UserIcon}
            />
          </>
        )}
        {!user() && <NavbarButton destination="/login" image={UserIcon} />}
      </div>
    </div>
  );
}

export default Navbar;
