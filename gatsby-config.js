const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');
const cssnano = require('cssnano');

module.exports = {
  siteMetadata: {
    title: `KTZ Company`,
    description: ``,
    siteUrl: `https://www.ktz.in.ua`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          autoprefixer({ overrideBrowserslist: browserslist() }),
          cssnano({ preset: 'default' }),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Rubik`,
            subsets: [`cyrillic`],
            variants: [`400`, `500`],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ktz.in.ua`,
        short_name: `ktz`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `src/images/ktz-icon.png`,
      },
    },
  ],
}
