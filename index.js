
const inquire = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'employeetracker_db'
};

const db = mysql.createConnection(dbConfig,
    console.log(`Connected to the employeeTracker_db database.`)
);

const menuList = () => {
    inquire.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Delete Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
        // MENU 
    ]).then(answers => {
        switch (answers.menu) {
            case 'View All Employees':
                viewEmployeee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewDepartment();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Quit':
                quit();
                break;

        }

    });

};

// VIEW ROLES               FIX SHOWS MULTIPLE OF SAME DEPARTMENT
const viewDepartment = () => {
    db.promise().query('SELECT * FROM department').then(([res]) => {
        console.table(res)

        menuList();
    })
}

// VIEW ROLES
const viewRoles = () => {
    db.promise().query('SELECT * FROM role').then(([res]) => {
        console.table(res)

        menuList();
    })
}

// VIEW EMPLOYEE                        CONCAT added two colum into one TURNED First_name & last_name columns to one column named to "name"/ AS changes the name / JOIN brought them in by foregn key tables together  
const viewEmployeee = () => {
    db.promise().query('SELECT CONCAT(first_name, " ", last_name)AS name, role.title AS title FROM employee LEFT JOIN role ON employee.role_id = role.id').then(([res]) => {
        console.table(res)

        menuList();
    })
}



// ADD EMPLOYEE
const addEmployee = async () => {
    const [roles] = await db.promise().query('SELECT * FROM role')
    const roleArray = roles.map(role => (
        {
            name: role.title, value: role.id
        }
    ))
    const [employees] = await db.promise().query('SELECT * FROM employee')
    const employeeArray = employees.map(employee => (
        {
            name: employee.first_name + " " + employee.last_name, value: employee.id
        }
    ))
    inquire.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employees last name?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the employees role?',
            choices: roleArray
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employees manager?',
            choices: employeeArray
        },

    ]).then(({ first_name, last_name, role_id, manager_id }) => {
        const newEmployee = { first_name, last_name, role_id, manager_id }
        db.promise().query('INSERT INTO employee SET ?', newEmployee).then(([res]) => {
            if (res.affectedRows > 0) {
                viewEmployeee()
            } else {
                menuList();
                console.info('Fail to add new employee')
            }
        })
    })
}

// ADD ROLE
const addRole = async () => {
    const [departments] = await db.promise().query('SELECT * FROM department')
    const departmentArray = departments.map(department => (
        {
            name: department.department_name, value: department.id
        }
    ))
    inquire.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong to?',
            choices: departmentArray
        }
    ]).then(({ title, salary, department_id }) => {
        let roleObject = { title, salary, department_id }
        db.promise().query('INSERT INTO role SET ?', roleObject).then(([res]) => {
            // console.log(res)
            if (res.affectedRows > 0) {
                console.info(`${title} was added to the role database`)
            }
            else {
                console.info(`${title} was NOT added to the role database`)
            }
            menuList();
        })

    })

}

// ADD DEPARTMENT
const addDepartment = () => {
    inquire.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the department'
    }).then(answer => {
        db.promise().query('INSERT INTO department(department_name)VALUES(?)', answer.name).then(([res]) => {
            if (res.affectedRows > 0) {
                console.info(`${answer.name} was added to department database`)
            }
            else {
                console.info(`${answer.name} was NOT added department database`)
            }
            menuList();

        })

    })

}

// UPDATE EMPLOYEE ROLE
const updateEmployeeRole = async () => {
    const [employees] = await db.promise().query('SELECT * FROM employee')
    const employeeArray = employees.map(employee => (
        {
            name: employee.first_name + " " + employee.last_name, value: employee.id
        }
    ))
    const [roles] = await db.promise().query('SELECT * FROM role')
    const roleArray = roles.map(role => (
        {
            name: role.title, value: role.id
        }
    ))
    inquire.prompt([
        {
            type: 'list',
            name: 'emp_id',
            message: 'Which employee role do you want to update',
            choices: employeeArray

        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Which role do you want to assign the selected employee?',
            choices: roleArray

        }

        // Updated employees role 
    ]).then(({ role_id, emp_id }) => {
        // console.log(role_id)
        // console.log(emp_id)
        let employeeObject = { role_id }
        db.promise().query('UPDATE employee SET ? WHERE id = ?', [employeeObject, emp_id])
            .then(([res]) => {
                if (res.affectedRows > 0) {
                    console.info(`Updated employee's role`);
                }
                else {
                    console.info(`Employee was not Updated`);
                }
                menuList();

            })
    })
}

//DELETE EMPLOYEE
const deleteEmployee = async () => {
    const [employees] = await db.promise().query('SELECT * FROM employee')
    const employeeArray = employees.map(employee => (
        {
            name: employee.first_name + " " + employee.last_name, value: employee.id
        }
    ))
    inquire.prompt({
        type: 'list',
        name: 'id',
        message: 'Select the employee to delete',
        choices: employeeArray
    }).then(answers => {
        db.promise().query('DELETE FROM employee WHERE id = ?', answers.id).then(([res]) => {
            if (res.affectedRows > 0) {
                console.info(`Deleted employee`);
            }
            else {
                console.info(`Employee was not deleted`);
            }
            menuList();
        })
    })

}
// QUIT 
const quit = () => {
    console.log('bye')
    process.exit();
};


menuList();
