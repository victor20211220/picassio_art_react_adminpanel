import React, { useState, useEffect } from "react";
import ProjectService from "../../services/ProjectService";
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const FormInput = (props) => {
  const { label, type, name, project, handleInputChange } = props;
  return <Form.Group className="my-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} value={project[name]} name={name} onChange={handleInputChange} />
  </Form.Group>
}


const FormInputFile = (props) => {
  const { label, name, changeImageHandler } = props;
  return <Form.Group className="my-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control type="file" name={name} onChange={changeImageHandler} />
  </Form.Group>
}


export default function EditProject() {

  const { id } = useParams();
  const navigate = useNavigate();
  const initialProjectState = {
    title: "",
    project_image: "",
    username: "",
    user_id: "",
    avatar: "",
    show_on_footer: false,
  };
  const [project, setProject] = useState(initialProjectState);

  // get row
  useEffect(() => {
    fetchRow()
  }, [])

  const fetchRow = async () => {
    ProjectService.get(id).then(({ data }) => {
      setProject(data.project);
    }).catch(({ response }) => {
      Swal.fire({
        text: response.data.message,
        icon: "error"
      })
    })
  }


  const handleInputChange = event => {
    let { name, value } = event.target;
    if (name === "show_on_footer") value = !project[name];
    setProject({ ...project, [name]: value });
  };
  const changeAttrsHandler = event => {
    setProject({ ...project, ['attrs']: event });
  };
  const changeImageHandler = (event) => {
    setProject({ ...project, [event.currentTarget.name]: event.target.files[0] });
  };
  console.log(project);


  // form validation submit
  const [validationError, setValidationError] = useState({})
  const updateProject = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('_method', 'PATCH');
    for (const field in project) {
      if (["project_image", "avatar"].indexOf(field) !== -1 && project[field] !== null) {
        formData.append(field, project[field])
      } else {
        let value = project[field];
        if (field === "show_on_footer") {
          value = value === true ? 1 : 0;
        }
        formData.append(field, value);
      }
    }

    ProjectService.update(id, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        navigate("/projects");
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
              <h4 className="card-title">Update Project</h4>
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
                <Form onSubmit={updateProject}>
                  <FormInput label="Title" type="text" name="title" project={project} handleInputChange={handleInputChange} />
                  <FormInputFile label="Project Image" name="project_image" changeImageHandler={changeImageHandler} />
                  <FormInput label="Username" type="text" name="username" project={project} handleInputChange={handleInputChange} />
                  <FormInput label="User ID" type="text" name="user_id" project={project} handleInputChange={handleInputChange} />
                  <FormInputFile label="Avatar" name="avatar" changeImageHandler={changeImageHandler} />

                  <Form.Group>
                    <Form.Label>Show on footer</Form.Label>
                    <input type="checkbox" value={project.show_on_footer} checked={project.show_on_footer} name="show_on_footer" onChange={handleInputChange} />
                  </Form.Group>
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
