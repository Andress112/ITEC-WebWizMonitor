import "./css/DeveloperDashboarPage.css";
import MainLayout from "../Layout/MainLayout";

function DeveloperDashboarPage() {
    return (
        <MainLayout>
            <div className="DeveloperDashboarPage">
                <div className="DeveloperDashboarPage-top">
                    <span>My Apps</span>
                </div>
                <div className="DeveloperDashboarPage-bottom">
                    <div className="DeveloperDashboarPage-container">
                        <div className="DeveloperDashboarPage-apps">
                            {Array.from({ length: 8 }, (_, index) => (
                                <div className="DeveloperDashboarPage-container-apps" key={index}>
                                    <img src="/backrounds/image-placeholder.png" alt="App Placeholder Image" />
                                    <div className="DeveloperDashboarPage-container-apps-right">
                                        <div className="DeveloperDashboarPage-container-apps-right-top">
                                            <span className="DeveloperDashboarPage-app-names">My App</span>
                                            <div className="DeveloperDashboarPage-container-apps-status">
                                                <span>&#x2022;</span>
                                                <span>Unstable</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default DeveloperDashboarPage;
