import "./css/Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="Footer">
            <p>&#169; {currentYear} Copyright: </p>
            <a href="/">WebWize Monitor</a>
        </div>
    );
}

export default Footer;
