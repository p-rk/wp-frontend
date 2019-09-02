import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import instance from '../../axios';
import {
    validateMobile,
    validateOTP,
  } from '../Register/validations';

const initialState = {
    mobile: '',
    mobileError: false,
    mobileErrorMessage: '',
    otp: '',
    otpError: false,
    otpErrorMessage: '',
    isError: false,
    isOtpSent: false,
    apiResponse: {},
    isLoggedIn: false,
  };

export default class OTPLogin extends Component {
    state = {
        ...initialState
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
    handleOtpInput = e => {
      const {
          target: { value },
      } = e;
      const checkError = validateOTP(value);
      this.setState({
          otp: value,
          otpError: checkError.error,
          otpErrorMessage: checkError.error ? checkError.errorMessage : '',
      });
    }
      clearResponse = () => {
        this.setState({
          apiResponse: {}
        })
      }
      handleMobileSubmit = async e => {
        e.preventDefault();
        window.clearTimeout(this.interval)
        const {
          mobile
        } = this.state;
        const checkMobile = validateMobile(mobile);
        if (checkMobile.error) {
          return this.setState({
            mobileError: checkMobile.error,
            mobileErrorMessage: checkMobile.errorMessage,
          });
        }
        try {
          const post = await instance({
            method: 'post',
            url: '/login/mobile',
            data: {
              mobile,
            }
          })
          this.setState({
            isError: false,
            isOtpSent: true,
            apiResponse: post.data
          })
          console.log(post)
        } catch(error) {
          console.log(error)
          const { response: { data } } = error;
          this.setState({
            isError: true,
            isOtpSent: false,
            apiResponse: data
          })
        } finally {
          /* clear any errors after 5 seconds */
          this.interval = window.setTimeout(this.clearResponse, 5000)
        }
      }
    handleOtpSubmit = async e => {
      e.preventDefault();
      const {
        mobile,
        otp
      } = this.state;
      const checkOTP = validateOTP(otp);
      if (checkOTP.error) {
        return this.setState({
          otpError: checkOTP.error,
          otpErrorMessage: checkOTP.errorMessage,
        });
      }
      try {
        const post = await instance({
          method: 'post',
          url: '/verify/otp',
          data: {
            mobile,
            otp
          }
        })
        this.setState({
          isError: false,
          apiResponse: post.data,
          isLoggedIn: true
        })
      } catch (err) {
        const { response: { data } } = err;
        this.setState({
          isError: true,
          apiResponse: data,
          isLoggedIn: false
        })
        console.log(err);
      }
    }
    componentDidMount() {
      document.title = 'WhitePanda - OTP Login'
    }
    render() {
        const {
            mobile,
            mobileError,
            mobileErrorMessage,
            otp,
            otpError,
            otpErrorMessage,
            isError,
            isOtpSent,
            apiResponse,
            isLoggedIn
          } = this.state;
        return (
          <div className="section is-fullheight">
            <div className="container">
              <div className="column is-4 is-offset-4">
                <div className="box">
                  {!isLoggedIn && (
                    <Fragment>
                      <form onSubmit={!isOtpSent ? this.handleMobileSubmit : this.handleOtpSubmit} noValidate>
                        <div className="field">
                          <label className="label">Mobile</label>
                          <div className="control">
                            <input
                              className={`input ${mobileError && 'is-danger'}`}
                              type="text"
                              name="mobile"
                              placeholder="Enter your registered mobile no."
                              onChange={this.handleMobileInput}
                              value={mobile}
                              disabled={isOtpSent ? true:  false}
                              required />
                          </div>
                          {mobileError && (
                            <p className="help is-danger">{mobileErrorMessage}</p>
                          )}
                        </div>
                        {isOtpSent && (
                          <div className="field">
                            <label className="label">OTP</label>
                            <div className="control">
                              <input
                                className={`input ${otpError && 'is-danger'}`}
                                type="text"
                                placeholder="Your OTP"
                                name="otp"
                                onChange={this.handleOtpInput}
                                value={otp}
                                required />
                            </div>
                            {otpError && (
                              <p className="help is-danger">{otpErrorMessage}</p>
                            )}
                          </div>
                        )}
                        <button type="submit" className="button is-block is-primary is-fullwidth">
                          { !isOtpSent ? 'Request OTP' : 'Login' }
                        </button>
                      </form>
                    <div className="field">
                      {apiResponse && isError && (
                        <p className="control help is-danger">{apiResponse.msg}</p>
                      )}
                    </div>
                    <div className="field">
                      {apiResponse && !isError && (
                        <p className="control help is-success">{apiResponse.msg}</p>
                      )}
                    </div>
                    <div className="field">
                      {apiResponse && !isError && apiResponse.token && (
                        <p className="control help is-success">Login Successful !</p>
                      )}
                    </div>
                    <div className="field is-grouped is-grouped-right has-margin-top-10">
                      <p className="control is-danger">
                        <Link to="/" className="is-danger">Not Registered yet?</Link>
                      </p>
                    </div>
                    </Fragment>
                  )}
                  {isLoggedIn && !isError && apiResponse && (
                    <div className="card">
                      <header className="card-header">
                        <p className="card-header-title">
                        Your Profile
                        </p>
                      </header>
                      <div className="card-content">
                        <div className="media">
                          <div className="media-content">
                            <p className="subtitle is-6"><b>Email: </b>{apiResponse.user.email}
                              <span className={`icon ${apiResponse.user.isEmailVerified ? 'has-text-info' :  'has-text-danger'}`}>
                                {!apiResponse.user.isEmailVerified ? (
                                  <i className="fa fa-exclamation-circle" title="Email not verified"></i>
                                ) : (
                                  <i className="fa fa-check" title="Email verified"></i>
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="content">
                          <p className="subtitle is-6"><b>Mobile: </b> {apiResponse.user.mobile}
                            <span className={`icon ${apiResponse.user.isMobileVerified ? 'has-text-info' :  'has-text-danger'}`}>
                              {!apiResponse.user.isMobileVerified ? (
                                <i className="fa fa-exclamation-circle" title="Mobile not verified"></i>
                              ) : (
                                <i className="fa fa-check" title="Mobile verified"></i>
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      )
    }
}
