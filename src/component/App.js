import { css } from 'glamor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../actions';
import { Button } from 'reactstrap';
import logo from '../img/image.jpg';
import InfiniteScroll from "react-infinite-scroll-component";

axios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
axios.defaults.baseURL = "http://localhost:4000/mycart/api";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skip: 0,
            limit: 10,
            productList: [],
            countCartItem: 0
        };
        this.productListHTML = this.productListHTML.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.logout = this.logout.bind(this);
        this.fetchMoreData = this.fetchMoreData.bind(this);

    }

    async componentWillMount() {
        let result1 = await auth.check()
        if (!result1) {
            this.props.history.push('/');
        }
        let result2 = await auth.fetchProductList(this.state.skip, this.state.limit);
        this.setState({
            productList: result2
        })
        let userData = await auth.getUserDetails();
        if (userData) {
            this.setState({
                countCartItem: userData.cart.length
            })
        }
    }

    async fetchMoreData() {
        let result2 = await auth.fetchProductList(this.state.skip, this.state.limit);
        let final = [...this.state.productList, ...result2]
        let newskip = 10 + this.state.skip;
        this.setState({
            productList: final,
            skip: newskip
        })
    };

    async addToCart(name) {
        let result = await auth.addProductToCart(name);
        if (result) {
            let count = this.state.countCartItem;
            count++;
            this.setState({
                countCartItem: count
            })
        }
        else {
            alert("This Product is already in Cart");
        }
    }

    productListHTML() {
        // var _self = this;
        return this.state.productList.map((name) => {
            return <div style={{ border: 'solid', width: '250px', height: '300px', margin: '30px', display: "inline-block" }}>
                <img src={logo} alt="Avatar" style={{ width: "135px", height: "28%" }} />
                {/* <div style={{ padding: '2px 16px' }}> */}
                <div>
                    <h4><b>{name.name}</b></h4>
                    <p>Price : {name.price} ruppees</p>
                    <p>Description : {name.description}</p>
                    <p>manufacturedBy : {name.manufacturedBy}</p>
                </div>
                <Button style={{ width: '100%', height: "13%", margin: '0 auto', padding: '15px' }} onClick={() => this.addToCart(name)}>Add to Cart</Button>
            </div>;
        })
    }

    async logout() {
        let t = await auth.logout();
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <div style={{ position:'fixed',backgroundColor: 'yellow', width: '100%', height:'50px', marginTop: '-21px' }}>
                    <span style={{ textAlign: 'center', margin: '20px 1050px 20px 20px', width: '100%' }}>
                        <Link to="/signup">My Cart : {this.state.countCartItem} items</Link>
                    </span>
                    <span style={{textAlign: 'right', margin: '20px auto 20px 420px', width: '100%' }}>
                        <Link to="#" onClick={this.logout}>Logout</Link>
                    </span>
                </div>
                <h4>List Of Products Available</h4>
                {/* <div style={{ paddingTop: '10px' }}>
                    {this.productListHTML()}
                </div> */}
                <InfiniteScroll
                    dataLength={this.state.productList.length}
                    next={this.fetchMoreData}
                    hasMore={true}
                // loader={<h4>Loading...</h4>}
                >
                    <div style={{ paddingTop: '10px' }}>
                        {this.productListHTML()}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

}
