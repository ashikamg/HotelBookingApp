import React, { useState, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Calendar } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import moment from "moment";

import axios from "axios";
import Loader from "../components/Loader";
import Room from "../components/Room";
import { DatePicker, Space } from "antd";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
const { RangePicker } = DatePicker;
function Homescreen() {
  const [hotels, sethotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [duplicatehotes, setduplicatehotes] = useState([]);
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('')
  const [loading, setloading] = useState(false);
  const [searchkey, setsearchkey] = useState('')
  const[type , settype]=useState('all')
  function filterByDate(dates) {
    setfromdate(moment(dates[0]).format('DD-MM-YYYY'));
    settodate(moment(dates[1]).format('DD-MM-YYYY'));
  
    var temp = [];
    for (var room of duplicatehotes) {
      var availability = false;
  
      for (var booking of room.currentbookings) {
        if (room.currentbookings.length) {
          if (
            !moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate) &&
            !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate)
          ) {
            if (
              moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true;
            }
          }
        }
      }
  
      if (availability || room.currentbookings.length === 0) {
        temp.push(room);
      }
    }
  
    sethotels(temp); // Move this line outside of the loop
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data;
        setRooms(data);
        setloading(false);
      } catch (error) {
        console.error(error);
        setloading(false);
      }
    };

    fetchData();
  }, []);


  function filterBySearch()
  {
    const dupdate = duplicatehotes.filter(room=>room.name.toLowerCase().includes(searchkey))
    sethotels(dupdate)
  }

  function filterByType(e)
  {
    settype(e)
    if(e!=='all'){
      const dupdate = duplicatehotes.filter(room=>room.type.toLowerCase().includes(e.toLowerCase()))
      sethotels(dupdate)
    }
    else{
      sethotels(duplicatehotes)
    }
   
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-4">
            <input
              type="text"
              className="form-control i2 m-2"
              placeholder='Search Rooms'
              value={searchkey}
              onKeyUp={filterBySearch}
              onChange={(e)=>{setsearchkey(e.target.value)}}
            />
          </div>
          <div className="col-md-4">
            <select className="form-control m-2" value={type} onChange={(e)=>{filterByType(e.target.value)}} >

            <option value="all">All</option>
              <option value="delux">Delux</option>
              <option value="non-delux">Non Delux</option>
              
            </select>
          </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1><Loader /></h1>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="col-md-9 mt-3">
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
       
        )}
      </div>
    </div>
  );
}

export default Homescreen;