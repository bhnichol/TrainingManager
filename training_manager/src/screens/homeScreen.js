import { Outlet } from "react-router";
const HomeScreen = () => {
  return (
    <>
    <nav>
      <h1>Home</h1>
     </nav>
     <Outlet/>
     </>
  );
};

export default HomeScreen;