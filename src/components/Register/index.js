import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import instance from '../../axios';
import {
    validateEmail,
    validateMobile,
    validatePassword,
  } from './validations';

const initialState = {
    email: '',
    emailError: false,
    emailErrorMessage: '',
    password: '',
    passwordError: false,
    passwordErrorMessage: '',
    mobile: '',
    mobileError: false,
    mobileErrorMessage: '',
    apiResponse: {},
    isRegistered: false,
  };

export default class Register extends Component {
    state = {
      ...initialState
    }
    handleEmailInput = e => {
        const {
          target: { value },
        } = e;
        const checkError = validateEmail(value);
        this.setState({
          email: value,
          emailError: checkError.error,
          emailErrorMessage: checkError.error ? checkError.errorMessage : '',
        });
      }
      handlePasswordInput = e => {
        const {
          target: { value },
        } = e;
        const checkError = validatePassword(value);
        this.setState({
          password: value,
          passwordError: checkError.error,
          passwordErrorMessage: checkError.error ? checkError.errorMessage : '',
        });
      }
      handleMobileInput = e => {
        const {
          target: { value },
        } = e;
        const checkError = validateMobile(value);
        this.setState({
          mobile: value,
          mobileError: checkError.error,
          mobileErrorMessage: checkError.error ? checkError.errorMessage : '',
        });
      }
      clearResponse = () => {
        this.setState({
          apiResponse: {}
        })
      }
      redirectToLogin = () => {
        this.props.history.push(`/login`)
      }
      handleSubmit = async e => {
        e.preventDefault();
        const {
          mobile, email, password
        } = this.state;
        const checkEmail = validateEmail(email);
        const checkMobile = validateMobile(mobile);
        const checkPassword = validatePassword(password);
        if (
          checkMobile.error ||
          checkEmail.error ||
          checkPassword.error
        ) {
          return this.setState({
            mobileError: checkMobile.error,
            mobileErrorMessage: checkMobile.errorMessage,
            emailError: checkEmail.error,
            emailErrorMessage: checkEmail.errorMessage,
            passwordError: checkPassword.error,
            passwordErrorMessage: checkPassword.errorMessage,
          });
        }
        try {
          const post = await instance({
            method: 'post',
            url: '/register',
            data: {
              mobile,
              email,
              password
            }
          })
          this.setState({
            apiResponse: post.data,
            isRegistered: true
          })
        } catch(error) {
          const { response: { data } } = error;
          this.setState({
            apiResponse: data
          })
        } finally {
          /* clear any errors after 5 seconds */
          this.interval = window.setTimeout(this.clearResponse, 5000)
        }
      }
    componentDidUpdate(prevProps, prevState) {
      if(this.state.isRegistered) {
        window.clearTimeout(this.interval)
        window.setTimeout(this.redirectToLogin, 2000)
      }
    }
    componentDidMount() {
      document.title = 'WhitePanda - Registration'
    }
    render() {
        const {
            email,
            emailError,
            emailErrorMessage,
            mobile,
            mobileError,
            mobileErrorMessage,
            password,
            passwordError,
            passwordErrorMessage,
            apiResponse,
            isRegistered
          } = this.state;
        return (
            <div className="section is-fullheight">
            <div className="container">
              <div className="column is-4 is-offset-4">
                <div className="box">
                  <form onSubmit={this.handleSubmit} noValidate>
                    <div className="field">
                      <label className="label">Email Address</label>
                      <div className="control">
                        <input
                          autoComplete="off"
                          className={`input ${emailError && 'is-danger'}`}
                          type="email"
                          name="email"
                          onChange={this.handleEmailInput}
                          value={email}
                          placeholder="Enter your email id"
                          required
                        />
                        {emailError && (
                          <p className="help is-danger">{emailErrorMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Mobile</label>
                      <div className="control">
                        <input className={`input ${mobileError && 'is-danger'}`}
                          type="text"
                          name="mobile"
                          placeholder="Enter your mobile number"
                          onChange={this.handleMobileInput}
                          value={mobile}
                          required
                        />
                      </div>
                      {mobileError && (
                        <p className="help is-danger">{mobileErrorMessage}</p>
                      )}
                    </div>
                    <div className="field">
                      <label className="label">Password</label>
                      <div className="control">
                        <input
                          className={`input ${passwordError && 'is-danger'}`}
                          type="password"
                          name="password"
                          placeholder="Set password"
                          onChange={this.handlePasswordInput}
                          value={password}
                          required
                        />
                      </div>
                      {passwordError && (
                        <p className="help is-danger">{passwordErrorMessage}</p>
                      )}
                    </div>
                    <button type="submit" className="button is-block is-info is-fullwidth" disabled={isRegistered}>
                      {isRegistered ? 'Redirecting please wait...' : 'Register'}
                    </button>
                  </form>
                  <div className="field">
                    {apiResponse && apiResponse.errors && (
                      <p className="control help is-danger">{apiResponse.errors[0]}</p>
                    )}
                  </div>
                  <div className="field">
                    {apiResponse && !apiResponse.errors && apiResponse.msg && (
                      <p className="control help is-success">{apiResponse.msg}</p>
                    )}
                  </div>
                  <div className="field is-grouped is-grouped-right has-margin-top-10">
                    <p className="control is-danger">
                      <Link to="/login" className="is-danger">Registered Already?</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}
