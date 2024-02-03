import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await UsersController.get({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    const user = await UsersController.getById(uid);
    if (!user) {
      return res.status(401).json({ message: `User id ${uid} not found 😨.` });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const user = await UsersController.create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:uid', async (req, res, next) => {
  try {
    const { body, params: { uid } } = req;
    const updateResult = await UsersController.update(uid, body);
    if (updateResult) {
      // Usuario actualizado correctamente, devolver datos actualizados
      res.status(200).json(updateResult);
    } else {
      // Usuario no encontrado
      res.status(404).json({ message: `User id ${uid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});


router.delete('/:uid', async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    const deleteResult = await UsersController.delete(uid);
    if (deleteResult) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: `User id ${uid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});




export default router;