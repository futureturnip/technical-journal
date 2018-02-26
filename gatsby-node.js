const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const postTemplate = path.resolve(`src/templates/post.js`);

  return graphql(`{
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          html
          frontmatter {
            date
            path
            title
          }
        }
      }
    }
  }`).then((result) => {
    if(result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges
      .forEach(({ node }) => {
        createPage({
          path: node.frontmatter.path,
          component: postTemplate,
          context: { }
        });
      });
  });
}
