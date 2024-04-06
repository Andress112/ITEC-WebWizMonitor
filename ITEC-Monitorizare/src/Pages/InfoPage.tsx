import MainLayout from "../Layout/MainLayout";
import "./css/InfoPage.css";

function InfoPage() {
    return (
        <MainLayout>
            <div className="InfoPage">
                <div className="InfoPage-top">
                    <h1>About us</h1>
                </div>
                <div className="InfoPage-bottom">
                    <div className="InfoPage-bottom-container">
                        <span>Useful info </span>
                        <ul>
                            <li>
                                WebWise reprezintă avangarda inovației în domeniul
                                tehnologiei web, concentrându-se pe crearea unei
                                aplicații revoluționare menite să monitorizeze
                                performanța altor aplicații. Misiunea noastră este
                                de a oferi companiilor de toate dimensiunile
                                instrumentele necesare pentru a asigura funcționarea
                                optimă a aplicațiilor lor, detectând prompt
                                problemele și optimizând performanța generală.{" "}
                            </li>
                            <li>
                                Serviciile Noastre Oferim o gamă completă de
                                servicii de dezvoltare software, specializându-ne
                                în: Monitorizarea Aplicațiilor: Serviciul nostru
                                steag al flotei, conceput pentru a oferi o
                                vizualizare clară asupra performanței aplicațiilor
                                clienților noștri în timp real. Optimizare și
                                Performanță: Analizăm și optimizăm aplicațiile
                                pentru a atinge performanțe de vârf. Consultanță
                                Tehnică: Echipa noastră oferă expertiză tehnică
                                pentru a ajuta clienții să navigheze prin
                                complexitatea tehnologică a lumii digitale moderne.
                            </li>
                            <li>
                                Publicul Țintă Serviciile noastre sunt ideale
                                pentru: Startup-uri inovative căutând să lanseze
                                aplicații robuste și eficiente. Întreprinderi mici
                                și mijlocii care doresc să își îmbunătățească
                                infrastructura digitală. Companii mari interesate de
                                monitorizarea și optimizarea aplicațiilor la scară
                                largă.
                            </li>
                            <li>
                                De Ce WebWise? Inovație Continuă: Suntem dedicati
                                explorării celor mai noi tehnologii și abordări,
                                pentru a oferi soluții de top. Personalizare:
                                Înțelegem că fiecare afacere este unică. Serviciile
                                noastre sunt adaptate pentru a îndeplini nevoile
                                specifice ale fiecărui client. Expertiză: Echipa
                                noastră este formată din profesioniști experimentați
                                în dezvoltarea și monitorizarea aplicațiilor web.
                            </li>
                            <li>
                                Contactați-ne Pentru a afla mai multe despre cum
                                WebWise poate transforma modul în care aplicația
                                dvs. funcționează și este monitorizată, vă invităm
                                să ne contactați. Suntem aici pentru a vă ajuta să
                                navigați în lumea digitală cu încredere și succes.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default InfoPage;
