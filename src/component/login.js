import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { css } from 'glamor';
import isemail from 'is-email';
import { auth } from '../actions';
import { Button, Input } from "reactstrap";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      serverErr: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
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
      email: event.target.value
    });
  }

  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let result = await auth.login(this.state.email, this.state.password)
    if (result === true) {
      this.props.history.push('/home')
    }
    else {
      this.setState({ serverErr: true })
    }
  }

  render() {
    return (
      <div {...css({ width: '100%', textAlign: 'center', marginTop: '120px' })}>
        <h1>Login</h1>
        <p className="text-muted">Sign In to your account</p>
        <p className="text-muted">Email</p>
        <Input type="text" placeholder="Email" value={this.state.email}
          onChange={this.handleChangeEmail} />
        <p className="text-muted">Password</p>
        <Input type="password" placeholder="Password" value={this.state.password}
          onChange={this.handleChangePassword} />
        <Button color="primary" className="px-4" onClick={this.handleSubmit}>Login</Button>
        {this.state.serverErr ? (<p>Email or password is wrong </p>) : null}
        <p>New User ?</p> <Link to="/signup">Sign Up </Link>
      </div>
    );
  }
}