import { ReactNode } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
                <div style={{ paddingTop: "57px" }}>
                    {children}
                </div>
            <Footer />
        </>
    );
}

export default MainLayout;
