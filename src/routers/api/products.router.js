import { Router } from 'express';
import { buildResponsePaginated } from '../../utils/utils.js'
import ProductModel from '../../dao/models/product.model.js'
import CustomError from '../../utils/CustomError.js'
import EnumsError from '../../utils/EnumsError.js'
import { generatorIdError, generatorProductError } from '../../utils/CauseMessageError.js';
import ProductMongoDbDao from '../../dao/product.mongodb.dao.js';

const router = Router();

const baseUrl = 'http://localhost:8080/'


router.get('/', async (req, res) => {
  const { limit = 8, page = 1, sort, search } = req.query;
  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  const result = await ProductModel.paginate(criteria, options);

  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl, search, sort);
  res.status(200).json(data);
});

router.get('/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await ProductMongoDbDao.getById(pid);

    if (product) {
      res.status(200).json(product);
    } else {
      CustomError.create({
        name: 'Invalid id',
        cause: generatorIdError(pid),
        message: 'Ocurrio un error mientras se obtenía un producto.',
        code: EnumsError.BAD_REQUEST_ERROR
      });
    }
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const {
      title,
      description,
      category,
      price,
      code,
      stock,
      thumbnail
    } = body;
    console.log(title, description, category, price, code, stock, thumbnail)
    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !code ||
      !stock ||
      !thumbnail
    ) {
      CustomError.create({
        name: 'Invalid data product',
        cause: generatorProductError({
          title,
          description,
          category,
          price,
          code,
          stock,
          thumbnail
        }),
        message: 'Ocurrio un error mientras se intentaba crear un nuevo producto.',
        code: EnumsError.BAD_REQUEST_ERROR
      })
    }

    const product = await ProductMongoDbDao.create(body)
    res.status(201).json(product)
  } catch (error) {
    next(error);
  }
})


export default router;


