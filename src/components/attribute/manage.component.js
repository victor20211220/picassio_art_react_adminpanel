import React, { useState, useEffect } from "react";
import AttributeService from "../../services/AttributeService";
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';


const FormInput = (props) => {
  const { label, type, name, blockchain: attribute, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={attribute[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}



export default function ManageAttribute(props) {
  const isEdit = props.isEdit;
  const { id } = useParams();
  const navigate = useNavigate();
  const initialState = {
    name: "",
    color: "",
  };
  const [attribute, setAttribute] = useState(initialState);

  const fetchRow = async () => {
    AttributeService.get(id).then(({ data }) => {
      setAttribute(data.attribute);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }

  // get row
  useEffect(() => {
    if (isEdit)
      fetchRow()
  }, [])



  const handleInputChange = event => {
    let { name, value } = event.target;
    setAttribute({ ...attribute, [name]: value });
  };
  console.log(attribute);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const submitAttribute = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    if (isEdit) formData.append('_method', 'PATCH');
    for (const field in attribute) {
      formData.append(field, attribute[field]);
    }

    AttributeService.manage(formData, id)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/attributes");
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
            <h4 className="card-title">{isEdit ? "Edit" : "Create"} Attribute</h4>
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
              <Form onSubmit={submitAttribute}>
                <FormInput label="Name" type="text" name="name" blockchain={attribute} handleInputChange={handleInputChange} />
                <FormInput label="Color" type="color" name="color" blockchain={attribute} handleInputChange={handleInputChange} />
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
