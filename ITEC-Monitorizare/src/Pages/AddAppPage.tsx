import React, { useState, useCallback, useEffect } from "react";
import { Formik } from "formik";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2'
import useHandleRequestError from "../Components/useHandleRequestError";
import { useNavigate } from "react-router-dom";


import MainLayout from "../Layout/MainLayout";
import "./css/AddAppPage.css"; 

function AddAppPage() {
    const [Endpoints, setEndpoints] = useState<string[]>([""]);
    const [EndpointsNames, setEndpointsNames] = useState<string[]>([""]);
    const [EndpointDeleteButtonVisible, setEndpointDeleteButtonVisible] = useState(false);
    const [AppName, setAppName] = useState("");
    const [AppImage, setAppImage] = useState("");

    // Auth Data
    const [userId, setUserId] = useState<number | null>(null);
    const [authInitialized, setAuthInitialized] = useState<boolean>(false);
    const [tryCount, setTryCount] = useState(0);

    const handleRequestError = useHandleRequestError();
    const navigate = useNavigate();

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

    const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedEndpoints = [...Endpoints];
        updatedEndpoints[index] = event.target.value.trim();
        setEndpoints(updatedEndpoints);
    };
    const handleEndpointNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedEndpointsName = [...EndpointsNames];
        updatedEndpointsName[index] = event.target.value;
        setEndpointsNames(updatedEndpointsName);
    };

    const handleAddEndpointField = useCallback(() => {
        const newEndpointFields = [...Endpoints, ""];
        setEndpoints(newEndpointFields);
        setEndpointDeleteButtonVisible(newEndpointFields.length > 1);

        const newEndpointNameFields = [...EndpointsNames, ""];
        setEndpointsNames(newEndpointNameFields)
    }, [Endpoints, EndpointsNames]);

    const handleRemoveEndpointField = () => {
        const newEndpointFields = Endpoints.slice(0, -1);
        setEndpoints(newEndpointFields);
        setEndpointDeleteButtonVisible(newEndpointFields.length > 1);

        const newEndpointNameFields = EndpointsNames.slice(0, -1);
        setEndpointsNames(newEndpointNameFields)
    };

    const handleAppUpload = async () => {
        if (AppName.trim().length < 1) {
            Swal.fire({
                title: "You need to provide an app name",
                icon: 'info',
                confirmButtonText: 'Ok',
                timer: 10000,
                timerProgressBar: true,
            });
        } else {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:301/api/add_app",
                    {
                        userId: userId,
                        appName: AppName.trim(),
                        appImage: AppImage.trim(),
                        endpoints: Endpoints,
                        endpointNames: EndpointsNames,
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
                        title: "Success",
                        text: response.data.data,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        timer: 10000,
                        timerProgressBar: true,
                    });
                    navigate("/")
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
        }
    };

    return (
        <MainLayout>
            <div className="AddAppPage">
                <div className="AddAppPage-top">
                    <span>Add a new app</span>
                </div>
                <div className="AddAppPage-bottom">
                    <Formik
                        initialValues={{}}
                        onSubmit={handleAppUpload}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="AddAppPage-container">
                                <div className="AddAppPage-container-top">
                                    <img src={AppImage === "" ? "/backrounds/image-placeholder.png" : AppImage}/>
                                    <div className="AddAppPage-container-name">
                                        <label htmlFor="appName">App name</label>
                                        <input type="text" id="appName" name="appName" placeholder="App's Name" onChange={(event) => {setAppName(event.target.value)}} value={AppName}></input>
                                        <label htmlFor="appImage">App image</label>
                                        <input type="text" id="appImage" name="appImage" placeholder="App's image URL" onChange={(event) => {setAppImage(event.target.value)}} value={AppImage}></input>
                                    </div>
                                </div>
                                <div className="AddAppPage-endpoints-title">
                                    <span>Endpoints</span>
                                </div>
                                <div className="AddAppPage-endpoints">
                                    <div className="AddAppPage-endpoints-container-main">
                                        {EndpointsNames.map((urlField, index) => (
                                            <div key={`name_${index}`} className="AddAppPage-endpoints-container">
                                                <label htmlFor={`name_${index}`}>{`Name ${index + 1}: `}</label>
                                                <input
                                                    type="text"
                                                    id={`name_${index}`}
                                                    name={`name_${index}`}
                                                    placeholder="Name"
                                                    value={urlField}
                                                    onChange={(event) => handleEndpointNameChange(event, index)}
                                                />
                                                <label htmlFor={`url_${index}`}>{`URL ${index + 1}: `}</label>
                                                <input
                                                    type="text"
                                                    id={`url_${index}`}
                                                    name={`url_${index}`}
                                                    placeholder="https://example.com"
                                                    value={Endpoints[index]}
                                                    onChange={(event) => handleEndpointChange(event, index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="AddAppPage-endpoints-buttons">
                                        <button type="button" onClick={handleAddEndpointField}>
                                            +
                                        </button>
                                        {EndpointDeleteButtonVisible && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveEndpointField}>
                                                -
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="AddAppPage-submit">
                                    <button type="submit">Create App</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </MainLayout>
    );
}

export default AddAppPage;
