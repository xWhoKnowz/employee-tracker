const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");


const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "mysqlpass",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const userInterface = [
  {
    type: `list`,
    name: `userChoice`,
    message: "What would you like to do?",
    choices: [
      `View All Departments`,
      `Add Department`,
      `View All Roles`,
      `Add Role`,
      `View All Employees`,
      `Add Employee`,
      `Update Employee Role`,
      `Quit`,
    ],
  },
];

function employeeTracker() {
  inquirer.prompt(userInterface).then((userSelection) => {
    console.log(userSelection);

    if (userSelection.userChoice === `View All Departments`) {
      db.query(
        `SELECT id, department_name AS department 
                FROM department;`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.table(results);
            employeeTracker();
          }
        }
      );
    } else if (userSelection.userChoice === `Add Department`) {
      inquirer
        .prompt([
          {
            type: `input`,
            message: `What is the name of the department?`,
            name: `newDepartment`,
          },
        ])
        .then((response) => {
          console.log(response.newDepartment);

          db.query(
            `INSERT INTO department (department_name) VALUES (?)`,
            response.newDepartment,
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Department Added Successfully`);
                employeeTracker();
              }
            }
          );
        });
    } else if (userSelection.userChoice === `View All Roles`) {
      db.query(
        `SELECT role.id, title, department_name AS department, salary 
                FROM role 
                JOIN department ON role.department_id = department.id;`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.table(results);
            employeeTracker();
          }
        }
      );
    } else if (userSelection.userChoice === `Add Role`) {
      db.query(
        `SELECT * FROM department ORDER BY department.department_name`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            const roleReverse = results.map((role) => {
              return {
                name: role.department_name,
                value: role.id,
              };
            });

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
                  choices: roleReverse,
                },
              ])
              .then((response) => {
                db.query(
                  `INSERT INTO role (title, department_id, salary) 
                    VALUES (?, ?, ?)`,
                  [
                    response.newRole,
                    response.roleDepartment,
                    response.roleSalary,
                  ],
                  (err, results) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Role Added Successfully");
                      employeeTracker();
                    }
                  }
                );
              });
          }
        }
      );
    } else if (userSelection.userChoice === `View All Employees`) {
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, manager.first_name AS "Manager First Name", manager.last_name AS "Manager Last Name"
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.table(results);
            employeeTracker();
          }
        }
      );
    } else if (userSelection.userChoice === `Add Employee`) {
      db.query(
        `SELECT first_name, last_name, employee.id 
                FROM employee`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              `SELECT role.title, role.id
                    FROM role`,
              (err, roleResults) => {
                if (err) {
                  console.log(err);
                } else {
                  const availRoles = roleResults.map((role) => {
                    return {
                      name: role.title,
                      value: role.id,
                    };
                  });
                  const roleManager = results.map((emp) => {
                    return {
                      name: `${emp.first_name}, ${emp.last_name}`,
                      value: emp.id,
                    };
                  });

                  roleManager.push({ name: "None", value: null });

                  inquirer
                    .prompt([
                      {
                        type: `input`,
                        message: `What is employee's first name?`,
                        name: `firstName`,
                      },
                      {
                        type: `input`,
                        message: `What is employee's last name?`,
                        name: `lastName`,
                      },
                      {
                        type: `list`,
                        message: `What is the employee's role?`,
                        name: `empRole`,
                        choices: availRoles,
                      },
                      {
                        type: `list`,
                        message: `Who is the employee's manager?`,
                        name: `empMan`,
                        choices: roleManager,
                      },
                    ])
                    .then((res) => {
                      db.query(
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                                  VALUES (?, ?, ?, ?)`,
                        [res.firstName, res.lastName, res.empRole, res.empMan],
                        (err, results) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(`Employee Added Successfully`);
                            employeeTracker();
                          }
                        }
                      );
                    });
                }
              }
            );
          }
        }
      );
    } else if (userSelection.userChoice === `Update Employee Role`) {
      db.query(
        `Select first_name, last_name, id
                FROM employee`,
        (err, empResults) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              `Select title, id
                    FROM role`,
              (err, roleResults) => {
                if (err) {
                  console.log(err);
                } else {
                  const empList = empResults.map((emp) => {
                    return {
                      name: `${emp.first_name} ${emp.last_name}`,
                      value: emp.id,
                    };
                  });

                  const roleList = roleResults.map((role) => {
                    return {
                      name: role.title,
                      value: role.id,
                    };
                  });

                  inquirer
                    .prompt([
                      {
                        type: `list`,
                        message: `Which employee's role do you want to update?`,
                        name: `updatedEmp`,
                        choices: empList,
                      },
                      {
                        type: `list`,
                        message: `Which role do you want to assign to the employee?`,
                        name: `updatedRole`,
                        choices: roleList,
                      },
                    ])
                    .then((res) => {
                      console.log(res);
                      db.query(
                        `UPDATE employee
                            SET role_id = ?
                            WHERE id = ?`,
                        [res.updatedRole, res.updatedEmp],
                        (err, results) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(`Employee Role Updated Successfully`);
                            employeeTracker();
                          }
                        }
                      );
                    });
                }
              }
            );
          }
        }
      );
    } else if (userSelection.userChoice === `Quit`) {
      return console.log(`Session Ended`);
    }
  });
}

employeeTracker();