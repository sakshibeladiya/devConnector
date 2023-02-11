import axios from 'axios';
import { setAlert } from './alert';
import {
    DELETE_POST,
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    UPDATE_LIKES,
    ADD_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:8000/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
}

//ADD POST LIKE
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:8000/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {
                id,
                likes: res.data
            }
        })


    } catch (err) {
        console.log('like error', err)
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
}

//REMOVE POST LIKE
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:8000/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
}

//delete POST 
export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`http://localhost:8000/api/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        });
        dispatch(setAlert('Post Removed', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
}
//add POST 
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`http://localhost:8000/api/posts`, formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });
        dispatch(setAlert('Post Created', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
};

//GET POST
export const getPost = ({ id }) => async dispatch => {

    try {
        const res = await axios.get(`http://localhost:8000/api/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
};

//add COMMENT
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`http://localhost:8000/api/posts/comment/${postId}`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('comment Added', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
};

//remove COMMENT
export const deleteComment = (commentId, postId) => async dispatch => {
    console.log('frgxthyjugjhgsre')
    try {
        await axios.delete(`http://localhost:8000/api/posts/comment/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });
        dispatch(setAlert('comment Removed', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response, status: err.response }
        });
    }
};