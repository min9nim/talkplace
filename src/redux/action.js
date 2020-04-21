import shortid from 'shortid'

const ADDPOST = 'ADDPOST'
const ADDPOSTS = 'ADDPOSTS'
const INITPOSTS = 'INITPOSTS'
const SETPOSTS = 'SETPOSTS'
const DELETEPOST = 'DELETEPOST'
const UPDATEPOST = 'UPDATEPOST'
const REMOVEPOST = 'REMOVEPOST'
const RESTOREPOST = 'RESTOREPOST'
const VIEWPOST = 'VIEWPOST' // 조회수 +1
const ADDCOMMENT = 'ADDCOMMENT'
const ADDCOMMENTS = 'ADDCOMMENTS'
const DELETECOMMENT = 'DELETECOMMENT'
const UPDATECOMMENT = 'UPDATECOMMENT'
const REMOVECOMMENT = 'REMOVECOMMENT'
const RESTORECOMMENT = 'RESTORECOMMENT'
const SETSEARCH = 'SETSEARCH'
const SETUUID = 'SETUUID'
const SCROLLEND = 'SCROLLEND'
const MYCHANNELS = 'MYCHANNELS'

export const addPost = (post) => {
  post.key = post.key || shortid.generate()
  return {
    type: ADDPOST,
    post,
  }
}

export const initPosts = () => {
  return {
    type: INITPOSTS,
  }
}

export const setPosts = (posts) => {
  return {
    type: SETPOSTS,
    posts,
  }
}

export const scrollEnd = (posts) => {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: SCROLLEND,
    posts,
  }
}

export const addPosts = (posts) => {
  return {
    type: ADDPOSTS,
    posts,
  }
}

export const deletePost = (key) => {
  return { type: DELETEPOST, key }
}

export const removePost = (fn) => {
  return { type: REMOVEPOST, predi: fn }
}

export const viewPost = (key) => {
  return { type: VIEWPOST, key }
}

export const restorePost = (key) => {
  return { type: RESTOREPOST, key }
}

export const updatePost = (post) => {
  return {
    type: UPDATEPOST,
    post,
  }
}

export const updateComment = (comment) => {
  return {
    type: UPDATECOMMENT,
    comment,
  }
}

export const deleteComment = (key) => {
  return { type: DELETECOMMENT, key }
}

export const removeComment = (key) => {
  return { type: REMOVECOMMENT, key }
}

export const addComment = (comment) => {
  return {
    type: ADDCOMMENT,
    comment,
  }
}

export const addComments = (comments) => {
  return {
    type: ADDCOMMENTS,
    comments,
  }
}

export const addCommentsAsync = (postKey) => {
  return async (dispatch) => {
    const res = await ctx.api.getComments(postKey)
    dispatch(addComments(res.comments))
  }
}

export const restoreComment = (key) => {
  return { type: RESTORECOMMENT, key }
}

export const setSearch = (word) => {
  return {
    type: SETSEARCH,
    search: word,
  }
}

export const setUuid = (uuid) => {
  return {
    type: SETUUID,
    uuid,
  }
}

export const myChannels = (channels) => {
  return {
    type: MYCHANNELS,
    channels,
  }
}

export default {
  type: {
    ADDPOST,
    ADDPOSTS,
    INITPOSTS,
    SETPOSTS,
    DELETEPOST,
    UPDATEPOST,
    REMOVEPOST,
    RESTOREPOST,
    VIEWPOST, // 조회수 +1
    ADDCOMMENT,
    ADDCOMMENTS,
    DELETECOMMENT,
    UPDATECOMMENT,
    REMOVECOMMENT,
    RESTORECOMMENT,
    SETSEARCH,
    SETUUID,
    SCROLLEND,
    MYCHANNELS,
  },
  addPost,
  addPosts,
  initPosts,
  setPosts,
  deletePost,
  updatePost,
  removePost,
  restorePost,
  viewPost,
  addComment,
  addComments,
  deleteComment,
  updateComment,
  removeComment,
  restoreComment,
  setSearch,
  setUuid,
  scrollEnd,
  myChannels,
}
