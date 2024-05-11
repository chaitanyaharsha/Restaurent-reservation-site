const router = require("express").Router();
const TableReservation = require("../models/TableReservation");
const sendEmail = require("../util/sendEmail");
const createTableReservationEmailTemplate = require("../util/email_templates/createTableReservationEmailTemplate");
const updateTableReservationEmailTemplate = require("../util/email_templates/updateTableReservationEmailTemplate");
const cancelReservationEmailTemplate = require("../util/email_templates/cancelReservationEmailTemplate");
//const cron = require('node-cron');


// Function to generate reservation ID
const generateReservationId = async () => {
    try {
        const latestReservation = await TableReservation.findOne().sort({createdAt: -1});
        if (!latestReservation) {
            return "T01";
        } else {
            const latestId = parseInt(latestReservation.reservationId.slice(1)); // Extract numeric part of the ID
            const newId = latestId + 1;
            return "T" + newId.toString().padStart(2, '0'); // Ensure two-digit padding
        }
    } catch (error) {
        console.error("Error generating reservation ID:", error);
        throw new Error("Error generating reservation ID");
    }
};

// Check table availability
router.post("/checkAvailability", async (req, res) => {
    try {
        const { tableNo, date, time } = req.body;
        const existingReservation = await TableReservation.findOne({ tableNo, date, time });
        if (existingReservation) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error checking table availability" });
    }
});

// Create a table reservation
router.post("/create", async (req, res) => {
    try {
      const reservationId = await generateReservationId(); // Generate reservation ID
      const newTableReservation = new TableReservation({ ...req.body, reservationId });
      await newTableReservation.save();
      
      // Send confirmation email to the customer
      const { name, email, date, time, tableNo } = req.body;
      const emailTemplate = createTableReservationEmailTemplate(name, reservationId, date, time, tableNo);
      sendEmail(email, "Table Reservation Confirmation", emailTemplate);
  
      res.json({ status: "Table Reservation Added", tableReservation: newTableReservation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating table reservation" });
    }
});

// Get all table reservations
router.get("/", async (req, res) => {
    try {
        const tableReservations = await TableReservation.find();
        res.json(tableReservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving table reservations" });
    }
});

// Get count of all table reservations
router.get('/count', async (req, res) => {
    try {
        const count = await TableReservation.countDocuments(); // Count the documents in the Table Reservations collection
        res.json({ count });
    } catch (error) {
        console.error('Error fetching count:', error);
        res.status(500).json({ error: 'Error fetching count' });
    }
});

// Search table reservations by reservation ID or name
router.get("/search", async (req, res) => {
    try {
      const query = req.query.query;
      const reservations = await TableReservation.find({
        $or: [{ _id: query }, { name: { $regex: query, $options: "i" } }]
      });
      res.json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error searching table reservations" });
    }
});

// Update a table reservation
router.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTableReservation = await TableReservation.findByIdAndUpdate(id, req.body, { new: true });

        // Send confirmation email to the customer
        const { name, email, date, time, tableNo, reservationId } = req.body;
        const emailTemplate = updateTableReservationEmailTemplate(name, reservationId, date, time, tableNo);
        sendEmail(email, "Table Reservation Updated Confirmation", emailTemplate);

        res.json({ status: "Table Reservation updated", tableReservation: updatedTableReservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating table reservation" });
    }
});

// Delete a table reservation
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedReservation = await TableReservation.findByIdAndDelete(id);
        
        // Send confirmation email to the customer
        const { name, email, reservationId } = deletedReservation;
        const emailTemplate = cancelReservationEmailTemplate(name, reservationId);
        sendEmail(email, "Table Reservation Cancellation", emailTemplate);

        res.json({ status: "Table Reservation deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting table reservation" });
    }
});

// Schedule cron job to delete reservations older than 4 months
/*cron.schedule('* * * * *', async () => {
    try {
        const currentDate = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
        await TableReservation.deleteMany({ date: { $lt: fourMonthsAgo } });
        //console.log('Reservations older than 4 months deleted successfully.');
    } catch (error) {
        console.error('Error deleting old reservations:', error);
    }
});*/

module.exports = router;