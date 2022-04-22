import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UsersService from '../../services/UsersService';

import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

export default function UsersList() {
    const [rows, setRows] = useState([])

    useEffect(()=>{
        fetchRows() 
    }, [])

    const fetchRows = async () => {
        UsersService.getAll().then(({data})=>{
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

          UsersService.remove(id).then(({data})=>{
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
                <Link className='btn btn-primary mb-2 float-end' to={"/users/add"}>
                    Create
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Created at</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rows.length > 0 && (
                                        rows.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.name}</td>
                                                <td>{row.email}</td>
                                                <td>{new Date(row.created_at).toLocaleDateString(undefined)}</td>
                                                <td>
                                                    <Link to={`/users/${row.id}`} className='btn btn-success me-2'>
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