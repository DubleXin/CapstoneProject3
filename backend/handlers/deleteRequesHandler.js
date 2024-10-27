import { RequestHandler } from './requestHandler.js';
import fs from 'fs';

export class DeleteRequesHandler extends RequestHandler {
  constructor(app) {
    super(app);
  }
  _init() {
    this._handle('/delete-post', async (req, res) => {
      const postId = req.body.id;

      let postData = await this.#getPostData();
      const posts = postData.posts;
      let deleteItemIndex = 0;
      const postToDelete = posts.find((post, index) => {
        deleteItemIndex = index;
        return post.postId == postId;
      });
      if (postToDelete.username != req.session.userID)
        return res.json({
          success: false,
        });

      postData.posts.splice(deleteItemIndex, 1);
      await this.#savePostData(postData);

      return res.json({
        success: true,
      });
    });
  }
  _handle(path, action) {
    this._app.delete(path, action);
  }
  async #getPostData() {
    const data = await fs.promises.readFile('../db/posts.json', 'utf8');
    return JSON.parse(data);
  }

  async #savePostData(data) {
    await fs.promises.writeFile(
      '../db/posts.json',
      JSON.stringify(data, null, 2)
    );
  }
}
