import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import MobileVerification from "./components/MobileVerification"; // ✅ Import

function App() {
    const user = localStorage.getItem("token");

    return (
        <Routes>
            {!user ? (
                <Route path="/" element={<WelcomeScreen />} />
            ) : (
                <Route path="/" element={<Navigate replace to="/main" />} />
            )}

            <Route path="/mobile-verification" element={<MobileVerification />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users/:id/verify/:token" element={<EmailVerify />} />

            {user ? (
                <Route path="/main" element={<Main />} />
            ) : (
                <Route path="/main" element={<Navigate replace to="/login" />} />
            )}

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
