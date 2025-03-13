import { useState } from 'react';
import styles from "./styles.module.css";
import Home from "../Home";
import Brain from "../Brain";
import Lung from "../Lung";
import About from "../About";
import Faqs from "../Faqs";


const Main = () => {
    const [activeSection, setActiveSection] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const renderSection = () => {
        switch (activeSection) {
            case "brain":
                return <Brain />;
            case "lung":
                return <Lung />;
            case "about":
                return <About />;
            case "faqs":
                return <Faqs />;
            default:
                return <Home setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1 onClick={() => { setActiveSection("home"); setMenuOpen(false); }}>DRUGSeek</h1>
                <div className={styles.menu_icon} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✖' : '☰'}
                </div>
                <div className={`${styles.nav_links} ${menuOpen ? styles.open : ""}`}>
                    <span onClick={() => { setActiveSection("home"); setMenuOpen(false); }} className={activeSection === "home" ? styles.active : ""}>Home</span>
                    <span onClick={() => { setActiveSection("brain"); setMenuOpen(false); }} className={activeSection === "brain" ? styles.active : ""}>Brain_Tumor_Segm</span>
                    <span onClick={() => { setActiveSection("lung"); setMenuOpen(false); }} className={activeSection === "lung" ? styles.active : ""}>Lung</span>

                    <span onClick={() => { setActiveSection("about"); setMenuOpen(false); }} className={activeSection === "about" ? styles.active : ""}>About</span>
                    <span onClick={() => { setActiveSection("faqs"); setMenuOpen(false); }} className={activeSection === "faqs" ? styles.active : ""}>FAQs</span>
                    <button className={styles.mobile_logout_btn} onClick={handleLogout}>Logout</button>
                </div>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            <div className="content-container">
                {renderSection()}
            </div>
        </div>
    );
};

export default Main;
