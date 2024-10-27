import { RequestHandler } from './requestHandler.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

export class PostRequestHandler extends RequestHandler {
  constructor(app) {
    super(app);
  }
  _init() {
    this._handle('/login', async (req, res) => {
      try {
        const parsedData = await this.#getUsersData();
        const { username, password } = req.body;
        let user = parsedData.users.find((user) => user.username == username);
        if (!user)
          return res.status(400).json({
            messageToAllert: 'Incorrect password or username',
          });
        const isPasswordLegit = await bcrypt.compare(password, user.password);
        if (!isPasswordLegit)
          return res.status(400).json({
            messageToAllert: 'Incorrect password or username',
          });
        req.session.userID = username;
        res.redirect('/home');
      } catch (e) {
        console.log(e);
        res.status(500).json({ messageToAllert: 'Internal server error' });
      }
    });
    this._handle('/register', async (req, res) => {
      try {
        const { username, password } = req.body;
        const parsedData = await this.#getUsersData();
        const isUserExists = parsedData.users.find(
          (user) => user.username == username
        );

        if (isUserExists)
          return res.status(400).json({
            messageToAllert: 'the user with this name is alredy exists!',
          });

        if (password[0] != password[1])
          return res.status(400).json({
            messageToAllert: "passwords aren't the same",
          });

        const hashedPassword = await bcrypt.hash(password[0], 10);

        parsedData.users.push({ username, password: hashedPassword });

        await this.#saveUsersData(parsedData);

        const likeDB = await this.#getLikesData();
        likeDB[username] = [];
        await this.#saveLikesData(likeDB);
      } catch (e) {
        console.log(e);
        res.status(500).json({ messageToAllert: 'Internal server error' });
      }
      res.redirect('/login');
    });

    this._handle('/set-user-theme', (req, res) => {
      if (!req.body.theme)
        return res.json({
          success: false,
        });
      req.session.theme = req.body.theme;
      res.json({
        success: true,
      });
    });

    this._handle('/log-out', (req, res) => {
      req.session.destroy((e) => {
        if (e) return res.status(500).json({ success: false });
        res.clearCookie('connect.sid');
        return res.json({ success: true, redirectUrl: '/' });
      });
    });
    this._handle('/submit_post', async (req, res) => {
      if (!req.session.userID) return res.status(401).redirect('/');
      try {
        if (!req.session.lastPostData)
          throw new Error('last post data is undefined');
        const postTitle = req.body.title;
        const postContent = req.body.content;
        const parsedData = await this.#getPostsData();
        let lastIndex = parsedData.posts[parsedData.posts.length - 1].postId;
        let date = new Date();
        let dateToSend = `${
          date.getMonth() + 1
        }/${date.getUTCDate()}/${date.getFullYear()}`;

        parsedData.posts.push({
          postId: lastIndex + 1,
          username: req.session.userID,
          date: dateToSend,
          statistics: 0,
          content: postContent,
          title: postTitle,
        });

        await this.#savePostsData(parsedData);
      } catch (e) {
        console.error('Error on /submit_post: ', e);
      }
      res.redirect('/my-posts');
    });
    this._handle('/open-post', (req, res) => {
      const postID = req.body.ID;
      if (!postID) return res.json({ success: false, redirectUrl: '/' });
      req.session.lastSelectedPost = postID;
      res.json({ success: true, redirectUrl: '/full-post' });
    });
    this._handle('/like-post', async (req, res) => {
      if (!req.session.userID)
        return res.status(401).json({
          success: false,
        });
      const postID = req.body.postID;
      let parsedData = await this.#getLikesData();
      let likeArray = parsedData[req.session.userID];
      let deleteIndex = -1;
      let isLiked =
        likeArray.find((like, index) => {
          deleteIndex = index;
          return like == postID;
        }) != null;
      if (isLiked) {
        likeArray.splice(deleteIndex, 1);
      } else likeArray.push(postID);
      this.#likePost(postID, !isLiked);
      parsedData[req.session.userID] = likeArray;
      await this.#saveLikesData(parsedData);
      return res.json({
        success: true,
      });
    });
  }

  _handle(path, action) {
    this._app.post(path, action);
  }
  async #getUsersData() {
    const data = await fs.promises.readFile('../db/users.json', 'utf8');
    return JSON.parse(data);
  }

  async #getPostsData() {
    return JSON.parse(await fs.promises.readFile('../db/posts.json', 'utf8'));
  }

  async #saveUsersData(data) {
    await fs.promises.writeFile(
      '../db/users.json',
      JSON.stringify(data, null, 2)
    );
  }

  async #savePostsData(parsedData) {
    await fs.promises.writeFile(
      '../db/posts.json',
      JSON.stringify(parsedData, null, 2)
    );
  }

  async #getLikesData() {
    const data = await fs.promises.readFile('../db/likes.json', 'utf8');
    return JSON.parse(data);
  }
  async #saveLikesData(data) {
    await fs.promises.writeFile(
      '../db/likes.json',
      JSON.stringify(data, null, 2)
    );
  }
  async #likePost(postID, increase = true) {
    const parsedData = await this.#getPostsData();
    parsedData.posts.forEach((post) => {
      if (post.postId == postID) {
        post.statistics = increase ? post.statistics + 1 : post.statistics - 1;
        return;
      }
    });
    await this.#savePostsData(parsedData);
  }
}
