const BONUS_PERC = require('./constants').BONUS_PERCENTAGE

const createStaffTable = `
    DROP TABLE IF EXISTS staff CASCADE; 
    DROP TYPE IF EXISTS STAFF_MEMBER_ROLE;

    CREATE TYPE STAFF_MEMBER_ROLE AS ENUM ('employee', 'manager', 'sales');
    CREATE TABLE IF NOT EXISTS public.staff(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        joined_on DATE,
        role STAFF_MEMBER_ROLE,
        base_salary INTEGER DEFAULT 100
    );

    ALTER TABLE staff ADD COLUMN supervisor INTEGER REFERENCES staff(id);
`;

const populateStaffTable = `
    INSERT INTO staff (name, joined_on, role, supervisor) 
    VALUES 
    ('Kirk', '2000-02-01', 'sales', NULL),
    ('Spock', '2016-03-01', 'manager', 1),
    ('Scott', '2010-10-01', 'manager', 1),
    ('Uhura', '2021-04-01', 'employee', 2),
    ('McCoy', '2021-01-01', 'employee', 2);
`;

const populateStaffTableLarger = `
    INSERT INTO staff (name, joined_on, role, supervisor) 
    VALUES 
    ('Kirk', '2000-02-01', 'sales', NULL),
    ('Spock', '2016-03-01', 'manager', 1),
    ('Scott', '2010-10-01', 'manager', 1),
    ('Uhura', '2021-04-01', 'employee', 2),
    ('McCoy', '2021-01-01', 'employee', 2),
    ('Tilly', '2021-01-01', 'sales', 2),
    ('Adira', '2021-01-01', 'employee', 6);
`;

const getTree = `
    -- Create the hierarchy tree.
    with recursive tree as (
        select id, name, role, base_salary, 0 as level
        from staff
        where id = ($1)
            union
        select staff.id, staff.name, staff.role, staff.base_salary, tree.level + 1
        from staff
        join tree on staff.supervisor = tree.id
    ), 
    -- Prepare the maximum bonus for years spent at the company and compute the years spent at the company.
    coeffs_and_year_spent as (
        select
            id, 
            case 
                when role = 'employee' then ${BONUS_PERC.employee.per_year_max}
                when role = 'manager' then ${BONUS_PERC.manager.per_year_max}
                when role = 'sales' then ${BONUS_PERC.sales.per_year_max}
            end as coeff_bonus_max,
            case 
                when role = 'employee' then ${BONUS_PERC.employee.per_year}
                when role = 'manager' then ${BONUS_PERC.manager.per_year}
                when role = 'sales' then ${BONUS_PERC.sales.per_year}
            end as coeff_bonus_year,
            date_part('year', ($2)::date)-date_part('year', joined_on) as years_at_company
        from staff
        where joined_on <= ($2)
    ),
    -- Determine the bonus each staff member can get per year (without subordinate).
    salary_details as (
        select 
            staff.id, 
            name, 
            role, 
            supervisor,
            base_salary,
            least(base_salary * coeff_bonus_max, years_at_company * base_salary * coeff_bonus_year) as bonus_per_year
        from staff
    join coeffs_and_year_spent 
    on staff.id = coeffs_and_year_spent.id
    )
    -- Join the hierarchy tree and the yearly bonus for each staff member.
    select * from tree join salary_details on tree.id = salary_details.id
    order by level desc;
`;

const getSupervisors = `SELECT id FROM staff WHERE supervisor IS NULL`

module.exports = {
    createStaffTable,
    populateStaffTable,
    getTree,
    getSupervisors
}