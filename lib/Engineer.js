const Employee = require("./Employee");

class Engineer extends Employee {
    constructor(name, id, email, github) {
        super(name, id, email)
        this.github = github;
        this.title = "Engineer";
    }

    getGithub() {
        // const queryUrl = `https://api.github.com/users/${this.github}`;
        return this.github;
    }

    getRole() {
        return this.title;
    }
}

module.exports = Engineer;