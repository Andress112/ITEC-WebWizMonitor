import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from "jwt-decode";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import "./css/LoginPage.css";

interface JwtPayload {
    User: string;
    exp: number,
    Id: number,
    email: string,
    status: number,
}

function CheckIfLoggedIn() {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);
}

const isValidEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\\. [a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};

function LoginPage() {
    const [Error, setError] = useState(0);
    const [showPassword, setShowPassword] = useState(false); 
    const [LogingIn, setLogingIn] = useState(true); 
    const signIn = useSignIn();
    const navigate = useNavigate();

    CheckIfLoggedIn();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSignUpSubmit = async (values: { User: string; Password: string; PasswordCheck: string; email: string }) => {
        if (values.User.trim().length < 1) {
            setError(2)
        }else if (isValidEmail(values.email)) {
            setError(3)
        } else if (values.Password.trim().length < 1) {
            setError(4)
        } else if (values.Password.trim() !== values.PasswordCheck.trim()) {
            setError(5)
        } else {
            try {
                const response = await axios.post(
                    "http://10.210.86.12:301/api/signup",
                    {
                        username: values.User.trim(),
                        password: values.Password.trim(),
                        email: values.email.trim(),
                    },
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );

                if (response.data.status === 200) {
                    const token: string = (response.data.data.Token);
                    
                    if (token) {
                        const decodedToken : JwtPayload = await jwtDecode(token);

                        if (typeof(decodedToken) === 'string') {
                            setError(7);
                        } else if (decodedToken) {
                            setError(0);

                            signIn({
                                auth: {
                                    token: token,
                                    type: 'Bearer'
                                },
                                userState: { 
                                    user: decodedToken.User,
                                    Id: decodedToken.Id,
                                    exp: decodedToken.exp,
                                    email: decodedToken.email,
                                    status: decodedToken.status
                                },
                            });
                            navigate("/");
                        } else {
                            setError(7);
                            console.error('Failed to decode JWT token please contact the site administrator!');
                        }
                    } else {
                        setError(7);
                        console.error('Failed to decode JWT token please contact the site administrator!');
                    }
                } else {
                    if (response.data.status == 170) {
                        setError(4);
                    }
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setError(1);
                }
            }
        }
    };
    const handleLogInSubmit = async (values: { User: string; Password: string}) => {
        let UsingEmailToLogIn = false;
        if (values.User.trim().length < 1) {
            setError(2)
        } else if (isValidEmail(values.User.trim())) {
            UsingEmailToLogIn = true;
        } else {
            UsingEmailToLogIn = false;
        }
        if (values.Password.trim().length < 1) {
            setError(4)
        } else {
            try {
                const response = await axios.post(
                    "http://10.210.86.12:301/api/login",
                    {
                        username: UsingEmailToLogIn ? "" : values.User.trim(),
                        password: values.Password.trim(),
                        email: UsingEmailToLogIn ? values.User.trim() : "",
                    },
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );

                if (response.data.status === 200) {
                    const token: string = (response.data.data.Token);
                    
                    if (token) {
                        const decodedToken : JwtPayload = await jwtDecode(token);

                        if (typeof(decodedToken) === 'string') {
                            setError(7);
                        } else if (decodedToken) {
                            setError(0);

                            signIn({
                                auth: {
                                    token: token,
                                    type: 'Bearer'
                                },
                                userState: { 
                                    user: decodedToken.User,
                                    Id: decodedToken.Id,
                                    exp: decodedToken.exp,
                                    email: decodedToken.email,
                                    status: decodedToken.status
                                },
                            });
                            navigate("/");
                        } else {
                            setError(7);
                            console.error('Failed to decode JWT token please contact the site administrator!');
                        }
                    } else {
                        setError(7);
                        console.error('Failed to decode JWT token please contact the site administrator!');
                    }
                } else {
                    
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setError(1);
                }
            }
        }
    };


    useEffect(() => {
        if (Error !== 0) {
            let errorText = "";
            if (Error === 1) {
                errorText = "An error occurred";
            } else if (Error === 2) {
                errorText = "Please enter your username";
            } else if (Error === 3) {
                errorText = "Please enter a valid email address";
            } else if (Error === 4) {
                errorText = "Please enter your password";
            } else if (Error === 5) {
                errorText = "Passwords do not match";
            } else if (Error === 6) {
                errorText = "An error occurred. Look in the console for more details!";
            } else if (Error === 7) {
                errorText = "Failed to decode JWT token please contact the site administrator!";
            }
    
            Swal.fire({
                title: errorText,
                icon: 'info',
                confirmButtonText: 'Ok',
                timer: 10000,
                timerProgressBar: true,
            });
            setError(0); // Resetting the error state after displaying the popup
        }
    }, [Error]);

    return (
        <div className="LoginPage-parent">
            <div className="Loginpage-container-logo">
                <img src="./icons/Logo_big.png" loading="lazy" />
                <h1>WebWiz Monitor</h1>
            </div>
            <Formik
                initialValues={{ User: "", Password: "" , PasswordCheck: "", email: ""}}
                onSubmit={LogingIn ? handleLogInSubmit : handleSignUpSubmit}>
                {({ handleChange, handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="Loginpage-container-main">
                            <div className="Loginpage-container-heading">
                                <span>{LogingIn ? "Login" : "SignUp"}</span>
                            </div>
                            <div className="Loginpage-container">
                                <div className="Loginpage-container-inputs">
                                    <label htmlFor="User">{LogingIn ? "Username/Email: " : "Username: "}</label>
                                    <label htmlFor="Password">Password: </label>
                                    <label htmlFor="PasswordCheck" style={{ display: LogingIn ? "none" : "" }}>Retype Password: </label>
                                    <label htmlFor="email" style={{ display: LogingIn ? "none" : "" }}>Email: </label>
                                </div>
                                <div className="Loginpage-container-inputs">
                                    <input name="User" id="User" type="text" placeholder="Username/Email" onChange={handleChange} value={values.User}/>
                                    <div className="Loginpage-container-inputs-password">
                                        <input name="Password" id="Password" type={showPassword ? "text" : "password"} placeholder="Password" onChange={handleChange} value={values.Password}/>
                                        <span className="Loginpage-btn-show-pass" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    </div>
                                    
                                    <input name="PasswordCheck" id="PasswordCheck" type="password" placeholder="Password" style={{ display: LogingIn ? "none" : "" }} onChange={handleChange} value={values.PasswordCheck}/>
                                    <input name="email" id="email" type="text" placeholder="example@gmail.com" style={{ display: LogingIn ? "none" : "" }} onChange={handleChange} value={values.email}/>
                                </div>
                            </div>
                            <div className="Loginpage-container-bottom">
                                <button type="submit">{LogingIn ? "Login" : "SignUp"}</button>
                                <span onClick={() => setLogingIn((prevStatus) => !prevStatus)}>{LogingIn ? "Not a member SignUp?" : "Already have an acount?"}</span>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default LoginPage;
