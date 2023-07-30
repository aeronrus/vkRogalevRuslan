import express from 'express';
const app = express();
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import commentsRoutes from './routes/comments.js';
import likesRoutes from './routes/likes.js';
import friendsRoutes from './routes/friends.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/backend/upload', upload.single('file'), (req, res) => {
  const file = req.img;
  res.status(200).json(file.filename);
});

app.use('/backend/users', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/posts', postsRoutes);
app.use('/backend/comments', commentsRoutes);
app.use('/backend/likes', likesRoutes);
app.use('/backend/friends', friendsRoutes);

app.listen(9999, () => {
  console.log('working!');
});
