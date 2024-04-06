import { useRouteError } from "react-router-dom";
import { CSSProperties } from "react";

interface HttpError {
    statusText: string;
    message: string;
}

export default function ErrorPage() {
    const error = useRouteError();

    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
    };

    if (typeof error === "object" && error !== null) {
        const httpError = error as HttpError;

        console.error(httpError);

        return (
            <div id="error-page" style={containerStyle}>
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{httpError.statusText || httpError.message}</i>
                </p>
            </div>
        );
    }

    // Fallback rendering if error is not of expected type
    return (
        <div id="error-page" style={containerStyle}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
        </div>
    );
}
