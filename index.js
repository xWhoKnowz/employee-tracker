const inquirer = require('inquirer')
const mysql = require('mysql2')
const table = require('console.table');


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'mysqlpass',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const userInterface = [
  {
    type: `list`,
    name: `userChoice`,
    message: "What would you like to do?",
    choices: [`View All Departments`, `Add Department`, `View All Roles`, `Add Role`, `View All Employees`, `Add Employee`, `Update Employee Role`, `Quit`]
  },
]


inquirer
  .prompt(userInterface)
  .then((userSelection) => {
    console.log(userSelection);

    if (userSelection.userChoice === `View All Departments`) {
      // viewAllDepartments()

      db.query(`SELECT id, department_name AS department 
                FROM department;`, (err, results) => {
        if (err) {
          console.log(err);
        }
        else {
          console.table(results);
        }
      })

    }
    else if (userSelection.userChoice === `Add Department`) {

      inquirer
        .prompt([{
          type: `input`,
          message: `What is the name of the department?`,
          name: `newDepartment`,
        }])
        .then((response) => {
          console.log(response.newDepartment)

          db.query(`INSERT INTO department (department_name) VALUES ('?')`, response.newDepartment, (err, results) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log(`Department Added Successfully`);
            }
          })
        })


    }
    else if (userSelection.userChoice === `View All Roles`) {
      db.query(`SELECT role.id, title, department_name AS department, salary 
                FROM role 
                JOIN department ON role.department_id = department.id;`, (err, results) => {
        if (err) {
          console.log(err);
        }
        else {
          console.table(results);
        }
      })
    }
    else if (userSelection.userChoice === `Add Role`) {

      inquirer
        .prompt([
          {
            type: `input`,
            message: `What is the name of the role?`,
            name: `newRole`,
          },
          {
            type: `input`,
            message: `What is the salary of the role?`,
            name: `roleSalary`,
          },
          {
            type: `list`,
            message: `Which department does the role belong too?`,
            name: `roleDepartment`,
            choices: [`Sales`, `Engineering`, `Finance`, `Legal`]
          }
        ])
        .then((response) => {

          db.query(`INSERT INTO role (title, department_id, salary) VALUES ('${response.newDepartment}')`, (err, results) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log('Role Added Successfully');
            }
          })
        })

    }
    else if (userSelection.userChoice === `View All Employees`) {
      db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, manager.first_name AS "Manager First Name", manager.last_name AS "Manager Last Name"
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, (err, results) => {
        if (err) {
          console.log(err);
        }
        else {
          console.table(results);
        }
      })
    }
    else if (userSelection.userChoice === `Add Employee`) {

    }
    else if (userSelection.userChoice === `Update Employee Role`) {

    }
    else if (userSelection.userChoice === `Quit`) {

    }



  })




