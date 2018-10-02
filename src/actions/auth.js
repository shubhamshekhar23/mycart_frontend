import axios from 'axios';
// import { session } from '../ext';

export default {

    async getUserDetails() {
        try {
            let user = JSON.parse(localStorage.getItem('user')) 
            return user;
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async addProductToCart(prod) {
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            let userdata = await axios.post(`/user/${user._id}/addproduct/${prod._id}`,{})
            localStorage.setItem('user', JSON.stringify(userdata.data));
            return true;
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async fetchProductList(skip, limit) {
        try {
            let prodArr = await axios.get('/product/list', { params: { skip: skip, limit: limit }})
            return prodArr.data;
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async check() {
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            let t = await axios.get(`user/${user._id}`)
            return true
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async login(email, password) {
        let data = {
            email: email,
            password: password
        }
        try {
            delete axios.defaults.headers.common["authorization"];
            let t = await axios.post('/login', data)
            localStorage.setItem('token', JSON.stringify(t.data.token));
            localStorage.setItem('user', JSON.stringify(t.data.customer));
            axios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
            return true
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async signup(postdata) {
        try {
            delete axios.defaults.headers.common["authorization"];
            let t = await axios.post('/signup', postdata)
            localStorage.setItem('token', JSON.stringify(t.data.token));
            localStorage.setItem('user', JSON.stringify(t.data.customer));
            axios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
            return true
        }
        catch (err) {
            console.log(err)
            return false
        }
    },

    async logout() {
        try {
            // axios.defaults.headers.common['Authorization'] =  localStorage.getItem('token');
            let user = JSON.parse(localStorage.getItem('user'))
            let t = await axios.get(`/user/${user._id}/logout`)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return true
        }
        catch (err) {
            console.log(err)
            return false
        }
    }

}

