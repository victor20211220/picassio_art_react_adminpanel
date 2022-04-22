import React, { useState, useEffect } from "react";
import CalendarService from "../../services/CalendarService";
import BlockchainService from "../../services/BlockchainService";
import {positions} from '../../services/Positions';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const options = [
  { value: 'featured', label: 'Featured' },
  { value: 'minting', label: 'Minting' }
];



const FormInput = (props) => {
  const { label, type, name, calendar, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={calendar[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}

export default function CreateCalendar() {
  const navigate = useNavigate();
  const initialCalendarState = {
    title: "",
    mint_date: "",
    amount: "",
    attrs: [],
    description: "",
    blockchain: [],
    mint_price: "",
    supply: "",
    discord: "",
    twitter: "",
    image: "",
    position_id: 0,
  };

  const [blockchains, setBlockchains] = useState([]);

  // get row
  useEffect(() => {
    fetchBlockchains();
  }, [])

  const fetchBlockchains = async () => {
    BlockchainService.getAll().then(({ data }) => {
      let blockchains = [];
      data.map(item => {
        blockchains.push({ value: item.id, label: item.name })
      })
      setBlockchains(blockchains);
    })
  }

  const [calendar, setCalendar] = useState(initialCalendarState);
  const handleInputChange = event => {
    let { name, value } = event.target;
    setCalendar({ ...calendar, [name]: value });
  };


  const changeAttrsHandler = event => {
    setCalendar({ ...calendar, ['attrs']: event });
  };


  const changeSelectHandler = (option, key) => {
    setCalendar({ ...calendar, [key]: option.value });
  };

  const changeImageHandler = (event) => {
    setCalendar({ ...calendar, image: event.target.files[0] });
  };

  console.log(calendar);

  const [validationError, setValidationError] = useState({})

  const saveCalendar = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('is_published', 1);
    for (const field in calendar) {
      let value = calendar[field];
      switch (field) {
        case "attrs":
          value = JSON.stringify(value);
          break;
        case "is_upcoming":
          value = calendar[field] === true ? 1 : 0;
          break;
      }
      formData.append(field, value);
    }

    CalendarService.create(formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/calendars");
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
              <h4 className="card-title">Create Calendar</h4>
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
                <Form onSubmit={saveCalendar}>
                  <FormInput label="Title" type="text" name="title" calendar={calendar} handleInputChange={handleInputChange} />

                  <Row className="my-1">
                    <Col>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={calendar.description} name="description" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Blockchain</Form.Label>
                        <Select
                          value={blockchains.find(obj => obj.value === calendar.blockchain)}
                          onChange={(option) => changeSelectHandler(option, "blockchain")}
                          options={blockchains}
                          name="blockchain"
                          classNamePrefix="select"
                        />
                      </Form.Group>
                      {/* <FormInput label="Blockchain" type="text" name="blockchain" calendar={calendar} handleInputChange={handleInputChange} /> */}
                    </Col>
                    <Col sm={6}>
                      <FormInput label="Amount" type="text" name="amount" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <FormInput label="Mint Date" type="date" name="mint_date" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <FormInput label="Mint Price" type="text" name="mint_price" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Attributes</Form.Label>
                        <Select
                          value={calendar.attrs}
                          isMulti
                          onChange={changeAttrsHandler}
                          options={options}
                          name="attrs"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <FormInput label="Supply" type="text" name="supply" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInput label="Discord" type="url" name="discord" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInput label="Twitter" type="url" name="twitter" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Form.Group controlId="Image" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={changeImageHandler} />
                  </Form.Group>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Position</Form.Label>
                        <Select
                          value={positions.find(obj => obj.value === calendar.position_id)}
                          onChange={(option) => changeSelectHandler(option, "position_id")}
                          options={positions}
                          name="position_id"
                          classNamePrefix="select"
                        />
                      </Form.Group>
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
    </div>
  )
}