// class expressError extends Error{
//     constructor(statusCode, message) 
//     {
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
        
//     }
// }

// module.exports = expressError;

class expressError extends Error {
    constructor(statusCode, message) {
        super(message);  // Pass the message to the parent Error class
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;  // Set the error class name (optional but helpful)
        Error.captureStackTrace(this, this.constructor); // Captures the stack trace
    }

    // Optional: Override the toString method to customize the error display
    toString() {
        return `${this.name} [${this.statusCode}]: ${this.message}`;
    }
    
}

module.exports = expressError;
