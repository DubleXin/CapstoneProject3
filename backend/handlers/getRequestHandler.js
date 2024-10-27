import { RequestHandler } from './requestHandler.js';
import fs from 'fs';

export class GetRequestHandler extends RequestHandler {
  constructor(app) {
    super(app);
  }
  _init() {
    this._handle('/', (_req, res) => res.redirect('/home'));
    this._handle('/home', async (_req, res) => {
      const postData = await this.#getPostData();

      return res.render('posts-page', { data: postData.posts });
    });
    this._handle('/login', (req, res) => {
      if (!req.session.userID) return res.render('login');
      res.redirect('personal');
    });
    this._handle('/register', (req, res) => {
      if (!req.session.userID) return res.render('register');
      res.redirect('personal');
    });
    this._handle('/my-posts', async (req, res) => {
      if (!req.session.userID) return res.redirect('/home');
      const postData = await this.#getPostData();
      const user = req.session.userID;
      const dataToRender = postData.posts.filter(
        (post) => post.username == user
      );

      return res.render('posts-page', {
        data: dataToRender,
        isPersonalPage: true,
      });
    });
    this._handle('/personal', async (req, res) => {
      if (!req.session.userID) return res.redirect('/home');
      const data = await this.#getPostData();
      const user = req.session.userID;
      const dataToSend = data.posts.filter((post) => post.username == user);
      const startIndex = dataToSend.length - 4 < 0 ? 0 : dataToSend.length - 4;
      const endIndex = dataToSend.length;
      res.render('personal', { data: dataToSend.slice(startIndex, endIndex) });
    });

    this._handle('/get-user-session', (req, res) => {
      if (!req.session.userID) {
        res.status(401).json({
          success: false,
        });
        return;
      }
      res.json({
        success: true,
        username: req.session.userID,
        theme: req.session.theme || 'dark',
      });
    });
    this._handle('/create-new-post', (req, res) => {
      if (!req.session.userID)
        return res.json({
          success: false,
        });
      req.session.lastPostData = req.body;
      return res.json({
        success: true,
        redirectUrl: '/post-creation',
      });
    });
    this._handle('/post-creation', (req, res) => {
      if (!req.session.userID) return res.redirect('/');
      return res.render('post-creation');
    });

    this._handle('/full-post', async (req, res) => {
      if (!req.session.lastSelectedPost) return res.redirect('/');
      const lastPost = req.session.lastSelectedPost;
      const parsedData = await this.#getPostData();
      const posts = parsedData.posts;

      let postToRender = posts.find((post) => post.postId == lastPost);
      res.render('post-full', { data: postToRender });
    });
    this._handle('/get-user-likes', async (req, res) => {
      if (!req.session.userID)
        return res.status(401).json({
          success: false,
        });
      const parsedData = await this.#getLikesData();
      return res.json({ success: true, data: parsedData[req.session.userID] });
    });
  }
  _handle(path, action) {
    this._app.get(path, action);
  }

  async #getPostData() {
    const data = await fs.promises.readFile('../db/posts.json', 'utf8');
    return JSON.parse(data);
  }
  async #getLikesData() {
    const data = await fs.promises.readFile('../db/likes.json', 'utf8');
    return JSON.parse(data);
  }
}
