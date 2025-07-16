import { ref, computed } from 'vue'

export function useEmployerContributions() {
  const loading = ref(false)
  
  /**
   * Calculate employer contribution based on template and employee data
   * @param {Object} template - The employer contribution template
   * @param {Object} employee - The employee data
   * @param {Number} baseSalary - The base salary for calculation
   * @returns {Object} Calculation result with employer and employee amounts
   */
  const calculateContribution = (template, employee, baseSalary) => {
    if (!template || !employee || !baseSalary) {
      return {
        employer_amount: 0,
        employee_amount: 0,
        total_amount: 0,
        calculation_details: {
          method: 'N/A',
          base_amount: 0,
          employer_rate: 0,
          employee_rate: 0
        }
      }
    }

    let employer_amount = 0
    let employee_amount = 0
    let calculation_details = {
      method: template.calculation_method,
      base_amount: baseSalary,
      employer_rate: 0,
      employee_rate: 0
    }

    // Calculate employer contribution
    if (template.calculation_method === 'fixed_amount') {
      employer_amount = template.amount || 0
      calculation_details.employer_rate = template.amount
    } else if (template.calculation_method === 'percentage_of_salary' || template.calculation_method === 'percentage_of_basic') {
      const percentage = template.default_percentage || 0
      employer_amount = (baseSalary * percentage) / 100
      calculation_details.employer_rate = percentage
    } else if (template.calculation_method === 'formula') {
      // Formula-based calculation (simplified)
      employer_amount = evaluateFormula(template.formula_expression, {
        basic_salary: baseSalary,
        gross_salary: baseSalary,
        years_of_service: employee.years_of_service || 0
      })
    }

    // Calculate employee matching contribution if applicable
    if (template.has_employee_match) {
      if (template.match_logic === 'equal') {
        // 1:1 matching
        employee_amount = employer_amount
        calculation_details.employee_rate = calculation_details.employer_rate
      } else if (template.match_logic === 'percentage' && template.employee_match_percentage) {
        // Percentage-based matching
        employee_amount = (baseSalary * template.employee_match_percentage) / 100
        calculation_details.employee_rate = template.employee_match_percentage
      } else if (template.match_logic === 'custom') {
        // Custom amounts
        if (template.calculation_method === 'fixed_amount') {
          employee_amount = template.employee_match_amount || 0
        } else if (template.calculation_method === 'percentage_of_salary' || template.calculation_method === 'percentage_of_basic') {
          const percentage = template.employee_match_percentage || 0
          employee_amount = (baseSalary * percentage) / 100
          calculation_details.employee_rate = percentage
        }
      }
    }

    // Apply minimum and maximum constraints
    if (template.minimum_amount && employer_amount < template.minimum_amount) {
      employer_amount = template.minimum_amount
    }
    if (template.maximum_amount && employer_amount > template.maximum_amount) {
      employer_amount = template.maximum_amount
    }

    // Apply the same constraints to employee amount if matching
    if (template.has_employee_match && template.match_logic === 'equal') {
      if (template.minimum_amount && employee_amount < template.minimum_amount) {
        employee_amount = template.minimum_amount
      }
      if (template.maximum_amount && employee_amount > template.maximum_amount) {
        employee_amount = template.maximum_amount
      }
    }

    return {
      employer_amount: Math.round(employer_amount * 100) / 100,
      employee_amount: Math.round(employee_amount * 100) / 100,
      total_amount: Math.round((employer_amount + employee_amount) * 100) / 100,
      calculation_details
    }
  }

  /**
   * Simple formula evaluator for basic expressions
   * @param {String} formula - The formula expression
   * @param {Object} variables - Variables to substitute
   * @returns {Number} Calculated result
   */
  const evaluateFormula = (formula, variables) => {
    if (!formula) return 0
    
    try {
      let expression = formula
      
      // Replace variables
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{${key}\\}`, 'g')
        expression = expression.replace(regex, variables[key] || 0)
      })
      
      // Basic security check - only allow numbers, basic math operators, and parentheses
      if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        console.warn('Invalid formula expression:', expression)
        return 0
      }
      
      // Evaluate the expression (note: in production, use a proper expression evaluator)
      // eslint-disable-next-line no-eval
      return eval(expression) || 0
    } catch (error) {
      console.error('Formula evaluation error:', error)
      return 0
    }
  }

  /**
   * Get contribution type display information
   * @param {String} type - The contribution type
   * @returns {Object} Display information
   */
  const getContributionTypeInfo = (type) => {
    const types = {
      pension: {
        label: 'Pension Contribution',
        icon: '🏦',
        description: 'Retirement savings contribution'
      },
      medical_aid: {
        label: 'Medical Aid Contribution',
        icon: '🏥',
        description: 'Health insurance contribution'
      },
      provident_fund: {
        label: 'Provident Fund',
        icon: '💰',
        description: 'Provident fund contribution'
      },
      group_life: {
        label: 'Group Life Insurance',
        icon: '🛡️',
        description: 'Life insurance premium'
      },
      disability: {
        label: 'Disability Insurance',
        icon: '🚑',
        description: 'Disability insurance premium'
      },
      training_levy: {
        label: 'Training Levy',
        icon: '📚',
        description: 'Skills development levy'
      },
      other: {
        label: 'Other Contribution',
        icon: '📄',
        description: 'Other employer contribution'
      }
    }
    
    return types[type] || types.other
  }

  /**
   * Generate UIF-style matching contribution template
   * @param {String} code - Template code
   * @param {String} name - Template name
   * @param {Number} rate - Percentage rate (default 1.0 for UIF)
   * @param {Number} maxSalary - Maximum salary cap
   * @returns {Object} Template configuration
   */
  const generateUifStyleTemplate = (code, name, rate = 1.0, maxSalary = null) => {
    return {
      code,
      name,
      type: 'employer_contribution',
      calculation_method: 'percentage_of_salary',
      default_percentage: rate,
      contribution_type: 'pension',
      has_employee_match: true,
      match_logic: 'equal',
      employee_match_percentage: rate,
      maximum_amount: maxSalary ? (maxSalary * rate) / 100 : null,
      is_taxable: false,
      is_pensionable: false,
      requires_approval: false,
      description: `${name} - Employer and employee each contribute ${rate}% of gross salary${maxSalary ? ` (capped at salary of ${maxSalary})` : ''}`
    }
  }

  /**
   * Preview contribution calculation for testing
   * @param {Object} template - The template
   * @param {Number} testSalary - Test salary amount
   * @returns {Object} Preview calculation
   */
  const previewCalculation = (template, testSalary = 10000) => {
    const mockEmployee = {
      years_of_service: 2
    }
    
    return calculateContribution(template, mockEmployee, testSalary)
  }

  return {
    loading,
    calculateContribution,
    getContributionTypeInfo,
    generateUifStyleTemplate,
    previewCalculation
  }
}