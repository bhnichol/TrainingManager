
import styles from './App.module.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/homeScreen';
import AboutScreen from './screens/aboutScreen';
import ContactScreen from './screens/contactScreen';
import AccountScreen from './screens/accountScreen';
import ProfileScreen from './screens/profileScreen';
import PlanScreen from './screens/planScreen';
import ContingencyScreen from './screens/contingencyScreen';
import Layout from './screens/layout';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import RequireAuth from './components/RequireAuth';
import MinLayout from './screens/minLayout';
import AdminUser from './screens/adminUser';
import PersistLogin from './components/persistLogin';
import MissingScreen from './screens/missingScreen';
import UnauthorizedScreen from './screens/unauthorizedScreen';
function App() {

  return (
    <Routes>
      <Route path="/" element={<MinLayout />}>

        {/*Public Routes*/}
        <Route path="login" index element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="unauthorized" element={<UnauthorizedScreen />} />

        {/*Protected Routes*/}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[1]} />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeScreen />} />
              <Route path="about" element={<AboutScreen />} />
              <Route path="plan" element={<PlanScreen />} />
              <Route path="contingency" element={<ContingencyScreen />} />
              <Route path="contact" element={<ContactScreen />} />
              <Route path="account" element={<AccountScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route element={<RequireAuth allowedRoles={[3]} />}>
                <Route path="users" element={<AdminUser />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path = "*" element={<MissingScreen/>}/>
      </Route>
    </Routes>
  );
}


export default App;
