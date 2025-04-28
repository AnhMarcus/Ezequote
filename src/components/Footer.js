/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from "react-router-dom";
import Ezequote_logo from "../Ezequote_logo.png";
import '../components/footer.scss'
import data from '../data/data.json'

function footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer class="footer">
      <div class="inner-content">
        <div class="section with-border with-background">
          <div class="row">
            <div class="column full-width last-child">
              <div class="button-wrapper center-align">
                <a class="button light-bg" onClick={scrollToTop}>
                  {data.footer.title}
                </a>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column half">
              <div class="image-wrapper">
                <span class="image-wrap">
                  <Link to='/'>
                    <img class="footer-logo" src={Ezequote_logo} alt="logo" />
                  </Link>
                </span>
              </div>
            </div>
            <div class="column half last-child">
              <div class="text-wrapper right-align light-bg">
                <div class="text-inner">
                  <p>
                    {data.footer.copyright}
                    <br />
                    {data.footer.design}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default footer;
