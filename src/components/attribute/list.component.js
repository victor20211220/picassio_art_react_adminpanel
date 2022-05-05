import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AttributeService from '../../services/AttributeService';

import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

export default function AttributeList() {
    const [rows, setRows] = useState([])

    useEffect(() => {
        fetchRows()
    }, [])

    const fetchRows = async () => {
        AttributeService.getAll().then(({ data }) => {
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

        if (!isConfirm) {
            return;
        }

        AttributeService.remove(id).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchRows()
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    return (
        <>
            <div>
                <Link className='btn btn-primary mb-2' to={"/attributes/add"}>
                    Create
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered mb-0 text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.length > 0 && (
                                rows.map((row, key) => (
                                    <tr key={key}>
                                        <td>{row.name}</td>
                                        <td><span className='color-span d-inline-block' style={{backgroundColor:row.color}}></span></td>
                                        <td>
                                            <Link to={`/attributes/${row.id}`} className='btn btn-success me-2'>
                                                Edit
                                            </Link>
                                            <Button variant="danger" onClick={() => deleteRow(row.id)}>
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
        </>
    )
}