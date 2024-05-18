class handelErrors extends Error {
    constructor() {
        super()
    }
    create(message, status, statusText) {
        this.message = message;
        this.status = status;
        this.statusText = statusText;
        return this;
    }
}

module.exports = new handelErrors()