import React, { useState, useEffect } from 'react';
import { Tabs, Tag } from 'antd';
import axios from 'axios';
import Swal from "sweetalert2";

const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Profile' key='1'>
          <h1>My Profile</h1>
          <br />
          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>isAdmin: {user.isAdmin ? 'Yes' : 'NO'}</h1>
        </TabPane>
        <TabPane tab='Bookings' key='2'>
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export function MyBookings() {
  const [mybookings, setmybookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(null);

  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('/api/bookings/getbookingsbyuserid', {
          userid: user._id,
        });

        setmybookings(response.data);
      } catch (error) {
        seterror(error.message);
      } finally {
        setloading(false);
      }
    };

    fetchBookings();
  }, [user._id]);

  const cancelBooking = async (bookingid, roomid) => {
    try {
      const result = await axios.post('/api/bookings/cancelbooking', { bookingid, roomid });
      setloading(false);
      Swal.fire('Congrats', 'Your Room has cancelled succeessfully', 'success').then(result => {
        window.location.href = '/profile'
      })
    } catch (error) {
      setloading(false);
      Swal.fire('Oops', 'Something went wrong', 'error').then(result => {
        window.location.href = '/profile'
      })
    }
  };


  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        mybookings.map((booking) => (
          <div className='row' key={booking._id}>
            <div className='col-md-6 my-auto'>
              <div className='bs m-1 p-2'>
                <h1>{booking.room}</h1>
                <p>BookingId: {booking._id}</p>
                <p>TransactionId: {booking.transactionId}</p>
                <p>
                  <b>Check In : </b>
                  {booking.fromdate}
                </p>
                <p>
                  <b>Check Out : </b>
                  {booking.todate}
                </p>
                <p>
                  <b>Amount : </b> {booking.totalAmount}
                </p>
                <p>
                  <b>Status</b> :{' '}
                  {booking.status === 'booked' ? (
                    <Tag color='green'>Confirmed</Tag>
                  ) : (
                    <Tag color='red'>Cancelled</Tag>
                  )}
                </p>
                <div className='text-right'></div>
                <button className='btn btn-primary' onClick={() => cancelBooking(booking._id, booking.roomid)}>
                  CANCEL Booking
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Profilescreen;
