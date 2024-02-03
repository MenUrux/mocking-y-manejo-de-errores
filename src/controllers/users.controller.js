import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import CartModel from '../dao/models/cart.model.js';

dotenv.config();

const jwtSecret = process.env.SESSION_SECRET; // Usar la variable de entorno
const jwtExpiration = '1h';

import UserDao from "../dao/user.mongodb.dao.js"

export default class UsersController {

    static async get(filter = {}, opts = {}) {
        const users = await UserDao.get(filter, opts);
        console.log(`Usuarios encontrados: ${users.length}`);
        return users;
    }

    static async getById(uid) {
        const user = await UserDao.getById(uid);
        if (user) {
            console.log(`Se encontro el usuario exitosamente ${JSON.stringify(user)}`);
        }
        return user;
    }

    static async create(data) {
        const user = await UserDao.create(data);
        console.log(`Se creo el usuario exitosamente ${JSON.stringify(user)}`);
        return user;
    }

    static async update(uid, data) {
        const updateResult = await UserDao.updateById(uid, data);
        if (updateResult.modifiedCount === 0) {
            return null;
        }
        const updatedUser = await UserDao.getById(uid);
        return updatedUser;
    }

    static async delete(uid) {
        const deleteResult = await UserDao.deleteById(uid);
        if (deleteResult) {
            console.log(`Usuario eliminado exitosamente.`);
        }
        return deleteResult;
    }

    // Controladores de auth

    static async register(userData) {
        /*   try {
              const { email, password, ...rest } = userData;
              const existingUser = await UserDao.get({ email });
  
              if (existingUser.length > 0) {
                  throw new Error('El usuario ya existe.'); // Lanza un error en lugar de enviar una respuesta
              }
  
              // Hashear la contraseña antes de guardarla en la base de datos
              const hashedPassword = bcrypt.hashSync(password, 10);
              const newUser = await UserDao.create({ email, password: hashedPassword, ...rest });
  
              // Crear un carrito vacío para el nuevo usuario
              await CartModel.create({ user: newUser._id, products: [] });
  
              const userCart = await CartModel.findOne({ user: newUser._id }).populate('products.product');
              console.log(userCart)
  
              const updatedUser = await UserDao.getById(newUser._id);
              return updatedUser;
          } catch (error) {
              throw error;
          } */
    }

    static async login(req, res) {
        try {

            const { email, password } = req.body;

            try {
                const user = await UserModel.findOne({ email });
                if (!user || !isValidPassword(password, user)) {
                    return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
                }

                const token = generateToken(user);
                res.status(200).json({ access_token: token });
            } catch (error) {
                res.status(500).json({ message: 'Error interno del servidor.' });
            }
        } catch (error) {
            return res.status(500).send('Error al iniciar sesión.');
        }
    }

    // static async login(req, res) {
    //     /*    const { email, password } = req.body;

    //        try {
    //            const user = await User.findOne({ email });

    //            if (!user || user.password !== password) {
    //                return res.status(401).json({ message: 'Correo o contraseña inválidos.' });
    //            }

    //            const token = generateToken(user);
    //            res.cookie('token', token, {
    //                maxAge: 1000 * 60 * 60, // 1 hora
    //                httpOnly: true,
    //            }).status(200).json({ status: 'success', token });
    //        } catch (error) {
    //            res.status(500).json({ message: 'Error interno del servidor.' });
    //        } */
    // }

    static async getCurrentUser(req, res) {
        /*  const { token } = req.cookies;
     
         if (!token) {
             return res.status(401).json({ message: 'No autorizado.' });
         }
     
         try {
             const payload = await validateToken(token);
             const user = await User.findById(payload.id);
     
             if (!user) {
                 return res.status(401).json({ message: 'No autorizado.' });
             }
     
             res.status(200).json(user);
         } catch (error) {
             res.status(500).json({ message: 'Error interno del servidor.' });
         } */
    }

    static async logout(req, res) {
        // Si estás usando sesiones:
        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error al cerrar sesión.');
            res.send('Sesión cerrada con éxito.');
        });

        // Si estás usando JWT, no hay necesidad de manejarlo aquí
    }

}