import express from 'express';
import path from 'path';
import { RequestManager } from './handlers/requesManager.js';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'sasadaDev',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 3 * 1000,
      secure: false,
      httpOnly: true,
    },
  })
);

app.listen(port, () => console.log('server working on ' + port));

const requesManager = RequestManager.getInstance();
requesManager.init(app);


