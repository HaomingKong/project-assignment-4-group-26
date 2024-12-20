import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 12
	const page = Number(req.query.pageNumber) || 1
	const keyword = req.query.keyword
		? {
			name: {
				$regex: req.query.keyword,
				$options: 'i', // 忽略大小写
			},
		}
		: {}

	const category = req.query.category
		? { category: req.query.category }
		: {}

	// 结合 keyword 和 category 进行搜索
	const filter = {
		...keyword,
		...category,
	}

	const count = await Product.countDocuments({ ...filter }) // 匹配的总产品数
	const products = await Product.find({ ...filter })
		.limit(pageSize)
		.skip(pageSize * (page - 1))

	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})


const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)

	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)

	if (product) {
		await product.remove()
		res.json({ message: 'Product removed' })
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})

const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample brand',
		category: 'Sample category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample description',
	})

	const createdProduct = await product.save()
	res.status(201).json(createdProduct)
})

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
	} = req.body

	const product = await Product.findById(req.params.id)

	if (product) {
		product.name = name || product.name
		product.price = price || product.price
		product.description = description || product.description
		product.image = image || product.image
		product.brand = brand || product.brand
		product.category = category || product.category
		product.countInStock = countInStock || product.countInStock

		const updatedProduct = await product.save()
		res.status(200).json(updatedProduct)
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})

// @desc    Create a new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body

	const product = await Product.findById(req.params.id)

	if (product) {
		// Check if the user already reviewed this product
		const alreadyReviewed = product.reviews.find(
			(r) => r.user.toString() === req.user._id.toString()
		)

		if (alreadyReviewed) {
			res.status(400)
			throw new Error('Product already reviewed')
		}

		// Add new review
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		}

		product.reviews.push(review)
		product.numReviews = product.reviews.length

		// Update product rating
		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length

		await product.save()
		res.status(201).json({ message: 'Review added' })
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})

const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3)

	res.json(products)
})

const getProductsByCategory = asyncHandler(async (req, res) => {
	const category = req.params.category || ''
	const pageSize = 12
	const page = Number(req.query.pageNumber) || 1

	if (!category) {
		res.status(400)
		throw new Error('Category is required')
	}

	const count = await Product.countDocuments({ category })
	const products = await Product.find({ category })
		.limit(pageSize)
		.skip(pageSize * (page - 1))

	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts,
	getProductsByCategory, // 新增导出
}
