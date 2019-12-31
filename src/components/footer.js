import React from "react"
import PropTypes from "prop-types"

import { Link } from "gatsby"

import logo from "../images/logo.svg"

const Footer = ({ siteTitle }) => (
  <footer className="footer">
    <div className="footer--contacts">
      <div className="container">
        <div className="footer--container">
          <Link className="static" to="/"><img src={logo} alt={siteTitle} /></Link>
          <a href="tel:+380973295976" className="footer--phone">+380 97 329 5976</a>
        </div>
      </div>
    </div>
    <div className="footer--copyright">
      <div className="container">
        <div className="footer--copyright__text">
          © {new Date().getFullYear()}
          {` `}
          {siteTitle}
        </div>
      </div>
    </div>
  </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
