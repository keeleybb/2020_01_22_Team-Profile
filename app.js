const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

//Holding Data
const employeeIds = [];
const employees = [];

//Validation ID
function validID(input) {
    if (isNaN(input)) {
        return "That is not a number";
    }
    for (i = 0; i < employeeIds.length; i++) {
        if (input === employeeIds[i]) {
            return "That ID is already in use"
        }
    }
    return true;
}
//Validate Email
function validateEmail(input) {
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input))) {
        return "Type a valid email address"
    }
    return true;
}

async function askQuestions() {
    let { managerName, managerId, managerEmail, managerNumber } = await askManager();
    employeeIds.push(managerId);
    employees.push(
        new Manager(managerName, managerId, managerEmail, managerNumber)
    );
    askNext();

}


function askManager() {
    console.log("Build your team");
    return inquirer.prompt([{
        type: "input",
        message: "What is your managers name?",
        name: "managerName"
    },
    {
        type: "input",
        message: "What is your manager's number?",
        name: "managerNumber"
    },
    {
        type: "input",
        message: "What is your manager's email address?",
        name: "managerEmail",
        validate: validateEmail
    },
    {
        type: "input",
        message: "What is your manager's id?",
        name: "managerId",
        validate: validID
    }

    ])


}

async function askNext() {
    let { another_teammate } = await inquirer.prompt({ //shorten the variable names returned
        type: "list",
        message: "Do you want to add a member to your team?",
        choices: ["engineer", "intern", "nope, that's it"],
        name: "another_teammate"
    })

    switch (another_teammate) {
        case "engineer":
            askEngineer();
            break;
        case "intern":
            askIntern();
            break;
        default:
            console.log("Done!")
            console.log(employees); //How would I call something like this? 
            makeHTML();
    }

    // //Consider coding as switch case to make it faster
    // if (prompt.another_teammate === "engineer") {
    //     askEngineer();
    // } else if (prompt.another_teammate === "intern") {
    //     askIntern();
    // } else {
    //     console.log("Done!")
    //     //finish and run html
    //     console.log(employees); //How would I call something like this? 
    //     makeHTML();
    // }

}

async function askEngineer() {
    let { engineerName, engineerID, engineerEmail, githubId } = await inquirer.prompt([
        {
            type: "input",
            message: "What is your engineer's name?",
            name: "engineerName"
        }, {
            type: "input",
            message: "What is your engineer's ID?",
            name: "engineerID",
            validate: validID
        },
        {
            type: "input",
            message: "What is your engineer's email address?",
            name: "engineerEmail",
            validate: validateEmail
        },
        {
            type: "input",
            message: "What is your engineer's gitHub ID?",
            name: "githubId"
        }
    ])
    employeeIds.push(engineerID);
    employees.push(new Engineer(engineerName, engineerID, engineerEmail, githubId));
    askNext();
};

async function askIntern() {
    let { internName, internID, internEmail, internSchool } = await inquirer.prompt([
        {
            type: "input",
            message: "What is your intern's name?",
            name: "internName"
        }, {
            type: "input",
            message: "What is your intern's ID?",
            name: "internID",
            validate: validID
        },
        {
            type: "input",
            message: "What is your intern's email address?",
            name: "internEmail",
            validate: validateEmail
        },
        {
            type: "input",
            message: "What is school does your intern attend?",
            name: "internSchool"
        }
    ])
    employeeIds.push(internID);
    employees.push(new Intern(internName, internID, internEmail, internSchool));
    askNext();

};


askQuestions();


function makeHTML() {
    const outputPath = path.resolve(__dirname, "output", "team.html");


    fs.writeFile(outputPath, render(employees), function (err) {
        if (err) {
            throw err;
        }
        // console.log(render(employees));
        console.log("Success!")

    });
}