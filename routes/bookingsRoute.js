const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const stripe = require('stripe')('sk_test_51OJphBAgUSjoxkPWCkey9Cn3l0q3sN80OFcS8pXmiAoE3p9j7vcrqxJUER9GKIX3n4eu9cCMCjcav2RmjngITn9D00sr1FUQFY');

router.post("/bookroom", async (req, res) => {
  const { userid, room, fromdate, todate, totalDays, totalAmount, token } = req.body;

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    // Charge the customer
    const payment = await stripe.charges.create({
      amount: totalAmount * 100, // Amount is in cents
      customer: customer.id,
      currency: 'inr',
      receipt_email: token.email,
      // Use idempotencyKey to prevent duplicate charges
      
    },{
      idempotencyKey: uuidv4()

    });

    // Check if payment was successful
    if (payment) {
     
        // Create a new booking in your database
        const newbooking = new Booking({
          room: room.name,
          roomid: room._id,
          userid,
          fromdate,
          todate,
          totalDays,
          totalAmount,
          transactionId: '1234',
          status: 'booked'
        });

        // Save the booking
        const booking = await newbooking.save();

        // Update the room with the new booking details
        const roomtemp = await Room.findOne({ _id: room._id });
        roomtemp.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(fromdate).format('DD-MM-YYYY'),
          todate: moment(todate).format('DD-MM-YYYY'),
          userid:userid,
          status: booking.status
        });

        await roomtemp.save();
  
    } 
      res.send( "Payment successfully" );
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/getbookingsbyuserid",async(req,res)=>{
   const userid = req.body.userid

   try{
      const bookings = await Booking.find({userid : userid})
      res.send(bookings);
   }catch(error){
    return res.status(400).json({ error: error.message });
   }
})

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const booking = await Booking.findOne({ _id: bookingid });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const room = await Room.findOne({ _id: roomid });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Assuming 'currentbookings' is an array of bookings in your Room model
    room.currentbookings = room.currentbookings.filter(b => b.bookingid.toString() !== bookingid);

    await room.save();

    res.json({ message: 'Your booking has been cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

