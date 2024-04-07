import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import Swal from 'sweetalert2'
import useHandleRequestError from "../Components/useHandleRequestError";
import MainLayout from "../Layout/MainLayout";
import "./css/DeveloperDashboarPage.css";

interface AppData {
    [key: string]: string | number | Record<string, string | number>;
    app_logo: string
    name: string;
    status: number;
    uptime: number;
    id: number;
}

function DeveloperDashboarPage() {
    const handleRequestError = useHandleRequestError();

    // Auth Data
    const [userId, setUserId] = useState<number | null>(null);
    const [authInitialized, setAuthInitialized] = useState<boolean>(false);
    const [jsonData, setJsonData] = useState<Record<string, AppData>>({});
    const [tryCount, setTryCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const isInitialMount = useRef(true);
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (tryCount >= 10 || authInitialized) {
            return;
        }
        const authStateCookie = Cookies.get("_auth_state");

        if (authStateCookie) {
            try {
                const authState = JSON.parse(decodeURIComponent(authStateCookie));
                setUserId(authState.Id);

                setAuthInitialized(true);
                setTimeout(() => {}, 1000);
            } catch (error) {
                console.error("Error parsing cookie content:", error);
                setTimeout(() => setTryCount(prevCount => prevCount + 1), 1000);
            }
        } else {
            setTimeout(() => setTryCount(prevCount => prevCount + 1), 1000);
        }
    }, [tryCount, authInitialized]);

    useEffect(() => {
        const getDeveloperApps = async () => {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:301/api/get_dev_apps",
                    {
                        userId: userId,
                    },
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json"
                        },
                    }
                );
    
                if (response.data.status === 200) {
                    setJsonData(response.data.data);
                    if (!hasLoaded.current) {
                        setLoading(false);
                        hasLoaded.current = true;
                    }
                } else {
                    handleRequestError(response.data.status)
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error(error)
                    Swal.fire({
                        title: "An error occurred check the console for more information",
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        timer: 10000,
                        timerProgressBar: true,
                    });
                }
            }
        };

        if (isInitialMount.current && authInitialized) {
            isInitialMount.current = false; // Set the ref to false after the first render
            getDeveloperApps(); // Call getUserdata when authInitialized becomes true
        }

        const interval = setInterval(() => {
            getDeveloperApps()
        }, 3000);
    
        return () => clearInterval(interval);

    }, [authInitialized, handleRequestError, setLoading, userId]);

    const fixAppBug = async (appId: number) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:301/api/fix_app_bug",
                {
                    appId: appId,
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    },
                }
            );

            if (response.data.status === 200) {
                Swal.fire({
                    title: "The app has been succesfully fixed!",
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    timer: 10000,
                    timerProgressBar: true,
                });
            } else {
                handleRequestError(response.data.status)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error)
                Swal.fire({
                    title: "An error occurred check the console for more information",
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    timer: 10000,
                    timerProgressBar: true,
                });
            }
        }
    };

    return (
        <MainLayout>
            <div className="DeveloperDashboarPage">
                <div className="DeveloperDashboarPage-top">
                    <span>My Apps</span>
                </div>
                <div className="DeveloperDashboarPage-bottom">
                    <div className="DeveloperDashboarPage-container">
                        <div className="DeveloperDashboarPage-apps">
                            {!loading ? (
                                <>
                                    {Object.keys(jsonData).map((key) => (
                                        <div className="DeveloperDashboarPage-container-apps" key={key}>
                                            <img src={jsonData[key]?.app_logo === "" ? "/backrounds/image-placeholder.png" : jsonData[key]?.app_logo.toString()} alt="App Placeholder Image" />
                                            <div className="DeveloperDashboarPage-container-apps-right">
                                                <div className="DeveloperDashboarPage-container-apps-right-top">
                                                    <span className="DeveloperDashboarPage-app-names">{jsonData[key]?.name}</span>
                                                    <div className="DeveloperDashboarPage-container-apps-status" style={{color: jsonData[key]?.status == 0 ? "#c90011" : jsonData[key]?.status == 1 ? "#bfa600" : "#08c239"}}>
                                                        <span>&#x2022;</span>
                                                        <span>{jsonData[key]?.status == 0 ? "Down" : jsonData[key]?.status == 1 ? "Unstable" : "Stable"}</span>
                                                    </div>
                                                </div>
                                                <div className="DeveloperDashboarPage-container-apps-right-bottom">
                                                    <button onClick={() => fixAppBug(jsonData[key]?.id)}>Fix Bug</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ): (
                                <>
                                    <div className="DeveloperDashboarPage-loading">
                                        <span>Loading ...</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default DeveloperDashboarPage;
