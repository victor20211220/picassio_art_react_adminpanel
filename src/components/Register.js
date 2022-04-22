import React, { useState, useRef } from "react";
import { Row, Col } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

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

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangePasswordConfirm = (e) => {
    const password_confirmation = e.target.value;
    setPasswordConfirmation(password_confirmation);
  };


  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(name, email, password, password_confirmation)
        .then((response) => {
          console.log(response);
          if (typeof response === "string") {
            setMessage(response);
            setSuccessful(false);
            return;
          }
          switch (response.status) {
            case 201:
              setMessage("Successfully registered");
              setSuccessful(true);
              break;
            case 422:
              let errors = response.data.errors;
              let messages = "";
              for (const field in errors) {
                messages += errors[field] + "\n";
              }
              setMessage(messages);
              setSuccessful(false);
              break;
            default:
              setMessage("Ops, unknown error occured");
              setSuccessful(false);
          }
        });
    }
  };

  return (
    <Row>
      <Col sm={{ span: 6, offset: 3 }}>
        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}

        {!successful && (

          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleRegister} ref={form}>
                <div>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={name}
                      onChange={onChangeName}
                      validations={[required, vusername]}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={onChangeEmail}
                      validations={[required, validEmail]}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                      validations={[required, vpassword]}
                    />
                  </div>


                  <div className="form-group mb-3">
                    <label htmlFor="password">Password Confirmation</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password_confirmation"
                      value={password_confirmation}
                      onChange={onChangePasswordConfirm}
                      validations={[required]}
                    />
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary btn-block">Sign Up</button>
                  </div>

                  <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </div>
              </Form>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Register;
