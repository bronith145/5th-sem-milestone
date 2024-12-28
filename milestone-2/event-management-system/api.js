const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { EventManagement } = require('./eventManagement');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize event
const event = new EventManagement('Tech Conference 2024', 100);

// Routes
// 1. Get event details
app.get('/api/event', (req, res) => {
    try {
        const eventStats = event.getEventStats();
        res.json({
            name: event.eventName,
            capacity: event.capacity,
            ...eventStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Add new attendee
app.post('/api/attendees', (req, res) => {
    try {
        const { name, email, isVIP, isSpeaker, dietaryPreference } = req.body;

        // Input validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const result = event.addAttendee(
            name,
            email,
            isVIP || false,
            isSpeaker || false,
            dietaryPreference || 'none'
        );

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get all attendees
app.get('/api/attendees', (req, res) => {
    try {
        const { sort } = req.query;
        let attendees;

        switch (sort) {
            case 'dietary':
                attendees = event.getAttendeesByDietaryPreference();
                break;
            case 'priority':
                attendees = event.getPrioritizedAttendees();
                break;
            default:
                attendees = event.attendees;
        }

        res.json(attendees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get RSVP queue
app.get('/api/rsvp-queue', (req, res) => {
    try {
        const queue = event.getRSVPQueue();
        res.json(queue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Get attendee by email
app.get('/api/attendees/:email', (req, res) => {
    try {
        const attendee = event.attendees.find(a => a.email === req.params.email);
        if (attendee) {
            res.json(attendee);
        } else {
            res.status(404).json({ error: 'Attendee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Event Management API running on http://localhost:${port}`);
});