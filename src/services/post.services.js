const PostModel = require('../model/post.model');
const UserModel = require('../model/users.model');
const PostImg = require('../model/postImg.model');
const appError = require('../utils/appError');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');

class PostServices {
  async findPost(id) {
    try {
      const post = await PostModel.findOne({
        where: {
          id,
          status: 'active',
        },
        attributes: {
          exclude: ['userId', 'status'],
        },
        include: [
          {
            model: UserModel,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
          {
            model: PostImg,
          },
        ],
      });

      if (!post) {
        throw new appError('post not found', 404);
      }
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async downloadImgsPost(post) {
    try {
      const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
      const urlProfileUser = await getDownloadURL(imgRefUserProfile);

      post.user.profileImgUrl = urlProfileUser;

      const postImgsPromises = post.postImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);

        postImg.postImgUrl = url;
        return postImg;
      });

      await Promise.all(postImgsPromises);

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PostServices;
