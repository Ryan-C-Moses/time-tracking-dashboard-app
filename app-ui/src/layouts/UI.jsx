import DashBoard from "../pages/DashBoard";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

const UI = () => {
  return <div className='bg-(--app-navy-950) w-full h-screen'>
    <SignInPage />
    {/* <DashBoard /> */}
  </div>;
};

export default UI;