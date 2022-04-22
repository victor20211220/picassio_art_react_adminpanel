import React, { useState, useEffect } from "react";
import BlockchainService from "../../services/BlockchainService";
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';


const FormInput = (props) => {
  const { label, type, name, blockchain, handleInputChange } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={blockchain[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}


const FormInputFile = (props) => {
  const { label, name, changeImageHandler } = props;
  return <Form.Group className="my-1">
    <Form.Label>{label}</Form.Label>
    <Form.Control type="file" name={name} onChange={changeImageHandler} />
  </Form.Group>
}



export default function EditBlockchain() {

  const { id } = useParams();
  const navigate = useNavigate();
  const initialState = {
    name: "",
    image: "",
  };
  const [blockchain, setBlockchain] = useState(initialState);

  // get row
  useEffect(() => {
    fetchRow()
  }, [])

  const fetchRow = async () => {
    BlockchainService.get(id).then(({ data }) => {
      setBlockchain(data.blockchain);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }


  const handleInputChange = event => {
    let { name, value } = event.target;
    setBlockchain({ ...blockchain, [name]: value });
  };
  const changeImageHandler = (event) => {
    setBlockchain({ ...blockchain, [event.currentTarget.name]: event.target.files[0] });
  };
  console.log(blockchain);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const updateBlockchain = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('_method', 'PATCH');
    for (const field in blockchain) {
      if (field === "image" !== -1 && blockchain[field] !== null) {
        formData.append(field, blockchain[field])
      } else {
        let value = blockchain[field];
        formData.append(field, value);
      }
    }

    BlockchainService.update(id, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/blockchains");
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

  return <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-sm-12 col-md-8">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Edit Blockchain</h4>
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
              <Form onSubmit={updateBlockchain}>
                <FormInput label="Name" type="text" name="name" blockchain={blockchain} handleInputChange={handleInputChange} />
                <FormInputFile label="Image" name="image" changeImageHandler={changeImageHandler} />
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
}
