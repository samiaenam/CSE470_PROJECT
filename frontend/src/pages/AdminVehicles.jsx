import React, { useEffect, useState, useContext } from 'react'
import API from '../services/api'
import { AuthContext } from '../context/AuthContext'

function VehicleForm({ onSaved, initial, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', type: '', licensePlate: '', seats: 4 })

  useEffect(() => setForm(initial || { name: '', type: '', licensePlate: '', seats: 4 }), [initial])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.type || !form.licensePlate || !form.seats) {
      return alert('Please fill required fields')
    }

    try {
      if (initial && initial._id) {
        await API.put(`/vehicles/${initial._id}`, form)
      } else {
        await API.post('/vehicles', form)
      }
      onSaved()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <form onSubmit={submit} className="mb-4">
      <div className="row g-2 align-items-center">
        <div className="col-md-3">
          <input
            placeholder="Name"
            className="form-control"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="col-md-2">
          <input
            placeholder="Type"
            className="form-control"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          />
        </div>

        <div className="col-md-3">
          <input
            placeholder="License"
            className="form-control"
            value={form.licensePlate}
            onChange={e => setForm({ ...form, licensePlate: e.target.value })}
          />
        </div>

        <div className="col-md-1">
          <input
            type="number"
            min="1"
            placeholder="Seats"
            className="form-control"
            value={form.seats}
            onChange={e => setForm({ ...form, seats: parseInt(e.target.value || 0) })}
          />
        </div>

        <div className="col-md-3 d-flex">
          <button className="btn btn-primary me-2">{initial ? 'Update' : 'Create'}</button>
          {initial && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default function AdminVehicles() {
  const { user } = useContext(AuthContext)
  const [vehicles, setVehicles] = useState([])
  const [editing, setEditing] = useState(null)
  const [managing, setManaging] = useState(null) // vehicle being managed for bookedDates
  const [loading, setLoading] = useState(false)
  const [newBookedDate, setNewBookedDate] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await API.get('/vehicles')
      setVehicles(res.data || [])
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id) => {
    if (!window.confirm('Delete vehicle?')) return
    try {
      await API.delete(`/vehicles/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const saveBookingDate = async (vehicleId, dates) => {
    try {
      // backend supports updating bookedDates via PUT /vehicles/:id
      await API.put(`/vehicles/${vehicleId}`, { bookedDates: dates })
      await load()
      setManaging(null)
      setNewBookedDate('')
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const addBookedDate = (vehicle) => {
    if (!newBookedDate) return alert('Pick a date')
    if ((vehicle.bookedDates || []).includes(newBookedDate)) return alert('Date already added')
    const dates = [...(vehicle.bookedDates || []), newBookedDate].sort()
    saveBookingDate(vehicle._id, dates)
  }

  const removeBookedDate = (vehicle, date) => {
    if (!window.confirm(`Remove booked date ${date}?`)) return
    const dates = (vehicle.bookedDates || []).filter(d => d !== date)
    saveBookingDate(vehicle._id, dates)
  }

  return (
    <div>
      <h3>Admin - Vehicles</h3>

      <VehicleForm onSaved={load} initial={editing} onCancel={() => setEditing(null)} />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>Showing {vehicles.length} vehicles</div>
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={load} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Seats</th>
            <th>Plate</th>
            <th>Booked Dates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.seats}</td>
              <td>{v.licensePlate}</td>
              <td style={{ maxWidth: '300px' }}>
                {v.bookedDates && v.bookedDates.length > 0 ? (
                  <div style={{ maxWidth: '300px', overflowX: 'auto' }}>
                    {v.bookedDates.map(d => (
                      <span key={d} className="badge bg-secondary me-1">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <small className="text-muted">No booked dates</small>
                )}
              </td>

              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setEditing(v)}>
                  Edit
                </button>

                <button className="btn btn-sm btn-info me-2" onClick={() => setManaging(v)}>
                  Manage Dates
                </button>

                <button className="btn btn-sm btn-danger" onClick={() => remove(v._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {managing && (
        <div className="card mt-3">
          <div className="card-body">
            <h5>Manage Booked Dates for {managing.name}</h5>

            <div className="mb-3">
              <label className="form-label">Add booked date</label>
              <div className="d-flex">
                <input
                  type="date"
                  className="form-control me-2"
                  value={newBookedDate}
                  onChange={e => setNewBookedDate(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => addBookedDate(managing)}>
                  Add
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setManaging(null)
                    setNewBookedDate('')
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div>
              <h6>Current booked dates</h6>
              {managing.bookedDates && managing.bookedDates.length > 0 ? (
                <div className="d-flex flex-wrap">
                  {managing.bookedDates.map(d => (
                    <div key={d} className="border rounded p-2 me-2 mb-2">
                      <div>{d}</div>
                      <div>
                        <button className="btn btn-sm btn-link text-danger p-0" onClick={() => removeBookedDate(managing, d)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted">No booked dates</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
