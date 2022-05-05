import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarService from '../../services/CalendarService';
import { positions } from '../../services/Positions';

import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import Select from 'react-select';

const bulkOptions = [
    { value: 1, label: 'Publish' },
    { value: 0, label: 'Unpublish' }
];

export default function CalendarList() {
    let apiUrl = process.env.REACT_APP_APIURL;
    const [rows, setRows] = useState([])
    const [masterChecked, setMasterChecked] = useState(false)
    const [bulkAction, setBulkAction] = useState([])

    // row management
    const onMasterCheck = (e) => {

        // Check/ UnCheck All Items
        const templist = [];
        rows.map((row) => {
            row.selected = e.target.checked;
            templist.push(row);
        });
        setMasterChecked(e.target.checked);
        setRows(templist);
    }
    // Update List Item's state and Master Checkbox State
    const onItemCheck = (e, item) => {
        const templist = [];
        rows.map((row) => {
            if (row.id === item.id) {
                row.selected = e.target.checked;
            }
            templist.push(row);
        });

        //To Control Master Checkbox State
        const totalItems = templist.length;
        const totalCheckedItems = templist.filter((e) => e.selected).length;
        setMasterChecked(totalItems === totalCheckedItems);
        setRows(templist);
    }

    /* database manage */
    useEffect(() => {
        fetchRows()
    }, [])

    const fetchRows = async () => {
        CalendarService.getAll().then(({ data }) => {
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

        CalendarService.remove(id).then(({ data }) => {
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

    const updatePublish = async (id, is_published) => {
        const formData = new FormData()
        formData.append('_method', 'PATCH');
        formData.append("update_publish", 1);
        formData.append("is_published", is_published == true ? 0 : 1);
        CalendarService.manage(formData, id).then(({ data }) => {
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

    const changeBulkAction = event => {
        setBulkAction(event);
    }
    const applyBulkAction = async () => {
        const selectedRows = rows.filter((e) => e.selected);
        let selectedIds = [];
        selectedRows.map((row) => {
            selectedIds.push(row.id);
        })
        const bulkLabel = bulkAction.label;
        const isConfirm = await Swal.fire({
            title: `${bulkLabel} checked rows?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            return result.isConfirmed
        });

        if (!isConfirm) {
            return;
        }
        const formData = new FormData()
        formData.append("ids", selectedIds);
        formData.append("action", bulkAction.value);
        CalendarService.bulkAction(formData).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchRows();
            setMasterChecked(false)
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }
    const checkedCnt = rows.filter((e) => e.selected).length;
    return (
        <>
            <div className='float-right d-flex mb-2'>
                <Select
                    value={bulkAction}
                    onChange={changeBulkAction}
                    options={bulkOptions}
                    name="bulk_options"
                    classNamePrefix="select"
                />
                <Button disabled={checkedCnt == 0 || bulkAction.length == 0} onClick={() => applyBulkAction()} className="ms-2">Apply</Button>
                <Link className='btn btn-primary ms-2 float-end' to={"/calendar/add"}>
                    Create
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered mb-0 text-center">
                    <thead>
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={masterChecked}
                                    id="mastercheck"
                                    onChange={(e) => onMasterCheck(e)}
                                />
                            </th>
                            <th>Title</th>
                            <th>Mint Date</th>
                            <th>Image</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.length > 0 && (
                                rows.map((row, key) => (
                                    <tr key={key}>
                                        <th scope="row">
                                            <input
                                                type="checkbox"
                                                checked={row.selected}
                                                className="form-check-input"
                                                onChange={(e) => onItemCheck(e, row)}
                                            />
                                        </th>
                                        <td>{row.title}</td>
                                        <td>{row.mint_date}</td>
                                        <td>
                                            <img width="30px" alt='' src={`${apiUrl}/storage/calendar/image/${row.image}`} />
                                        </td>
                                        <td>{row.position_id != 0 && positions.find((position) => position.value == row.position_id).label}</td>
                                        <td>
                                            <Link to={`/calendar/${row.id}`} className='btn btn-sm btn-success me-2'>
                                                Edit
                                            </Link>
                                            <Button variant="danger" size="sm" onClick={() => deleteRow(row.id)}>
                                                Delete
                                            </Button>
                                            <Button variant={row.is_published ? "secondary" : "primary"} size="sm" className="ms-2" onClick={() => updatePublish(row.id, row.is_published)}>
                                                {row.is_published ? "Unpublish" : "Publish"}
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