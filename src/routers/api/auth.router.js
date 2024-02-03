import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import passport from 'passport';
import { generateToken, validateToken, authMiddleware, authRolesMiddleware } from '../../utils/utils.js'



const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const newUser = await UsersController.register(req.body);
    if (newUser) {
      res.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No estas autentificado' });
  }
  const payload = await validateToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'No estas autentificado' });
  }
  req.user = payload;
  next();
}

router.post('/login', UsersController.login);

router.get('/current', authMiddleware('jwt'), authRolesMiddleware('admin'), (req, res) => {
  res.status(200).send(req.user);
});

export default router;
