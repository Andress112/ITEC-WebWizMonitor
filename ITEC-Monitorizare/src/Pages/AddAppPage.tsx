import React, { useState, useCallback } from "react";

import MainLayout from "../Layout/MainLayout";
import "./css/AddAppPage.css"; 

function AddAppPage() {
    const [Endpoints, setEndpoints] = useState<string[]>([""]);
    const [EndpointsNames, setEndpointsNames] = useState<string[]>([""]);
    const [EndpointDeleteButtonVisible, setEndpointDeleteButtonVisible] = useState(false);

    const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedEndpoints = [...Endpoints];
        Endpoints[index] = event.target.value;
        setEndpoints(updatedEndpoints);
    };
    const handleEndpointNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedEndpointsName = [...EndpointsNames];
        EndpointsNames[index] = event.target.value;
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

    return (
        <MainLayout>
            <div className="AddAppPage">
                <div className="AddAppPage-top">
                    <span>Add a new app</span>
                </div>
                <div className="AddAppPage-bottom">
                    <div className="AddAppPage-container">
                        <div className="AddAppPage-container-top">
                            <img src="/backrounds/image-placeholder.png"/>
                            <div className="AddAppPage-container-name">
                                <label>App name</label>
                                <input type="text" id="app_name" name="app_name" placeholder="App's Name"></input>
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
                                            onChange={(event) => handleEndpointChange(event, index)}
                                        />
                                        {/* Render the corresponding URL input */}
                                        <label htmlFor={`url_${index}`}>{`URL ${index + 1}: `}</label>
                                        <input
                                            type="text"
                                            id={`url_${index}`}
                                            name={`url_${index}`}
                                            placeholder="https://example.com"
                                            value={Endpoints[index]}
                                            onChange={(event) => handleEndpointNameChange(event, index)}
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
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default AddAppPage;
