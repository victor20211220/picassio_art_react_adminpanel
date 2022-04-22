import React, { useState } from "react";
import UsersService from "../../services/UsersService";
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const FormInput = (props) => {
  const { label, type, name, user, handleInputChange } = props;
  return <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={user[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}

export default function CreateUser() {
  const navigate = useNavigate();
  const initialUserState = {
    name: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const [validationError, setValidationError] = useState({})

  const saveUser = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    for (const field in user) {
      formData.append(field, user[field]);
    }

    UsersService.create(formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/users");
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
  }


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create User</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {
                            Object.entries(validationError).map(([key, value]) => (
                              <li key={key}>{value}</li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={saveUser}>
                  <FormInput label="Name" type="text" name="name" user={user} handleInputChange={handleInputChange}/>
                  <FormInput label="Email" type="email" name="email" user={user} handleInputChange={handleInputChange}/>
                  <FormInput label="Password" type="password" name="password" user={user} handleInputChange={handleInputChange}/>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}