import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet';

const IndexPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  return (
    <div className="index-page">
      {
        posts
          .filter((post) => post.node.frontmatter.title.length > 0)
          .map(({ node: post }) => {
            return (
              <article className="post">
                <header>
                  <Link to={post.frontmatter.path}>
                    <h1 className="post-title">{post.frontmatter.title}</h1>
                  </Link>
                </header>
                <section className="post-body">
                  <p dangerouslySetInnerHTML={{ __html: post.excerpt }}></p>
                </section>
                <footer className="post-footer">
                  <p className="post-datetime">
                    Posted on <time datetime={post.frontmatter.date}>{post.frontmatter.date}</time>
                  </p>
                </footer>
              </article>
            );
          })
      }
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
