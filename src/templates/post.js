import React from 'react';
import Helmet from 'react-helmet';

export default function Template({ data }) {
  const { markdownRemark: post } = data;
  return (
    <div className="article-page">
      <article className="post">
        <Helmet title={`CDD: ${post.frontmatter.title}`}></Helmet>
        <header>
          <h1 className="post-title">{post.frontmatter.title}</h1>
        </header>
        <section className="post-body">
          <p dangerouslySetInnerHTML={{ __html: post.html }}></p>
        </section>
        <footer className="post-footer">
          <p className="post-datetime">
            Posted on <time datetime={post.frontmatter.date}>{post.frontmatter.date}</time>
          </p>
        </footer>
      </article>
    </div>
  );
}

export const pageQuery = graphql`
  query PostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path }}) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;
