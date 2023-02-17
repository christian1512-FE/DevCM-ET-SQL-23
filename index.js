
const inquire = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '8993CH_mm_2',
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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }

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
            case 'Quit':
                quit();
                break;

        }

    });

};

// VIEW ROLES
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

// VIEW EMPLOYEE
const viewEmployeee = () => {
    db.promise().query('SELECT CONCAT(first_name, " ", last_name)AS name, role.title AS title FROM employee LEFT JOIN role ON employee.role_id = role.id').then(([res]) => {
        console.table(res)

        menuList();

    })
}

// ADD EMPLOYEE
const addEmployee = () => {
    menuList();

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
        message: 'Enter role title'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary'
    },
    {
        type: 'list',
        name: 'department_id',
        message: 'Select the department',
        choices: departmentArray
    }
]).then(answers => console.log(answers
    ))
}

// ADD DEPARTMENT
const addDepartment = () => {
    inquire.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the Department name:'
    }).then(answer => {
        db.promise().query('INSERT INTO department(department_name)VALUES(?)', answer.name).then(([res]) => {
            if (res.affectedRows > 0) {
                console.info(`${answer.name} was added to deparment database`)
            }
            else {
                console.info(`${answer.name} was NOT added deparment database`)
            }
            menuList();

        })
    })

}

// UPDATE EMPLOYEE ROLE
const updateEmployeeRole = () => {
    menuList();
};

// QUIT 
const quit = () => {
    console.log('bye')
    process.exit();
};


menuList();
