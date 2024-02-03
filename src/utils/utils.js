import path from 'path';
import url from 'url';
import JWT from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


export const buildResponsePaginated = (data, baseUrl = URL_BASE, search = '', sort = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    return {
        status: 'success',
        payload: data.docs.map((doc) => doc.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.prevPage}${searchParam}${sort ? `&sort=${sort}` : ''}` : null,
        nextLink: data.hasNextPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.nextPage}${searchParam}${sort ? `&sort=${sort}` : ''}` : null,
    }
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);


export const generateToken = (user) => {
    const { id, name, email, role } = user;
    const payload = { id, name, email, role };
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export const validateToken = (token) => {
    return new Promise((resolve) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return resolve(false);
            }
            console.log('payload', payload);
            resolve(payload);
        })
    });
}

export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
        }
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
};

export const authRolesMiddleware = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role: userRole } = req.user;
    if (userRole !== role) {
        return res.status(403).json({ message: 'No permissions' });
    }
    next();
};
