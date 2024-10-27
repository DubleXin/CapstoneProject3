import { DeleteRequesHandler } from './deleteRequesHandler.js';
import { GetRequestHandler } from './getRequestHandler.js';
import { PostRequestHandler } from './postRequestHandler.js';

export class RequestManager {
  static instance;

  constructor() {
    if (RequestManager.instance) {
      console.warn('The instance is already created');
      return RequestManager.instance;
    }
    RequestManager.instance = this;
  }

  static getInstance() {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  init(app) {
    new GetRequestHandler(app);
    new PostRequestHandler(app);
    new DeleteRequesHandler(app);
  }
}
