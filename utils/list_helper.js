const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((sum, { likes }) => sum + +likes, 0);
};

const favoriteBlog = (blogs) => {
  let favorite = {};
  for (let blog of blogs) {
    const { title, author, likes } = blog;
    if (favorite.likes == null || favorite.likes < likes)
      favorite = { title, author, likes };
  }
  return favorite;
};

function mostBlogs(blogs) {
  let result = {},
    temp = {};
  for (let { author } of blogs) {
    temp[author] = (temp[author] || 0) + 1;
    if (result.blogs == null || result.blogs < temp[author])
      result = { author, blogs: temp[author] };
  }
  return result;
}

function mostLikes(blogs) {
  let result = {},
    temp = {};
  for (let { author, likes } of blogs) {
    temp[author] = (temp[author] || 0) + likes;
    if (result.likes == null || result.likes < temp[author])
      result = { author, likes: temp[author] };
  }
  return result;
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
