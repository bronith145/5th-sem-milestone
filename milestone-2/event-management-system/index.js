const { EventManagement } = require('./eventManagement');

// Create a new event
const techConference = new EventManagement('Tech Conference 2024', 100);

// Add some test attendees
console.log('\n--- Adding Attendees ---');
console.log(techConference.addAttendee(
    'John Doe', 
    'john@example.com', 
    true, // isVIP 
    false, // isSpeaker
    'vegetarian'
));

console.log(techConference.addAttendee(
    'Jane Smith', 
    'jane@example.com', 
    false, 
    true, // She's a speaker
    'none'
));

console.log(techConference.addAttendee(
    'Bob Wilson', 
    'bob@example.com', 
    false, 
    false, 
    'vegan'
));

// Display event statistics
console.log('\n--- Event Statistics ---');
console.log(techConference.getEventStats());

// Show attendees sorted by dietary preference
console.log('\n--- Attendees by Dietary Preference ---');
console.log(techConference.getAttendeesByDietaryPreference());

// Show prioritized attendees
console.log('\n--- Prioritized Attendees ---');
console.log(techConference.getPrioritizedAttendees());

// Show current RSVP queue
console.log('\n--- Current RSVP Queue ---');
console.log(techConference.getRSVPQueue());