import axios from 'axios'
import {
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_LIST_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	PRODUCT_DELETE_REQUEST,
	PRODUCT_DELETE_SUCCESS,
	PRODUCT_DELETE_FAIL,
	PRODUCT_CREATE_REQUEST,
	PRODUCT_CREATE_SUCCESS,
	PRODUCT_CREATE_FAIL,
	PRODUCT_UPDATE_REQUEST,
	PRODUCT_UPDATE_SUCCESS,
	PRODUCT_UPDATE_FAIL,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAIL,
	PRODUCT_TOP_REQUEST,
	PRODUCT_TOP_SUCCESS,
	PRODUCT_TOP_FAIL,
} from '../constants/productConstants'

export const listProducts = (keyword = '', category = '', pageNumber = '') => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST })

		// 根据是否存在关键词和类别构造请求 URL
		let url = `/api/products?pageNumber=${pageNumber}`
		if (keyword) {
			url += `&keyword=${keyword}`
		}
		if (category) {
			url += `&category=${category}`
		}

		const { data } = await axios.get(url)

		dispatch({
			type: PRODUCT_LIST_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const listProductsByCategory = (category, pageNumber = '') => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST })

		// Make request to get products by category
		const { data } = await axios.get(
			`/api/products/category/${category}?pageNumber=${pageNumber}`
		)

		dispatch({
			type: PRODUCT_LIST_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to get a single product
export const listProductDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST })

		// Make request to get a single product
		const { data } = await axios.get(`/api/products/${id}`)

		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to delete a single product
export const deleteProduct = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_DELETE_REQUEST })

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.delete(`/api/products/${id}`, config)

		dispatch({ type: PRODUCT_DELETE_SUCCESS })
	} catch (error) {
		dispatch({
			type: PRODUCT_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to create a single product
export const createProduct = () => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CREATE_REQUEST })

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.post('/api/products', {}, config)

		dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to update a single product
export const updateProduct = (product) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_UPDATE_REQUEST })

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.put(
			`/api/products/${product._id}`,
			product,
			config
		)

		dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: PRODUCT_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to create a review on a single product
export const createProductReview = (productId, review) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.post(`/api/products/${productId}/reviews`, review, config)

		dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS })
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

// Actions to get 3 top rated products
export const listTopProducts = () => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_TOP_REQUEST })

		const { data } = await axios.get('/api/products/top')

		dispatch({
			type: PRODUCT_TOP_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_TOP_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
