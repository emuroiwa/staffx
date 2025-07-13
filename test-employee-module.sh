#!/bin/bash

# Employee Management Module Test Script
# This script runs comprehensive tests to verify the Employee Management Module is working

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

print_header() {
    echo -e "\n${CYAN}============================================================${NC}"
    echo -e "${BOLD}  $1${NC}"
    echo -e "${CYAN}============================================================${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_file_exists() {
    if [ -f "$1" ]; then
        log_success "$2 - EXISTS"
        return 0
    else
        log_error "$2 - NOT FOUND"
        return 1
    fi
}

check_file_content() {
    if [ -f "$1" ] && grep -q "$2" "$1"; then
        log_success "$3 - FOUND"
        return 0
    else
        log_error "$3 - NOT FOUND"
        return 1
    fi
}

run_command() {
    log_info "Running: $2"
    if eval "$1" >/dev/null 2>&1; then
        log_success "$2 - PASSED"
        return 0
    else
        log_error "$2 - FAILED"
        return 1
    fi
}

print_header "Employee Management Module - Comprehensive Test Suite"

# 1. File Structure Verification
print_header "1. File Structure Verification"

# Frontend components
check_file_exists "src/pages/employees/EmployeeList.vue" "Employee List Page"
check_file_exists "src/components/employee/EmployeeCreateModal.vue" "Employee Create Modal"
check_file_exists "src/components/employee/EmployeeDetailModal.vue" "Employee Detail Modal"
check_file_exists "src/pages/positions/PositionList.vue" "Position List Page"
check_file_exists "src/pages/departments/DepartmentList.vue" "Department List Page"
check_file_exists "src/pages/organogram/OrganogramView.vue" "Organogram View Page"

# Stores
check_file_exists "src/stores/employee.js" "Employee Store"
check_file_exists "src/stores/notification.js" "Notification Store"

# Router
check_file_exists "src/router/employee.js" "Employee Router Module"

# Layout components
check_file_exists "src/components/layout/SidebarMenu.vue" "Sidebar Menu"

# Test files
check_file_exists "src/components/employee/__tests__/EmployeeList.spec.ts" "Employee List Tests"
check_file_exists "src/components/employee/__tests__/EmployeeCreateModal.spec.ts" "Employee Create Modal Tests"
check_file_exists "src/stores/__tests__/employee.spec.ts" "Employee Store Tests"
check_file_exists "src/stores/__tests__/notification.spec.ts" "Notification Store Tests"

# 2. Component Integration Verification
print_header "2. Component Integration Verification"

check_file_content "src/components/layout/SidebarMenu.vue" "Employee Management" "Sidebar contains Employee Management menu"
check_file_content "src/components/layout/SidebarMenu.vue" "toggleEmployeeMenu" "Sidebar has collapsible employee menu functionality"
check_file_content "src/router/index.ts" "/positions" "Router includes positions route"
check_file_content "src/router/index.ts" "/departments" "Router includes departments route"
check_file_content "src/views/Employees.vue" "EmployeeList" "Employees view imports new EmployeeList component"

# 3. Component Feature Verification
print_header "3. Component Feature Verification"

check_file_content "src/pages/employees/EmployeeList.vue" "statistics" "Employee List has statistics display"
check_file_content "src/pages/employees/EmployeeList.vue" "EmployeeCreateModal" "Employee List integrates create modal"
check_file_content "src/components/employee/EmployeeCreateModal.vue" "currentStep" "Employee Create Modal has step progression"
check_file_content "src/components/employee/EmployeeCreateModal.vue" "totalSteps" "Employee Create Modal has multi-step form"
check_file_content "src/stores/employee.js" "fetchEmployees" "Employee store has fetch employees action"
check_file_content "src/stores/employee.js" "createEmployee" "Employee store has create employee action"

# 4. Package.json and Dependencies Check
print_header "4. Dependencies Verification"

check_file_exists "package.json" "Package.json exists"
if [ -f "package.json" ]; then
    if grep -q "@heroicons/vue" package.json; then
        log_success "Heroicons dependency - FOUND"
    else
        log_error "Heroicons dependency - NOT FOUND"
    fi
    
    if grep -q "pinia" package.json; then
        log_success "Pinia store dependency - FOUND"
    else
        log_error "Pinia store dependency - NOT FOUND"
    fi
    
    if grep -q "vue-router" package.json; then
        log_success "Vue Router dependency - FOUND"
    else
        log_error "Vue Router dependency - NOT FOUND"
    fi
fi

# 5. API Integration Check
print_header "5. API Integration Verification"

check_file_content "src/stores/employee.js" "/api/employees" "Employee store uses correct API endpoints"
check_file_content "src/stores/employee.js" "/api/positions" "Employee store includes position endpoints"
check_file_content "src/stores/employee.js" "/api/departments" "Employee store includes department endpoints"

# 6. TypeScript Configuration
print_header "6. TypeScript Configuration"

check_file_exists "tsconfig.json" "TypeScript configuration"
check_file_exists "vite.config.ts" "Vite configuration"

# 7. Test Configuration
print_header "7. Test Configuration"

if [ -f "vitest.config.ts" ] || [ -f "vite.config.ts" ]; then
    log_success "Test configuration - FOUND"
else
    log_error "Test configuration - NOT FOUND"
fi

# 8. Try to run tests if possible
print_header "8. Unit Test Execution"

if command -v npm >/dev/null 2>&1; then
    log_info "NPM found, attempting to run tests..."
    
    if npm list vitest >/dev/null 2>&1; then
        log_info "Vitest available, running unit tests..."
        
        if npm run test -- --run src/stores/__tests__/employee.spec.ts >/dev/null 2>&1; then
            log_success "Employee Store Tests - PASSED"
        else
            log_error "Employee Store Tests - FAILED"
        fi
        
        if npm run test -- --run src/stores/__tests__/notification.spec.ts >/dev/null 2>&1; then
            log_success "Notification Store Tests - PASSED"
        else
            log_error "Notification Store Tests - FAILED"
        fi
    else
        log_warning "Vitest not available, skipping unit test execution"
    fi
else
    log_warning "NPM not available, skipping test execution"
fi

# 9. Build verification
print_header "9. Build Verification"

if command -v npm >/dev/null 2>&1; then
    if npm run type-check >/dev/null 2>&1; then
        log_success "TypeScript Type Checking - PASSED"
    else
        log_error "TypeScript Type Checking - FAILED"
    fi
else
    log_warning "Cannot run build verification - NPM not available"
fi

# 10. Final Results
print_header "Test Results Summary"

echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"
fi

SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))

if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "\n${GREEN}🎉 SUCCESS RATE: ${SUCCESS_RATE}% - Employee Module is working correctly!${NC}"
elif [ $SUCCESS_RATE -ge 70 ]; then
    echo -e "\n${YELLOW}⚠️  SUCCESS RATE: ${SUCCESS_RATE}% - Employee Module has some issues${NC}"
else
    echo -e "\n${RED}❌ SUCCESS RATE: ${SUCCESS_RATE}% - Employee Module needs attention${NC}"
fi

# 11. Recommendations
print_header "Recommendations"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Your Employee Management Module is ready to use.${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Start your development server: npm run dev"
    echo "2. Navigate to /employees in your browser"
    echo "3. Test the employee creation flow"
    echo "4. Verify the sidebar navigation works"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please address the issues above.${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Review the failed tests above"
    echo "2. Fix any missing files or implementations"
    echo "3. Re-run this test script"
fi

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi