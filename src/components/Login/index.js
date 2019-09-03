import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import useForm from "./useForm";
import validate from "./validations";
import instance from "../../axios";
import { saveState, loadState } from "../../helpers";

const Form = () => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  );
  const [res, setRes] = useState({});
  const [isLoggedIn, setLogin] = useState(false);
  useEffect(() => {
    document.title = "WhitePanda - Login";
    const persistedState = loadState();
    console.log(persistedState);
    if (persistedState.isLoggedIn && persistedState.data) {
      setRes({
        error: false,
        response: persistedState.data
      });
      setLogin(true);
    }
    return () => {
      setRes({});
    };
  }, [values]);

  async function login(setError) {
    try {
      const post = await instance({
        method: "post",
        url: "/login",
        data: values
      });
      const { data } = post;
      saveState({ data, isLoggedIn: true });
      setRes({ error: false, response: post.data });
      setLogin(true);
    } catch (error) {
      const {
        response: {
          data: { msg }
        }
      } = error;
      setLogin(false);
      setError(prev => ({ ...prev, resError: true }));
      setRes({ error: true, msg });
    }
  }
  const { response } = res;
  return (
    <div className="section is-fullheight">
      <div className="container">
        <div className="column is-4 is-offset-4">
          <div className="box">
            {!isLoggedIn && (
              <Fragment>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                      <input
                        autoComplete="off"
                        className={`input ${errors.email && "is-danger"}`}
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        onChange={handleChange}
                        value={values.email || ""}
                        required
                      />
                      {errors.email && (
                        <p className="help is-danger">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className={`input ${errors.password && "is-danger"}`}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        value={values.password || ""}
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="help is-danger">{errors.password}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="button is-block is-info is-fullwidth"
                  >
                    Login
                  </button>
                </form>
                <p className="has-text-centered is-italic">( OR )</p>
                <div className="field">
                  <Link
                    to="/otp/login"
                    className="button is-block is-primary is-fullwidth"
                  >
                    Login With OTP
                  </Link>
                </div>
                <div className="field">
                  {res.error && (
                    <p className="control help is-danger">{res.msg}</p>
                  )}
                  {response && response.token && (
                    <p className="control help is-success">
                      Login Successful !
                    </p>
                  )}
                </div>
                <div className="field is-grouped is-grouped-right has-margin-top-10">
                  <p className="control">
                    <Link to="/" className="is-danger">
                      Not Registered yet?
                    </Link>
                  </p>
                </div>
              </Fragment>
            )}
            {isLoggedIn && response && (
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">Your Profile</p>
                </header>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="subtitle is-6">
                        <b>Email: </b>
                        {response.user.email}
                        <span
                          className={`icon ${
                            response.user.isEmailVerified
                              ? "has-text-info"
                              : "has-text-danger"
                          }`}
                        >
                          {!response.user.isEmailVerified ? (
                            <i
                              className="fa fa-exclamation-circle"
                              title="Email not verified"
                            ></i>
                          ) : (
                            <i
                              className="fa fa-check"
                              title="Email verified"
                            ></i>
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="content">
                    <p className="subtitle is-6">
                      <b>Mobile: </b> {response.user.mobile}
                      <span
                        className={`icon ${
                          response.user.isMobileVerified
                            ? "has-text-info"
                            : "has-text-danger"
                        }`}
                      >
                        {!response.user.isMobileVerified ? (
                          <i
                            className="fa fa-exclamation-circle"
                            title="Mobile not verified"
                          ></i>
                        ) : (
                          <i
                            className="fa fa-check"
                            title="Mobile verified"
                          ></i>
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
  );
};

export default Form;
