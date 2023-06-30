const postModel = require('./../model/post.model');
const userModel = require('../model/users.model');
const PostImgModel = require('../model/postImg.model');
const catchAsync = require('./../utils/catchAsync');
const { db } = require('../database/config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');

exports.findAllPost = catchAsync(async (req, res, next) => {
  const posts = await postModel.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['userId', 'status'],
    },
    order: [['createdAt', 'DESC']],
    limit: 10,
    include: [
      {
        model: userModel,
        attributes: ['id', 'name', 'email', 'description', 'profileImgUrl'],
      },
      {
        model: PostImgModel,
      },
    ],
  });
  //un map para acceder a cada post//
  const allPostsPromise = posts.map(async (post) => {
    //dentro de cada post tomames la propiedad postImgs, para esto creamos un array de esta propiedad con map//
    const postPromise = post.postImgs.map(async (postImg) => {
      //dentro de postImgs usaremos su propiedad postImg y la convertiremos en su fomra https//
      const postImgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(postImgRef);
      // ya obtenida la forma https alteramos la propiedad "postImgUrl" del objeto "postImg"//
      postImg.postImgUrl = url;

      return postImg;
    });
    const postPromiseResolved = await Promise.all(postPromise);
    post.postImgs = postPromiseResolved;

    //cambio img de perfil//
    const imfRefUser = ref(storage, post.user.profileImgUrl);
    const urlProfile = await getDownloadURL(imfRefUser);
    post.user.profileImgUrl = urlProfile;

    return post;
  });

  const postResult = await Promise.all(allPostsPromise);

  return res.status(200).json({
    message: 'all post',
    status: 'succes',
    resylts: posts.length,
    posts: postResult,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, content } = req.body;
  console.log(req.body);
  console.log(req.files);

  const newPost = await postModel.create({
    title,
    content,
    userId: sessionUser.id,
  });

  const postImgsPromises = req.files.map(async (file) => {
    const imgRef = ref(storage, `posts/${Date.now()}-${file.originalname}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await PostImgModel.create({
      postId: newPost.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgsPromises);

  return res.status(200).json({
    message: 'post created',
    status: 'succes',
    newPost,
  });
});

exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  //cambiar img del usuario q creo el post//
  const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
  const url = await getDownloadURL(imgRefUserProfile);
  post.user.profileImgUrl = url;

  //cambiar las img del post//
  const postPromise = post.postImgs.map(async (postImg) => {
    const postImgRef = ref(storage, postImg.postImgUrl);
    const url = await getDownloadURL(postImgRef);
    postImg.postImgUrl = url;
    return postImg;
  });

  //cambiar img de los usuarios q comentan//
  const commentsUserImgPromise = post.comments.map(async (comment) => {
    const imgRef = ref(storage, comment.user.profileImgUrl);
    const url = await getDownloadURL(imgRef);
    comment.user.profileImgUrl = url;
    return comment;
  });
  //juntar las promesas y luego llamar promise all//
  const arrPromise = [...postPromise, ...commentsUserImgPromise];
  await Promise.all(arrPromise);

  return res.status(200).json({
    message: 'get one post',
    status: 'succes',
    post,
  });
});

exports.findMyPost = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  // const query = `SELECT * FROM posts WHERE "userId" = :iduser AND status = :status`;

  // const [rows, fields] = await db.query(query, {
  //   replacements: {
  //     iduser: sessionUser.id,
  //     status: 'active',
  //   },
  // });

  // res.status(200).json({
  //   status: 'success',
  //   results: fields.rowCount,
  //   posts: rows,
  // });

  const allMyPosts = await postModel.findAll({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: PostImgModel,
      },
    ],
  });

  const allPostsPromise = allMyPosts.map(async (post) => {
    //dentro de cada post tomames la propiedad postImgs, para esto creamos un array de esta propiedad con map//
    const postPromise = post.postImgs.map(async (postImg) => {
      //dentro de postImgs usaremos su propiedad postImg y la convertiremos en su fomra https//
      const postImgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(postImgRef);
      // ya obtenida la forma https alteramos la propiedad "postImgUrl" del objeto "postImg"//
      postImg.postImgUrl = url;

      return postImg;
    });
    const postPromiseResolved = await Promise.all(postPromise);
    post.postImgs = postPromiseResolved;

    return post;
  });

  const postResult = await Promise.all(allPostsPromise);



  res.status(200).json({
    status: 'success',
    results: allMyPosts.length,
    posts: postResult,
  });
});

exports.findUserPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const posts = await Post.findAll({
    where: {
      userId: id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'passwordChangedAt'] },
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  const { title, content } = req.body;

  const postUpdate = await post.update({ title, content });

  return res.status(200).json({
    message: 'post update',
    status: 'succes',
    postUpdate,
  });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  const deletePost = await post.update({ status: 'disable' });

  return res.status(200).json({
    message: 'post deleted',
    status: 'succes',
    deletePost,
  });
});
