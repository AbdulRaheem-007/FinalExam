/**
 * Basic API Tests for Backend
 * These tests verify core functionality without requiring a full test framework
 */

const http = require('http');

// Test configuration
const TEST_PORT = process.env.TEST_PORT || 5001;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Simple test results tracker
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

/**
 * Simple assertion helper
 */
function assert(condition, testName) {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
  } else {
    testsFailed++;
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
  }
}

/**
 * Test 1: Verify required dependencies are installed
 */
function testDependencies() {
  console.log('\n📦 Testing Dependencies...');
  
  try {
    require('express');
    assert(true, 'Express is installed');
  } catch (e) {
    assert(false, 'Express is installed');
  }

  try {
    require('mongoose');
    assert(true, 'Mongoose is installed');
  } catch (e) {
    assert(false, 'Mongoose is installed');
  }

  try {
    require('cors');
    assert(true, 'CORS is installed');
  } catch (e) {
    assert(false, 'CORS is installed');
  }

  try {
    require('dotenv');
    assert(true, 'Dotenv is installed');
  } catch (e) {
    assert(false, 'Dotenv is installed');
  }
}

/**
 * Test 2: Verify server file structure
 */
function testFileStructure() {
  console.log('\n📁 Testing File Structure...');
  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'src/server.js',
    'package.json',
    'Dockerfile'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);
    assert(exists, `${file} exists`);
  });

  const requiredDirs = [
    'src/controllers',
    'src/models',
    'src/middleware'
  ];

  requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    const exists = fs.existsSync(dirPath);
    assert(exists, `${dir} directory exists`);
  });
}

/**
 * Test 3: Verify environment configuration
 */
function testConfiguration() {
  console.log('\n⚙️  Testing Configuration...');
  
  // Check if .env.example exists
  const fs = require('fs');
  const path = require('path');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (fs.existsSync(envExamplePath)) {
    assert(true, '.env.example file exists');
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} .env.example not found (optional)`);
  }

  // Verify package.json has required scripts
  const packageJson = require('../package.json');
  assert(packageJson.scripts && packageJson.scripts.start, 'package.json has start script');
  assert(packageJson.dependencies && packageJson.dependencies.express, 'Express is in dependencies');
  assert(packageJson.dependencies && packageJson.dependencies.mongoose, 'Mongoose is in dependencies');
}

/**
 * Test 4: Verify models are properly structured
 */
function testModels() {
  console.log('\n🗄️  Testing Database Models...');
  const fs = require('fs');
  const path = require('path');

  const modelsDir = path.join(__dirname, '..', 'src', 'models');
  
  if (fs.existsSync(modelsDir)) {
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
    assert(modelFiles.length > 0, `Found ${modelFiles.length} model file(s)`);
    
    // Check if models export properly (basic check)
    modelFiles.forEach(modelFile => {
      try {
        const model = require(path.join(modelsDir, modelFile));
        assert(model !== undefined, `${modelFile} exports successfully`);
      } catch (e) {
        assert(false, `${modelFile} exports successfully - Error: ${e.message}`);
      }
    });
  } else {
    assert(false, 'Models directory exists');
  }
}

/**
 * Test 5: Verify Dockerfile is valid
 */
function testDockerfile() {
  console.log('\n🐳 Testing Dockerfile...');
  const fs = require('fs');
  const path = require('path');

  const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
  
  if (fs.existsSync(dockerfilePath)) {
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    assert(dockerfileContent.includes('FROM'), 'Dockerfile has FROM instruction');
    assert(dockerfileContent.includes('WORKDIR'), 'Dockerfile has WORKDIR instruction');
    assert(dockerfileContent.includes('COPY'), 'Dockerfile has COPY instruction');
    assert(dockerfileContent.includes('EXPOSE'), 'Dockerfile has EXPOSE instruction');
    assert(dockerfileContent.includes('CMD'), 'Dockerfile has CMD instruction');
  } else {
    assert(false, 'Dockerfile exists');
  }
}

/**
 * Print test summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testsRun}`);
  console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`);
  console.log('='.repeat(50));

  if (testsFailed === 0) {
    console.log(`\n${colors.green}✓ All tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed!${colors.reset}\n`);
    process.exit(1);
  }
}

/**
 * Run all tests
 */
function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Running Backend Tests');
  console.log('='.repeat(50));

  testDependencies();
  testFileStructure();
  testConfiguration();
  testModels();
  testDockerfile();

  printSummary();
}

// Run tests
runTests();
