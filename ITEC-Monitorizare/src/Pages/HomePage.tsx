import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import Swal from 'sweetalert2'
import useHandleRequestError from "../Components/useHandleRequestError";
import MainLayout from "../Layout/MainLayout";
import "./css/HomePage.css";

interface AppData {
    [key: string]: string | number | Record<string, string | number>;
    app_logo: string
    name: string;
    status: number;
    uptime: number;
    id: number;
}

function HomePage() {
    const handleRequestError = useHandleRequestError();

    const [jsonData, setJsonData] = useState<Record<string, AppData>>({});
    const [loading, setLoading] = useState(true);
    const isInitialMount = useRef(true);
    const hasLoaded = useRef(false);

    useEffect(() => {
        const getDeveloperApps = async () => {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:301/api/get_apps",
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

        if (isInitialMount.current) {
            isInitialMount.current = false; // Set the ref to false after the first render
            getDeveloperApps(); // Call getUserdata when authInitialized becomes true
            setLoading(false);
        }

        const interval = setInterval(() => {
            getDeveloperApps()
        }, 3000);
    
        return () => clearInterval(interval);

    }, [handleRequestError, setLoading]);

    const sendAppBug = async (appId: number) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:301/api/report_app",
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
                    title: "The app has been reported successfully!",
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
            <div className="HomePage">
                <div className="HomePage-top">
                    <span>All Apps</span>
                </div>
                <div className="HomePage-bottom">
                    <div className="HomePage-container">
                        <div className="HomePage-apps">
                            {!loading ? (
                                    <>
                                        {Object.keys(jsonData).map((key) => (
                                            <div className="HomePage-container-apps" key={key}>
                                                <img src={jsonData[key]?.app_logo === "" ? "/backrounds/image-placeholder.png" : jsonData[key]?.app_logo.toString()} alt="App Placeholder Image" />
                                                <div className="HomePage-container-apps-right">
                                                    <div className="HomePage-container-apps-right-top">
                                                        <span className="HomePage-app-names">{jsonData[key]?.name}</span>
                                                        <div className="HomePage-container-apps-status" style={{color: jsonData[key]?.status == 0 ? "#c90011" : jsonData[key]?.status == 1 ? "#bfa600" : "#08c239"}}>
                                                            <span>&#x2022;</span>
                                                            <span>{jsonData[key]?.status == 0 ? "Down" : jsonData[key]?.status == 1 ? "Unstable" : "Stable"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="HomePage-container-apps-right-bottom">
                                                        <button onClick={() => sendAppBug(jsonData[key]?.id)}>Report Bug</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ): (
                                    <>
                                        <div className="HomePage-loading">
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

export default HomePage;
