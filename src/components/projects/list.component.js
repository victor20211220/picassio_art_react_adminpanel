import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectService from '../../services/ProjectService';

import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

export default function ProjectList() {
    let apiUrl = process.env.REACT_APP_APIURL;
    const [rows, setRows] = useState([])

    useEffect(()=>{
        fetchRows() 
    }, [])

    const fetchRows = async () => {
        ProjectService.getAll().then(({data})=>{
            setRows(data)
        })
    }

    const deleteRow = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          ProjectService.remove(id).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchRows()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/projects/add"}>
                    Create
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Project Image</th>
                                    <th>Username</th>
                                    <th>User ID</th>
                                    <th>Show On Footer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rows.length > 0 && (
                                        rows.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.title}</td>
                                                <td>
                                                    <img width="50px" alt='' src={`${apiUrl}/storage/projects/image/${row.project_image}`} />
                                                </td>
                                                <td>{row.username}</td>
                                                <td>{row.user_id}</td>
                                                <td>{row.show_on_footer ? "Yes": "No"}</td>
                                                <td>
                                                    <Link to={`/projects/${row.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={()=>deleteRow(row.id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}