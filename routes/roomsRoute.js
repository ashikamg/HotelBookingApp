const express = require("express");
const router = express.Router();
const Room = require("../models/room");
const mongoose = require("mongoose");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong' });
  }
});

router.post("/getroombyid", async (req, res) => {
  console.log(req.body);
  try {
    const room = await Room.findOne({ '_id': req.body.roomid });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.send(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms); // Use res.json for sending JSON response
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addroom", async (req, res) => {
  const {
    room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    image1,
    image2,
    image3
  } = req.body;

  // Validate input data (add more checks as needed)
  if (!room || !rentperday || !maxcount || !description || !phonenumber || !type || !image1 || !image2 || !image3) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const newRoomEntry = new Room({
    name: room,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls: [image1, image2, image3],
    currentbookings: []
  });

  try {
    await newRoomEntry.save();
    res.status(201).json({ message: "New Room Added Successfully" });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
