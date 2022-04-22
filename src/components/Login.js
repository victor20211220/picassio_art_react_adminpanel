import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import { Row, Col } from 'react-bootstrap';
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const {admin} = props;
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(email, password, admin)
        .then((response) => {
          setLoading(false);
          console.log(response);
          if (typeof response === "string") {
            setMessage(response);
            return;
          }
          switch (response.status) {
            case 200:
              setMessage("Login success");
              navigate("/");
              window.location.reload();
              break;
            case 422:
              let errors = response.data.errors;
              let messages = "";
              for (const field in errors) {
                messages += errors[field] + "\n";
              }
              setMessage(messages);
              break;
            default:
              setMessage("Ops, unknown error occured");
          }
        },
        );
    } else {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col sm={{ span: 6, offset: 3 }}>

        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-body">
            <Form onSubmit={handleLogin} ref={form}>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required]}
                />
              </div>

              <div className="form-group  mb-3">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
                />
              </div>

              <div className="form-group mb-3">
                <button className="btn btn-primary btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
