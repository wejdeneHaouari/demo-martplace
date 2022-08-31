import "./Footer.css";
import ChainCertsLogo from "../../../assets/images/storeFront/blackChainCertsLogo.svg";

const Footer = () => {

  return (
    <footer className="Container">

      <div className="bottomFooter">
        <p>Powered by</p>
        <img src={ChainCertsLogo} />
      </div>
    </footer>
  );
};
export default Footer;
