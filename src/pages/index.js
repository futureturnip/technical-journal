import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet';

const IndexPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  return (
    <div className="posts">
      {posts
        .filter((post) => post.node.frontmatter.title.length > 0)
        .map(({ node: post }) => {
          return (
            <div className="post">
              <h1>title: {post.frontmatter.title}</h1>
            </div>
          );
        })}
    </div>
  );
}

export default IndexPage

export const postQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`;
