import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import logo from "../images/logo.svg"

const Header = ({ siteTitle }) => (
  <header className="header">
	<div className="container">
		<div className="header--container">
			<Link to="/"><img src={logo} alt={siteTitle} /></Link>
			<div className="header--nav">
				<ul>
					<li><a href="#services">Послуги</a></li>
					<li><a href="#aboutus">Про нас</a></li>
					<li><a href="#contacts">Контакти</a></li>
					<li><button className="button button--fill">Замовити дзвінок</button></li>
				</ul>
			</div>
		</div>
	</div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
