const Pool = require('pg').Pool
const queries = require('./queries')
const staffService = require('./staffService');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

/**
 * Creates and populates the staff table.
 */
const init = async () => {
    try {
        const res = await pool.query(queries.createStaffTable)
        if (res) {
            await pool.query(queries.populateStaffTable)
            console.log('Staff table populated')
        }
    } catch (error) {
        console.error('Could not initialize staff table')
    }
}

/**
 * Computes salary of a staff member.
 */
const getSalaryById = async (request, response) => {
    const id = parseInt(request.params.id)
    const TODAY = new Date().toLocaleDateString()
    try {
        const date = request.query.date || TODAY
        const results = await pool.query(queries.getTree, [id, date])
        const staff = results.rows
        const staffSalary = staffService.staffMemberSalary(id, staff)

        response.status(200).send({
            staffSalary
        })
    } catch (error) {
        console.log(error)
        response.sendStatus(500)
    }
}


/**
 * Computes salary of the entire company.
 */
const getCompanySalary = async (request, response) => {
    let companySalary = 0;
    const results = await pool.query(queries.getSupervisors);
    const TODAY = new Date().toLocaleDateString()

    try {
        const date = request.query.date || TODAY

        // Inside the loop there is an asynchronous call and 
        // the companySalary needs to be waited for, otherwise
        // the initial value (0) is sent back.
        for await (const supervisor of results.rows) {
            let id = supervisor['id']
            const supervisorTree = await pool.query(queries.getTree, [id, date])
            const staff = supervisorTree.rows
            if (staffService.isDataStructureValid(id, staff)) {
                const staffSalary = staffService.staffMemberSalary(id, staff)
                companySalary += staffSalary.treeSalary
            }
        }

        response.status(200).send({
            companySalary
        })

    } catch (error) {
        response.sendStatus(500)
    }
}

module.exports = {
    init,
    getSalaryById,
    getCompanySalary,
}