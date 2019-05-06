//Dependencies
const router = require("express").Router();

//Models
const TrainingSeries = require("../models/db/trainingSeries");
const Messages = require('../models/db/messages');

// GET all training series (not a production endpoint)
router.route('/')
  .get(async (req, res) => {
      const trainingSeries = await TrainingSeries.find();
      res.status(200).json({ trainingSeries });
  })
  .post(async (req, res) => {
    const { title, user_id } = req.body;

    if (!title && !user_id) {
      return res.status(400).json({
        error: `Client must provide: ${!title ? "-a title" : ""} ${
          !user_id ? "-a user ID" : ""
        }`
      });
    }
    
    const newTrainingSeries = await TrainingSeries.add(req.body);
    
    return res.status(201).json({ newTrainingSeries });
  })

router.route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const trainingSeries = await TrainingSeries.find({ 'ts.id': id });

    if (!trainingSeries) {
      return res.status(404).json({ 
        message: "sorry, we couldnt find that training series!" 
      });
    }

    return res.status(200).json({ trainingSeries })
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { title, user_id } = req.body;

    if (!title.length) {
      return res.status(400).json({
        message: "New title cannot be an empty string"
      })
    }

    const updatedTrainingSeries = await TrainingSeries.update(id, {
      title, user_id
    });
    
    if (!updatedTrainingSeries) {
      return res.status(404).json({
        message: "Sorry! We couldnt find that training series!"
      });
    }
    
    return res.status(200).json({ updatedTrainingSeries })
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await TrainingSeries.remove(id);

    if (!deleted) {
      return res.status(200).json({ 
        message: "The resource has been deleted." 
      });
    }
    return res.status(404).json({ error: "The resource could not be found." });
  });

// TODO: Normalize notifications/relational_table table/db handlers
// See note in models/db/seriesMembers.js

// router.get("/:id/assignments", async (req, res) => {
//   const { id } = req.params;
//   const assignments = await Messages.find({ 'ts.id': id });
  
//   return res.status(200).json({ assignments });
// });


// GET all messages in a training series by training series ID
router.get("/:id/messages", async (req, res) => {
  //--- under construction per trello spec ---
    const { id } = req.params;

    //get training series by id
    const trainingSeries = await TrainingSeries.find({ 'ts.id': id });

    if (!trainingSeries.length) {
      return res.status(404).json({ 
        message: "Sorry, we couldnt find that training series!" 
      });
    }
    
    //get all messages of training series
    const messages = await Messages.find({ 'ts.id': id });

    return res.status(200).json({ trainingSeries, messages });
});

module.exports = router;
