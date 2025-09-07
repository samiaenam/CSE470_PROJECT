import React, { useEffect, useState } from 'react'
import API from '../services/api'


export default function VehiclesList() {
const [vehicles, setVehicles] = useState([])
const [date, setDate] = useState('')
const [loading, setLoading] = useState(false)


const fetchVehicles = async (d) => {
setLoading(true)
try {
const res = await API.get('/vehicles', { params: d ? { date: d } : {} })
setVehicles(res.data)
} catch (err) {
console.error(err)
} finally { setLoading(false) }
}


useEffect(()=>{ fetchVehicles(date) }, [])


return (
<div>
<h3>Vehicles</h3>
<div className="row mb-3">
<div className="col-md-4">
<input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
</div>
<div className="col-md-2">
<button className="btn btn-outline-primary" onClick={()=>fetchVehicles(date)}>Filter</button>
</div>
</div>


{loading ? <div>Loading...</div> : (
<div className="row">
{vehicles.map(v=> (
<div className="col-md-4 mb-3" key={v._id}>
<div className="card">
<div className="card-body">
<h5 className="card-title">{v.name}</h5>
<p className="card-text">Type: {v.type}<br/>Seats: {v.seats}<br/>Plate: {v.licensePlate}</p>
</div>
</div>
</div>
))}
</div>
)}
</div>
)
}