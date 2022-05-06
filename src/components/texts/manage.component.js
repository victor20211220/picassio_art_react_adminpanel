import React, { useState, useEffect } from "react";
import TextsService from "../../services/TextsService";
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


const FormTextarea = (props) => {
  const { label, name, text, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control as="textarea" rows={name.includes("footer") ? 8: 2} value={text[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}

const fields = {
  header_title : "Header Title",
  header_description: "Header Description",
  marquee_title: "Marquee Title",
  featured_title: "Featured Title",
  featured_description: "Featured Description",
  calendar_title: "Calendar Title",
  calendar_description: "Calendar Description",
  footer_description: "Footer Description",
};


export default function ManageTexts() {
  const initialState = {};
  Object.entries(fields).map(([key, value]) => {
    initialState[key] = ""
  })
  const [text, setText] = useState(initialState);

  const fetchRow = () => {
    TextsService.getAll().then(({ data }) => {
      setText(data.text);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }

  // get row
  useEffect(() => {
    fetchRow()
  }, [])



  const handleInputChange = event => {
    let { name, value } = event.target;
    setText({ ...text, [name]: value });
  };
  console.log(text);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData()
    for (const field in text) {
      formData.append(field, text[field]);
    }

    TextsService.manage(formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
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

  return <>
    <div className="row justify-content-center">
      <div className="col-12 col-sm-12 col-md-8">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Manage Texts</h4>
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
                {Object.entries(fields).map(([key, value]) => (
                  <FormTextarea label={value} name={key} text={text} handleInputChange={handleInputChange} />
                ))}
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
}
