import React from 'react';
import Helmet from 'react-helmet';

export default function Template({ data }) {
  const { markdownRemark: post } = data;
  return (
    <article className="post">
      <Helmet title={`CDD: ${post.frontmatter.title}`}></Helmet>
      <header>
        <h2 className="post-title">{post.frontmatter.title}</h2>
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
