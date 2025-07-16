You are a senior Laravel developer . We need to enhance the payroll engine to support country-specific statutory deduction configurations.

### Context:
Employers may choose to pay statutory deductions (like PAYE, UIF, NSSF) **on behalf of employees**. When this happens:
- Some deductions are considered **taxable benefits** (e.g., employer-paid PAYE)
- Others are not (e.g., employer-paid UIF in SA)
- This must be configured per country and per deduction type

### Tasks:

1. Update the `statutory_deductions` configuration model/table to include:
   - `is_employer_payable` (boolean) — whether employer can optionally cover it
   - `employer_covers_employee_portion` (boolean)
   - `is_taxable_if_employer_paid` (boolean)
   - `country_uuid` 

2. Allow company admins to configure for their company (per country rules):
   - Which deductions they will cover on behalf of employees
   - Whether that coverage is taxable

3. Update PayrollService to:
   - Check if a deduction is employer-paid
   - If taxable, add the deduction amount to gross income before PAYE calculation
   - Still apply the deduction in payroll breakdown
   - Optionally show "gross-up" for employer-paid PAYE if applicable

4. Return detailed `statutory_breakdown` in payroll:
   ```php
   [
     'name' => 'PAYE',
     'amount' => 3000,
     'paid_by' => 'employer',
     'is_taxable' => true
   ]


Goal: Statutory deductions must be:

Configurable by country

Paid by either employee, employer, or both

Applied correctly during tax calculations

Shown transparently in payslips and audit logs