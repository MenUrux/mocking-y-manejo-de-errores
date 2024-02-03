import { Router } from 'express';
import passport from 'passport';
import { isAdmin } from '../../controllers/middlewares.controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: "Hello people" })
});

router.get('/test', passport.authenticate('jwt', { session: false }), isAdmin, (req, res) => {
  console.log(`Entraste a test-user`)
  res.status(200).json({ message: "No sos admin" })
});

router.get('/test-user', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(`Entraste a test-user`)
  res.status(200).json({ message: "User comun" })
});


export default router;