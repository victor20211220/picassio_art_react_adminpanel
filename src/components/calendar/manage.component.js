import React, { useState, useEffect } from "react";
import CalendarService from "../../services/CalendarService";
import BlockchainService from "../../services/BlockchainService";
import AttributeService from "../../services/AttributeService";
import { positions } from '../../services/Positions';
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';

const FormInputGroup = (props) => {
  const { label, type, name, calendar, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={calendar[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}

export default function ManageCalendar(props) {
  const isEdit = props.isEdit;
  const { id } = useParams();
  const navigate = useNavigate();
  const initialCalendarState = {
    title: "",
    mint_date: "",
    attrs: "",
    description: "",
    blockchain: 0,
    mint_price: "",
    supply: "",
    website: "",
    discord: "",
    twitter: "",
    image: "",
    position_id: 0,
    is_published: true,
  };


  const [blockchains, setBlockchains] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [calendar, setCalendar] = useState(initialCalendarState);

  useEffect(() => {
    const getData = async () => {
      let blockchains = await BlockchainService.getAll();
      blockchains = blockchains.data.map(item => {
        return { value: item.id, label: item.name }
      })
      setBlockchains(blockchains);
      let attributes = await AttributeService.getAll();
      attributes = attributes.data.map(item => {
        return { value: item.id, label: item.name }
      })
      setAttributes(attributes);
      console.log(attributes);
      if (isEdit)
        fetchRow()  
    }
    getData();
  }, [])

  // {"value":"minting","label":"Minting"}]

  const fetchRow = async () => {
    CalendarService.get(id).then(({ data }) => {
      let row = data.calendar;
      setCalendar(row);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }


  const handleInputChange = event => {
    let { name, value } = event.target;
    setCalendar({ ...calendar, [name]: value });
  };
  const changeAttrsHandler = option => {
    let ids = option.map(item => item.value);
    setCalendar({ ...calendar, attrs: ids.join(",") });
  };

  const changeSelectHandler = (option, key) => {
    setCalendar({ ...calendar, [key]: option.value });
  };
  const changeImageHandler = (event) => {
    setCalendar({ ...calendar, image: event.target.files[0] });
  };
  console.log(calendar);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const submitCalendar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (isEdit) {
      formData.append('_method', 'PATCH');
    }
    for (const field in calendar) {
      let value = calendar[field];
      switch (field) {
        case "is_upcoming":
        case "is_published":
          value = calendar[field] === true ? 1 : 0;
          break;
      }
      formData.append(field, value);
    }

    CalendarService.manage(formData, id)
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

  let attrs = calendar.attrs ? calendar.attrs.split(",").map(id => {
    return attributes.find(obj => obj.value == id);
  }) : [];

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{isEdit ? "Edit" : "Create"} Calendar</h4>
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
                <Form onSubmit={submitCalendar}>
                  <FormInputGroup label="Title" type="text" name="title" calendar={calendar} handleInputChange={handleInputChange} />
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
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <FormInputGroup label="Mint Date" type="date" name="mint_date" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <FormInputGroup label="Mint Price" type="text" name="mint_price" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>Attributes</Form.Label>
                        <Select
                          value={attrs}
                          isOptionDisabled={() => attrs.length >= 2}
                          isMulti
                          onChange={changeAttrsHandler}
                          options={attributes}
                          name="attrs"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <FormInputGroup label="Supply" type="text" name="supply" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInputGroup label="Website" type="url" name="website" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInputGroup label="Discord" type="url" name="discord" calendar={calendar} handleInputChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInputGroup label="Twitter" type="url" name="twitter" calendar={calendar} handleInputChange={handleInputChange} />
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
    </>
  )
}
