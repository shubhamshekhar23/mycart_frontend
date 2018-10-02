import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { css } from 'glamor';
import isemail from 'is-email';
import { auth } from '../actions';
import {  Button, Input } from "reactstrap";

export default class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postUser: {
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            },
            password1: "",
            password2: "",
            passwordErr: null,
            emailErr: null,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword1 = this.handleChangePassword1.bind(this);
        this.handleChangePassword2 = this.handleChangePassword2.bind(this);
        this.handleChangeName1 = this.handleChangeName1.bind(this);
        this.handleChangeName2 = this.handleChangeName2.bind(this);
        this.finalCheck = this.finalCheck.bind(this);
    }

    async componentWillMount() {
        let result = await auth.check()
        if (result) {
            this.props.history.push('/home');
        }
    }

    validateForm() {
        return isemail(this.state.email) && this.state.password.length > 0;
    }

    handleChangeEmail = event => {
        this.setState({
            postUser: { ...this.state.postUser, email: event.target.value }
        });
    }

    handleChangeName1 = event => {
        this.setState({
            postUser: { ...this.state.postUser, firstName: event.target.value }
        });
    }

    handleChangeName2 = event => {
        this.setState({
            postUser: { ...this.state.postUser, lastName: event.target.value }
        });
    }

    handleChangePassword1 = event => {
        this.setState({
            password1: event.target.value
        });
    }

    handleChangePassword2 = event => {
        this.setState({
            password2: event.target.value
        });
    }

    finalCheck = () => {
        if (this.state.password1 != this.state.password2 || !this.state.password1.length || !this.state.password2.length) {
            this.setState({ passwordErr: true })
            return false;
        }
        else {
            this.setState({
                postUser: { ...this.state.postUser, password: this.state.password1 }
            });
        }
        if (!isemail(this.state.postUser.email)) {
            this.setState({ emailErr: true })
            return false;
        }
        if (!this.state.postUser.firstName.length || !this.state.postUser.lastName.length) {
            this.setState({ fillErr: true })
            return false;
        }
        return true;
    }

    handleSubmit = async (event) => {
        this.state.emailErr = false;
        this.state.passwordErr = false;
        this.state.serverErr = false;
        this.state.fillErr = false;
        event.preventDefault();
        if (this.finalCheck()) {
            let result = await auth.signup(this.state.postUser)
            if (result === true) {
                this.props.history.push('/home')
            }
            else {
                this.setState({ serverErr: true })
            }
        }
    }

    render() {
        return (
            <div {...css({ width: '100%', textAlign: 'center', marginTop: '120px' })}>
                <h1>SignUp</h1>
                <p className="text-muted">(Provide your details)</p>
                <p className="text-muted">First Name</p>
                <Input type="text" placeholder="FirstName" value={this.state.postUser.firstName}
                    onChange={this.handleChangeName1} />
                <p className="text-muted">Last Name</p>
                <Input type="text" placeholder="LastName" value={this.state.postUser.lastName}
                    onChange={this.handleChangeName2} />
                <p className="text-muted">Email</p>
                <Input type="text" placeholder="Email" value={this.state.postUser.email}
                    onChange={this.handleChangeEmail} />
                <p className="text-muted">Password</p>
                <Input type="password" placeholder="Password" value={this.state.password1}
                    onChange={this.handleChangePassword1} />
                <p className="text-muted">Re-Enter Password</p>
                <Input type="password" placeholder="ReEnter Password" value={this.state.password2}
                    onChange={this.handleChangePassword2} />
                <Button color="primary" className="px-4" onClick={this.handleSubmit}>SignUp</Button>
                <p>Go to Login ?</p> <Link to="/">Log in</Link>

                {this.state.serverErr ? (<p>Email Already has been used </p>) : null}
                {this.state.passwordErr ? (<p>password does not match</p>) : null}
                {this.state.emailErr ? (<p>Email is not of valid format</p>) : null}
                {this.state.fillErr ? (<p>Please fill all the fields</p>) : null}
            </div>
        );
    }
}
