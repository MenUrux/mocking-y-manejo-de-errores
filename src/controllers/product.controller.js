import productDao from '../dao/product.mongodb.dao.js';

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productDao.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).send('Error al obtener productos');
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await productDao.getProductById(req.params.id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.json(product);
        } catch (error) {
            res.status(500).send('Error al obtener producto');
        }
    },

    createProduct: async (req, res) => {
        try {
            let relativePath = '';
            if (req.file) {
                relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
            }

            const newProductData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                code: req.body.code,
                stock: req.body.stock,
                thumbnail: relativePath
            };

            const newProduct = await productDao.createProduct(newProductData);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).send('Error al crear producto');
        }
    },

    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await productDao.updateProduct(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).send('Producto no encontrado');
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).send('Error al actualizar producto');
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await productDao.deleteProduct(req.params.id);
            res.status(200).send('Producto eliminado');
        } catch (error) {
            res.status(500).send('Error al eliminar producto');
        }
    },


    getPaginatedProducts: async (page, limit, sort, query) => {
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: sort || { createdAt: -1 } // Orden por defecto
        };

        const customQuery = query ? { title: { $regex: query, $options: 'i' } } : {};

        return await ProductModel.paginate(customQuery, options);
    }
};

export default productController;
