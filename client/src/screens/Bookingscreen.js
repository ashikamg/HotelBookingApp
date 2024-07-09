import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalAmount, setTotalAmount] = useState();

  // Convert date strings to moment objects
  const fromDateObj = moment(fromdate, 'DD-MM-YYYY');
  const toDateObj = moment(todate, 'DD-MM-YYYY');

  const totalDays = moment.duration(toDateObj.diff(fromDateObj)).asDays() + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/rooms/getroombyid', { roomid });
        console.log(response);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [roomid]);

  useEffect(() => {
    // Calculate total amount when room data changes
    if (room && room.rentperday) {
      setTotalAmount(totalDays * room.rentperday);
    }
  }, [room, totalDays]);

  async function onToken(token) {
    const bookingDetails = {
      token,
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalDays,
      totalAmount,
    };
    try {
      setLoading(true);
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      setLoading(false);
      Swal.fire('Congrats', 'Your Room has booked succeessfully', 'success').then(result => {
        window.location.href = '/profile'
      });
    } catch (error) {
      setLoading(false);
      Swal.fire('oops', 'Something went wrong');

    }
    console.log(token);
  }
  return (
    <div className='m-5'>
      {loading ? (
        <h1><Loader /></h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className='col-md-6'>
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className='bigimg' alt="Room" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: 'right' }}>
                <h1>Booking Details</h1>
                <hr />

                <b>
                  <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                  <p>From Date :{fromdate} </p>
                  <p>To Date :{todate}</p>
                  <p>Max Count : {room.maxcount} </p>
                </b>
              </div>

              <div style={{ textAlign: 'right' }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {totalDays}</p>
                  <p>Rent per day :{room.rentperday}</p>
                  <p>Total Amount : {totalAmount}</p>
                </b>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StripeCheckout
                Amount={totalAmount * 100}
                token={onToken}
                currency='INR'
                stripeKey="pk_test_51OJphBAgUSjoxkPWQzfaxJS8jknUK2Ymi7gFkC7J0nb75NMGXbnl5d11tbGK3CsqUSzPnme1NPnHuB4uY4FBrkF700dmG3vyi3"
              >
                <button className='btn btn-primary'>Pay Now{" "}</button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
