import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'

import PromoService from "../../services/PromoService";

import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const FormInputGroup = (props) => {
  const { label, type, name, promo, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={promo[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}

export default function ManagePromo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialPromoState = {
    image: "",
    total_price: 0,
  };

  const [promo, setPromo] = useState(initialPromoState);

  useEffect(() => {
    fetchRow();
  }, [])

  const fetchRow = () => {
    PromoService.get(id).then(({ data }) => {
      let row = data.promo;
      setPromo(row);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }


  const handleInputChange = event => {
    let { name, value } = event.target;
    setPromo({ ...promo, [name]: value });
  };
  const changeImageHandler = (event) => {
    setPromo({ ...promo, image: event.target.files[0] });
  };
  console.log(promo);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    for (const field in promo) {
      formData.append(field, promo[field]);
    }

    PromoService.manage(formData, id)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/promos");
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
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Edit Promo</h4>
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
                <Form onSubmit={submitForm}>
                  <Form.Group controlId="Image" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={changeImageHandler} />
                  </Form.Group>
                  <Row>
                    <Col>
                      <FormInputGroup label="Total Price" type="number" name="total_price" promo={promo} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
