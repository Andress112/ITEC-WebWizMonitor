import "./css/FeedbackPage.css";
import MainLayout from "../Layout/MainLayout";

function FeedbackPage() {
    return (
        <MainLayout>
            <div className="FeedbackPage">
                <div className="FeedbackPage-top">
                    <span>Feedback</span>
                </div>
                <div className="FeedbackPage-bottom">
                    <div className="FeedbackPage-container">
                        <textarea placeholder="Your impresion about us!"></textarea>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default FeedbackPage;
