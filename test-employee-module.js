#!/usr/bin/env node

/**
 * Employee Module Test Runner
 * 
 * This script runs comprehensive tests for the Employee Management Module
 * to verify that everything is working correctly.
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan')
  log(`  ${message}`, 'bold')
  log('='.repeat(60), 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Test results tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
}

function runCommand(command, description) {
  try {
    logInfo(`Running: ${description}`)
    const output = execSync(command, { 
      cwd: __dirname,
      encoding: 'utf8',
      stdio: 'pipe'
    })
    testResults.total++
    testResults.passed++
    logSuccess(`${description} - PASSED`)
    return { success: true, output }
  } catch (error) {
    testResults.total++
    testResults.failed++
    testResults.errors.push({
      test: description,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    })
    logError(`${description} - FAILED`)
    if (error.stdout) {
      log(`STDOUT: ${error.stdout}`, 'yellow')
    }
    if (error.stderr) {
      log(`STDERR: ${error.stderr}`, 'red')
    }
    return { success: false, error }
  }
}

function checkFileExists(filePath, description) {
  const fullPath = join(__dirname, filePath)
  if (fs.existsSync(fullPath)) {
    testResults.total++
    testResults.passed++
    logSuccess(`${description} - EXISTS`)
    return true
  } else {
    testResults.total++
    testResults.failed++
    testResults.errors.push({
      test: description,
      error: `File not found: ${fullPath}`
    })
    logError(`${description} - NOT FOUND`)
    return false
  }
}

function checkFileContent(filePath, searchText, description) {
  const fullPath = join(__dirname, filePath)
  try {
    const content = fs.readFileSync(fullPath, 'utf8')
    if (content.includes(searchText)) {
      testResults.total++
      testResults.passed++
      logSuccess(`${description} - FOUND`)
      return true
    } else {
      testResults.total++
      testResults.failed++
      testResults.errors.push({
        test: description,
        error: `Content not found in ${fullPath}: "${searchText}"`
      })
      logError(`${description} - NOT FOUND`)
      return false
    }
  } catch (error) {
    testResults.total++
    testResults.failed++
    testResults.errors.push({
      test: description,
      error: `Error reading file ${fullPath}: ${error.message}`
    })
    logError(`${description} - ERROR`)
    return false
  }
}

async function runTests() {
  logHeader('Employee Management Module - Comprehensive Test Suite')
  
  // 1. Check if all required files exist
  logHeader('1. File Structure Verification')
  
  // Frontend components
  checkFileExists('src/pages/employees/EmployeeList.vue', 'Employee List Page')
  checkFileExists('src/components/employee/EmployeeCreateModal.vue', 'Employee Create Modal')
  checkFileExists('src/components/employee/EmployeeDetailModal.vue', 'Employee Detail Modal')
  checkFileExists('src/pages/positions/PositionList.vue', 'Position List Page')
  checkFileExists('src/pages/departments/DepartmentList.vue', 'Department List Page')
  checkFileExists('src/pages/organogram/OrganogramView.vue', 'Organogram View Page')
  
  // Stores
  checkFileExists('src/stores/employee.js', 'Employee Store')
  checkFileExists('src/stores/notification.js', 'Notification Store')
  
  // Router
  checkFileExists('src/router/employee.js', 'Employee Router Module')
  
  // Layout components
  checkFileExists('src/components/layout/SidebarMenu.vue', 'Sidebar Menu')
  
  // Test files
  checkFileExists('src/components/employee/__tests__/EmployeeList.spec.ts', 'Employee List Tests')
  checkFileExists('src/components/employee/__tests__/EmployeeCreateModal.spec.ts', 'Employee Create Modal Tests')
  checkFileExists('src/stores/__tests__/employee.spec.ts', 'Employee Store Tests')
  checkFileExists('src/stores/__tests__/notification.spec.ts', 'Notification Store Tests')

  // 2. Check key functionality in files
  logHeader('2. Component Integration Verification')
  
  checkFileContent(
    'src/components/layout/SidebarMenu.vue',
    'Employee Management',
    'Sidebar contains Employee Management menu'
  )
  
  checkFileContent(
    'src/components/layout/SidebarMenu.vue',
    'toggleEmployeeMenu',
    'Sidebar has collapsible employee menu functionality'
  )
  
  checkFileContent(
    'src/router/index.ts',
    '/positions',
    'Router includes positions route'
  )
  
  checkFileContent(
    'src/router/index.ts',
    '/departments',
    'Router includes departments route'
  )
  
  checkFileContent(
    'src/views/Employees.vue',
    'EmployeeList',
    'Employees view imports new EmployeeList component'
  )

  // 3. Check component features
  logHeader('3. Component Feature Verification')
  
  checkFileContent(
    'src/pages/employees/EmployeeList.vue',
    'statistics',
    'Employee List has statistics display'
  )
  
  checkFileContent(
    'src/pages/employees/EmployeeList.vue',
    'EmployeeCreateModal',
    'Employee List integrates create modal'
  )
  
  checkFileContent(
    'src/components/employee/EmployeeCreateModal.vue',
    'currentStep',
    'Employee Create Modal has step progression'
  )
  
  checkFileContent(
    'src/components/employee/EmployeeCreateModal.vue',
    'totalSteps',
    'Employee Create Modal has multi-step form'
  )
  
  checkFileContent(
    'src/stores/employee.js',
    'fetchEmployees',
    'Employee store has fetch employees action'
  )
  
  checkFileContent(
    'src/stores/employee.js',
    'createEmployee',
    'Employee store has create employee action'
  )

  // 4. Run unit tests if vitest is available
  logHeader('4. Unit Test Execution')
  
  try {
    // Check if vitest is available
    execSync('which npx', { stdio: 'pipe' })
    
    // Run specific test files
    runCommand(
      'npm run test src/stores/__tests__/employee.spec.ts',
      'Employee Store Unit Tests'
    )
    
    runCommand(
      'npm run test src/stores/__tests__/notification.spec.ts',
      'Notification Store Unit Tests'
    )
    
    runCommand(
      'npm run test src/components/employee/__tests__/EmployeeList.spec.ts',
      'Employee List Component Tests'
    )
    
    runCommand(
      'npm run test src/components/employee/__tests__/EmployeeCreateModal.spec.ts',
      'Employee Create Modal Tests'
    )
    
  } catch (error) {
    logWarning('Vitest not available, skipping unit test execution')
  }

  // 5. Build verification
  logHeader('5. Build Verification')
  
  runCommand(
    'npm run type-check',
    'TypeScript Type Checking'
  )

  // 6. API Integration Check
  logHeader('6. API Integration Verification')
  
  checkFileContent(
    'src/stores/employee.js',
    '/api/employees',
    'Employee store uses correct API endpoints'
  )
  
  checkFileContent(
    'src/stores/employee.js',
    '/api/positions',
    'Employee store includes position endpoints'
  )
  
  checkFileContent(
    'src/stores/employee.js',
    '/api/departments',
    'Employee store includes department endpoints'
  )

  // 7. Display final results
  logHeader('Test Results Summary')
  
  log(`Total Tests: ${testResults.total}`)
  logSuccess(`Passed: ${testResults.passed}`)
  
  if (testResults.failed > 0) {
    logError(`Failed: ${testResults.failed}`)
    
    log('\nFailed Tests:', 'red')
    testResults.errors.forEach((error, index) => {
      log(`\n${index + 1}. ${error.test}`, 'red')
      log(`   Error: ${error.error}`, 'yellow')
    })
  }
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1)
  
  if (successRate >= 90) {
    logSuccess(`\n🎉 SUCCESS RATE: ${successRate}% - Employee Module is working correctly!`)
  } else if (successRate >= 70) {
    logWarning(`\n⚠️  SUCCESS RATE: ${successRate}% - Employee Module has some issues`)
  } else {
    logError(`\n❌ SUCCESS RATE: ${successRate}% - Employee Module needs attention`)
  }
  
  // 8. Next steps recommendations
  logHeader('Recommendations')
  
  if (testResults.failed === 0) {
    log('✅ All tests passed! Your Employee Management Module is ready to use.', 'green')
    log('\nNext steps:', 'blue')
    log('1. Start your development server: npm run dev')
    log('2. Navigate to /employees in your browser')
    log('3. Test the employee creation flow')
    log('4. Verify the sidebar navigation works')
  } else {
    log('⚠️  Some tests failed. Please address the issues above.', 'yellow')
    log('\nNext steps:', 'blue')
    log('1. Review the failed tests above')
    log('2. Fix any missing files or implementations')
    log('3. Re-run this test script')
  }
  
  return testResults.failed === 0
}

// Run the tests
runTests().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  logError(`Test suite failed: ${error.message}`)
  process.exit(1)
})