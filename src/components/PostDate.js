import React from 'react';

const PostDate = ({ postedOn }) => {
  return(
    <p className="post-datetime">
      Posted on <time datetime={postedOn}>{postedOn}</time>
    </p>
  );
}

export default PostDate;
