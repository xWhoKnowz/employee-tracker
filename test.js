const inquirer = require('inquirer');
const db = 'database connection goes here'


function askQ(){
    inquirer.prompt({
        name: 'student', 
        message: 'What is the name of the student you will be adding?'
    }).then((answer)=> {
        db.query(`INSERT INTO students (student_name) VALUES ("${answer.student}")`, (err, result)=> {
            if (err) throw err;
            console.log(' student inserted');
        })
 })
}

askQ()