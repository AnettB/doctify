const BONUS = require('./constants').BONUS_PERCENTAGE

/**
 * Computes the staff member's salary and the overall salary in the hierarchy tree.
 * @param  {Number} id The id of the staff member who should be the root
 * @param  {Array} staff The hierarchy tree that belongs to this staff member
 */
const staffMemberSalary = (id, staff) => {
    // Summing up salary on each level using a dictionary
    let salaries = {}
    let salary = 0;
    let employeeSalary = 0;
    let treeSalary = 0;

    // Go through the tree and 
    staff.forEach(member => {
        let memberId = member['id']
        const isManager = member['role'] === 'manager'
        const isSales = member['role'] === 'sales'

        // If the current person has no supervisor, then 
        // we assume that they are on the top of the tree
        let supervisor = member['supervisor'] || id;

        // Base salary along with the precomputed bonus received 
        // for years spent at the company
        salary = member['base_salary'] + member['bonus_per_year']

        // A dictionary which holds all salaries in the tree
        if (salaries[supervisor] === undefined) {
            salaries[supervisor] = {
                allSubordinateSalaries: 0,
                firstLevelSalaries: 0
            }
        }

        // Compute the bonus received for subordinates
        let subOrdinateBonus = 0;
        let allSalaries = 0;
        if (salaries[memberId]) {
            if (isManager) {
                subOrdinateBonus = BONUS.manager.subordinate * salaries[memberId].firstLevelSalaries
            }
            else if (isSales) {
                subOrdinateBonus = BONUS.sales.subordinate * salaries[memberId].allSubordinateSalaries
            }
            allSalaries = salaries[memberId].allSubordinateSalaries
        }

        employeeSalary = salary + Number(subOrdinateBonus.toFixed(2))
        treeSalary = employeeSalary + allSalaries
        // If this is not the supervisor on the top level, then compute 
        // the new values for salaries of the first and n-th level
        if (memberId !== id) {
            salaries[supervisor].firstLevelSalaries += Number(employeeSalary.toFixed(2))
            salaries[supervisor].allSubordinateSalaries += Number((employeeSalary + allSalaries).toFixed(2))
        }
    });
    return { id, employeeSalary, treeSalary }
}

/**
 * Checks if the data structure received from the database is valid.
 * @param  {Number} id The id of the staff member who should be the root
 * @param  {Array} staff The hierarchy tree that belongs to this staff member
 */
const isDataStructureValid = (id, staff) => {
    let isValid = false;
    if (staff.length) {
        const root = staff[staff.length - 1]
        if (root.id === id) {
            isValid = true
        }
        else {
            // The data is not organized as expected
            throw new Error('Incorrect tree structure')
        }
    }
    else {
        throw new Error('Tree is empty')
    }
    return isValid
}

module.exports = {
    staffMemberSalary,
    isDataStructureValid
}