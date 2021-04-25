const staffService = require('../staffService')
const assert = require('assert').strict;

const treeKirk = [
    {
        id: 4,
        name: 'Uhura',
        role: 'employee',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    },
    {
        id: 5,
        name: 'McCoy',
        role: 'employee',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    },
    {
        id: 2,
        name: 'Spock',
        role: 'manager',
        base_salary: 100,
        supervisor: 1,
        bonus_per_year: 25
    },
    {
        id: 3,
        name: 'Scott',
        role: 'manager',
        base_salary: 100,
        supervisor: 1,
        bonus_per_year: 40
    },
    {
        id: 1,
        name: 'Kirk',
        role: 'sales',
        base_salary: 100,
        supervisor: null,
        bonus_per_year: 21
    }
]

const treeSpock = [
    {
        id: 4,
        name: 'Uhura',
        role: 'employee',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    },
    {
        id: 5,
        name: 'McCoy',
        role: 'employee',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    },
    {
        id: 2,
        name: 'Spock',
        role: 'manager',
        base_salary: 100,
        supervisor: 1,
        bonus_per_year: 25
    }
]

const treeUhura = [
    {
        id: 4,
        name: 'Uhura',
        role: 'employee',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    }
]

const treeScott = [
    {
        id: 3,
        name: 'Scott',
        role: 'manager',
        base_salary: 100,
        supervisor: 2,
        bonus_per_year: 0
    }
]

MOCKED_STAFF = [
    { 'id': 1, 'name': 'Kirk', 'salary': 122.4, 'treeSalary': 588.4, 'tree': treeKirk },
    { 'id': 2, 'name': 'Spock', 'salary': 126, 'treeSalary': 326, 'tree': treeSpock },
    { 'id': 3, 'name': 'Scott', 'salary': 140, 'treeSalary': 140, 'tree': treeScott },
    { 'id': 4, 'name': 'Uhura', 'salary': 100, 'treeSalary': 100, 'tree': treeUhura },
]


describe('Staff member salary and sum of salary in a tree', () => {
    it('Should compute the employee salary if the supervisor is sales and subordinates are a combination of managers and employees.', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Kirk')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).employeeSalary, member.salary)
    })

    it('Should compute the employee salary if the supervisor is a manager and subordinates are employees.', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Spock')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).employeeSalary, member.salary)
    })

    it('Should compute the employee salary for a single employee.', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Uhura')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).employeeSalary, member.salary)
    })

    it('Should sum all the salaries (combination of sales, manager, employee).', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Kirk')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).treeSalary, member.treeSalary)
    })

    it('Should sum all the salaries when the tree is a combination of manager and employees.', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Spock')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).treeSalary, member.treeSalary)
    })

    it('Should return the salary of the staff member if they are the only member in the tree', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Scott')[0]
        assert.equal(staffService.staffMemberSalary(member.id, member.tree).treeSalary, member.treeSalary)
    })
})

describe('Datastructure received from database', () => {

    it('Should return true if the input tree satisfies the minimum requirements', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Kirk')[0]
        assert.equal(staffService.isDataStructureValid(member.id, member.tree), true);
    })

    it('Should throw an error if the input tree is incorrect', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Spock')[0]
        assert.throws(
            () => { staffService.isDataStructureValid(member.id, member.tree.reverse()) },
            Error);
    })

    it('Should throw an error if the input tree is empty', () => {
        const member = MOCKED_STAFF.filter(m => m.name = 'Spock')[0]
        assert.throws(
            () => { staffService.isDataStructureValid(member.id, []) },
            Error);

    })
})