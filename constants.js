const BONUS_PERCENTAGE = {
    employee: {
        per_year_max: 0.3,
        per_year: 0.03,
        subordinate: 0
    },
    manager: {
        per_year_max: 0.4,
        per_year: 0.05,
        subordinate: 0.005
    },
    sales: {
        per_year_max: 0.35,
        per_year: 0.01,
        subordinate: 0.003
    },
}


module.exports = {
    BONUS_PERCENTAGE
}