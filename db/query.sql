-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;

-- * View Dept
-- SELECT id, department_name AS department 
-- FROM department;

-- * Add Dept
-- INSERT INTO department (department_name) VALUES ('?')

-- * View Role
-- SELECT role.id, title, department_name AS department, salary 
-- FROM role 
-- JOIN department ON role.department_id = department.id;

-- * Add Role
    INSERT INTO role (title, department_id, salary) 
    VALUES ('${response.newDepartment}')

-- * View Emp
-- SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, manager.first_name AS "Manager First Name", manager.last_name AS "Manager Last Name"
-- FROM employee
-- JOIN role ON employee.role_id = role.id
-- JOIN department ON role.department_id = department.id
-- LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

