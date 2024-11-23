import { Outlet} from "react-router-dom";
import TopBar from "../components/topbar";

const Layout = () => {
  return (
    <>
      <nav>
        <TopBar/>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;