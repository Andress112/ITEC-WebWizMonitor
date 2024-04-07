import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import useSignOut from 'react-auth-kit/hooks/useSignOut';


import "./css/Navbar.css";

function Navbar() {
    const [ProfileShow, setProfileShow] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);
    const profileImgRef = useRef<HTMLImageElement | null>(null); // Ref for the profile image

    const SignOut = useSignOut();
    const navigate = useNavigate();

    const handleOnProfileClick = () => {
        setProfileShow(!ProfileShow);
    };

    const LogOut = () => {
        SignOut();
        navigate("/login");
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            profileRef.current &&
            !profileRef.current.contains(event.target as Node) &&
            // Exclude clicks on the profile image
            profileImgRef.current &&
            event.target !== profileImgRef.current
        ) {
            setProfileShow(false);
        }
    };

    useEffect(() => {
        // Read the _auth_state cookie
        const authStateCookie = Cookies.get("_auth_state");

        if (authStateCookie) {
            try {
                const authState = JSON.parse(
                    decodeURIComponent(authStateCookie)
                );
                setUser(authState.user);
            } catch (error) {
                console.error("Error parsing cookie content:", error);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <>
            <div className="Navbar">
                <a href="/">
                    <div className="Navbar-logo">
                        <img src="./icons/Logo_big.png" alt="Logo" />
                        <h1>WebWiz</h1>
                    </div>
                </a>
                <div className="Navbar-controls">
                    <ul>
                        <li>
                            <Link to="/home" className="Navbar-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="Navbar-link">
                                Info
                            </Link>
                        </li>
                        <li>
                            <Link to="/add_app" className="Navbar-link">
                                Add App
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="Navbar-link">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/feedback" className="Navbar-link">
                                Feedback
                            </Link>
                        </li>
                    </ul>
                    <img
                        src="./icons/profile.svg"
                        alt="Profile"
                        onClick={handleOnProfileClick}
                        ref={profileImgRef}
                    />
                </div>
            </div>
            <div
                ref={profileRef}
                className={ProfileShow ? "Profile Show" : "Profile"}>
                <div className="Profile-top">
                    <div className="Profile-name">
                        <p>Hello {user}!</p>
                    </div>
                </div>
                <div className="Profile-bottom">
                    <button onClick={LogOut}>Log out</button>
                </div>
            </div>
        </>
    );
}

export default Navbar;
