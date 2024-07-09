import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function Adminscreen() {
  return (
    <div className='ml-3 mt-3 mr-3 bs'>
      <h2 className='text-center' style={{ fontSize: '30px' }}><b>Admin panel</b></h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Booking" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms/>
        </TabPane>
        <TabPane tab="Add room" key="3">
          <Addroom/>
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users/>
        </TabPane>;
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await axios.get("/api/bookings/getallbookings");
      setBookings(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className='row'>
      <div className='col-md-10'>
        <h1>Bookings</h1>
        {loading && <Loader />}
        {error && <Error />}
        <table className='table table-bordered table-dark'>
          <thead className='bs'>
            <tr>
              <th>Booking Id</th>
              <th>Userid</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.userid}</td>
                <td>{booking.room}</td>
                <td>{booking.fromdate}</td>
                <td>{booking.todate}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className='col-md-11'>
      <h1>Rooms</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <div>
          <table className='table table-bordered table-dark'>
            <thead className='bs'>
              <tr>
                <th>Room Id</th>
                <th>Name</th>
                <th>Type</th>
                <th>Rent Per day</th>
                <th>Max Count</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>{room.rentperday}</td>
                  <td>{room.maxcount}</td>
                  <td>{room.phonenumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await axios.get('/api/users/getallusers');
        setUsers(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='row'>
      {loading && <Loader />}

      <div className="col-md-10">
        {users.length > 0 && (
          <table className='table table-bordered table-dark'>
            <thead className='bs'>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>isAdmin</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && <p>No users found.</p>}
      </div>
    </div>
  );
}

export function Addroom() {
  const [room, setRoom] = useState("");
  const [rentperday, setRentPerDay] = useState("");
  const [maxcount, setMaxCount] = useState("");
  const [description, setDescription] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [type, setType] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const addRoom = async (e) => {
    e.preventDefault(); // Prevents the form from being submitted

    const roomObj = {
      room,
      rentperday,
      maxcount,
      description,
      phonenumber,
      type,
      image1,
      image2,
      image3,
    };

    try {
      const result = await axios.post('/api/rooms/addroom', roomObj);
      // Handle the result as needed
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  return (
    <div className="row">
     
        <div className="col-md-5">
          <input
            type="text"
            className="form-control mt-1"
            placeholder="name"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="rentperday"
            value={rentperday}
            onChange={(e) => {
              setRentPerDay(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="maxcount"
            value={maxcount}
            onChange={(e) => {
              setMaxCount(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="phonenumber"
            value={phonenumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          
        </div>

        <div className="col-md-6">
        <input
            type="text"
            className="form-control mt-1"
            placeholder="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          />
        <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 1"
            value={image1}
            onChange={(e) => {
              setImage1(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 2"
            value={image2}
            onChange={(e) => {
              setImage2(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 3"
            value={image3}
            onChange={(e) => {
              setImage3(e.target.value);
            }}
          />
          <div className='mt-1 text-right'>
          <button className="btn btn-primary" onClick={addRoom}>ADD ROOM</button>
          </div>
        </div>
     
    </div>
  );

}
