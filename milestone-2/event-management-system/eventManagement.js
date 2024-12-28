// Event Management System

// Class to manage attendee data
class Attendee {
    constructor(name, email, isVIP = false, isSpeaker = false, dietaryPreference = 'none') {
        this.name = name;
        this.email = email;
        this.isVIP = isVIP;
        this.isSpeaker = isSpeaker;
        this.dietaryPreference = dietaryPreference;
        this.timestamp = new Date();
    }
}

// Queue implementation for RSVP tracking
class RSVPQueue {
    constructor() {
        this.items = [];
    }

    enqueue(attendee) {
        this.items.push(attendee);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// Priority Tree Node for managing attendees based on priority
class AttendeeNode {
    constructor(attendee) {
        this.attendee = attendee;
        this.left = null;
        this.right = null;
    }
}

// Priority Tree implementation
class PriorityTree {
    constructor() {
        this.root = null;
    }

    insert(attendee) {
        const node = new AttendeeNode(attendee);
        
        if (!this.root) {
            this.root = node;
            return;
        }

        this._insertNode(this.root, node);
    }

    _insertNode(root, node) {
        const priority1 = node.attendee.isSpeaker ? 2 : (node.attendee.isVIP ? 1 : 0);
        const priority2 = root.attendee.isSpeaker ? 2 : (root.attendee.isVIP ? 1 : 0);

        if (priority1 > priority2) {
            if (!root.left) {
                root.left = node;
            } else {
                this._insertNode(root.left, node);
            }
        } else {
            if (!root.right) {
                root.right = node;
            } else {
                this._insertNode(root.right, node);
            }
        }
    }

    inorder() {
        const result = [];
        this._inorderTraversal(this.root, result);
        return result;
    }

    _inorderTraversal(node, result) {
        if (node) {
            this._inorderTraversal(node.left, result);
            result.push(node.attendee);
            this._inorderTraversal(node.right, result);
        }
    }
}

// Main Event Management Class
class EventManagement {
    constructor(eventName, capacity) {
        this.eventName = eventName;
        this.capacity = capacity;
        this.attendees = [];
        this.rsvpQueue = new RSVPQueue();
        this.priorityTree = new PriorityTree();
    }

    addAttendee(name, email, isVIP = false, isSpeaker = false, dietaryPreference = 'none') {
        if (this.attendees.length >= this.capacity) {
            return { success: false, message: 'Event is at full capacity' };
        }

        const attendee = new Attendee(name, email, isVIP, isSpeaker, dietaryPreference);
        this.attendees.push(attendee);
        this.rsvpQueue.enqueue(attendee);
        this.priorityTree.insert(attendee);

        return { success: true, message: 'RSVP successful', attendee };
    }

    getAttendeesByDietaryPreference() {
        return [...this.attendees].sort((a, b) => 
            a.dietaryPreference.localeCompare(b.dietaryPreference)
        );
    }

    getPrioritizedAttendees() {
        return this.priorityTree.inorder();
    }

    getRSVPQueue() {
        return [...this.rsvpQueue.items];
    }

    getEventStats() {
        const totalAttendees = this.attendees.length;
        const vegetarianCount = this.attendees.filter(a => 
            a.dietaryPreference.toLowerCase() === 'vegetarian'
        ).length;
        const speakersCount = this.attendees.filter(a => a.isSpeaker).length;
        const vipCount = this.attendees.filter(a => a.isVIP).length;

        return {
            totalAttendees,
            vegetarianCount,
            speakersCount,
            vipCount,
            spotsRemaining: this.capacity - totalAttendees
        };
    }
}

module.exports = { EventManagement };