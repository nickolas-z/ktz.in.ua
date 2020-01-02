import React from "react"
import PropTypes from "prop-types"
import ReactNotifications from 'react-notifications-component';
import { StaticQuery, graphql } from "gatsby"

import "../styles/style.scss"

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <ReactNotifications />
        {children}
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
