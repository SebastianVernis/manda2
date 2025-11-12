#!/usr/bin/env node

/**
 * Automated Deployment Status Checker
 * Tests all critical components for deployment readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const symbols = {
  pass: '✅',
  fail: '❌',
  warn: '⚠️',
  info: 'ℹ️'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, fn) {
  totalTests++;
  try {
    const result = fn();
    if (result === true) {
      passedTests++;
      log(`${symbols.pass} ${name}`, 'green');
      return true;
    } else if (result === 'warn') {
      warnings++;
      log(`${symbols.warn} ${name}`, 'yellow');
      return 'warn';
    } else {
      failedTests++;
      log(`${symbols.fail} ${name}`, 'red');
      return false;
    }
  } catch (error) {
    failedTests++;
    log(`${symbols.fail} ${name}: ${error.message}`, 'red');
    return false;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function hasContent(filePath) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.trim().length > 0;
}

function hasMergeConflicts(filePath) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('<<<<<<<') || content.includes('>>>>>>>') || content.includes('=======');
}

function commandExists(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getVersion(cmd) {
  try {
    return execSync(`${cmd} --version`, { encoding: 'utf8' }).trim().split('\n')[0];
  } catch {
    return 'unknown';
  }
}

function checkDependencies(packageJsonPath) {
  if (!fileExists(packageJsonPath)) return false;
  const dir = path.dirname(packageJsonPath);
  return dirExists(path.join(dir, 'node_modules'));
}

log('\n' + '='.repeat(60), 'cyan');
log('🚀 MANDA2/YEGA DEPLOYMENT STATUS CHECK', 'cyan');
log('='.repeat(60) + '\n', 'cyan');

// ============================================================================
// 1. SYSTEM REQUIREMENTS
// ============================================================================
log('\n📋 1. SYSTEM REQUIREMENTS\n', 'blue');

test('Node.js installed', () => commandExists('node'));
test('npm installed', () => commandExists('npm'));
test('Git installed', () => commandExists('git'));

if (commandExists('node')) {
  log(`   Node version: ${getVersion('node')}`, 'cyan');
}
if (commandExists('npm')) {
  log(`   npm version: ${getVersion('npm')}`, 'cyan');
}

// ============================================================================
// 2. MERGE CONFLICTS
// ============================================================================
log('\n🔀 2. MERGE CONFLICTS CHECK\n', 'blue');

const criticalFiles = [
  'package.json',
  'Caddyfile',
  'backend/.env',
  'frontend/.env',
  'frontend/.env.production'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  test(`No conflicts in ${file}`, () => {
    if (!fileExists(filePath)) return 'warn';
    return !hasMergeConflicts(filePath);
  });
});

// ============================================================================
// 3. PROJECT STRUCTURE
// ============================================================================
log('\n📁 3. PROJECT STRUCTURE\n', 'blue');

test('Backend directory exists', () => dirExists(path.join(__dirname, 'backend')));
test('Frontend directory exists', () => dirExists(path.join(__dirname, 'frontend')));
test('Backend package.json exists', () => fileExists(path.join(__dirname, 'backend/package.json')));
test('Frontend package.json exists', () => fileExists(path.join(__dirname, 'frontend/package.json')));
test('Backend server.js exists', () => fileExists(path.join(__dirname, 'backend/server.js')));
test('Frontend index.html exists', () => fileExists(path.join(__dirname, 'frontend/index.html')));

// ============================================================================
// 4. ENVIRONMENT CONFIGURATION
// ============================================================================
log('\n⚙️ 4. ENVIRONMENT CONFIGURATION\n', 'blue');

test('Backend .env exists', () => fileExists(path.join(__dirname, 'backend/.env')));
test('Backend .env has content', () => hasContent(path.join(__dirname, 'backend/.env')));
test('Frontend .env exists', () => fileExists(path.join(__dirname, 'frontend/.env')));
test('Frontend .env.production exists', () => fileExists(path.join(__dirname, 'frontend/.env.production')));

// Check for required env variables
const backendEnvPath = path.join(__dirname, 'backend/.env');
if (fileExists(backendEnvPath)) {
  const envContent = fs.readFileSync(backendEnvPath, 'utf8');
  test('MONGODB_URI configured', () => envContent.includes('MONGODB_URI='));
  test('JWT_SECRET configured', () => envContent.includes('JWT_SECRET='));
  test('PORT configured', () => envContent.includes('PORT='));
  test('No merge conflicts in .env', () => !hasMergeConflicts(backendEnvPath));
}

// ============================================================================
// 5. DEPENDENCIES
// ============================================================================
log('\n📦 5. DEPENDENCIES\n', 'blue');

test('Root dependencies installed', () => checkDependencies(path.join(__dirname, 'package.json')));
test('Backend dependencies installed', () => checkDependencies(path.join(__dirname, 'backend/package.json')));
test('Frontend dependencies installed', () => checkDependencies(path.join(__dirname, 'frontend/package.json')));

// ============================================================================
// 6. BUILD STATUS
// ============================================================================
log('\n🏗️ 6. BUILD STATUS\n', 'blue');

const distPath = path.join(__dirname, 'frontend/dist');
test('Frontend dist directory exists', () => dirExists(distPath));

if (dirExists(distPath)) {
  test('Frontend index.html built', () => fileExists(path.join(distPath, 'index.html')));
  test('Frontend assets directory exists', () => dirExists(path.join(distPath, 'assets')));
  
  // Check dist size
  try {
    const stats = fs.statSync(distPath);
    log(`   Dist directory created: ${stats.mtime.toLocaleString()}`, 'cyan');
  } catch (e) {
    // Ignore
  }
}

// ============================================================================
// 7. DEPLOYMENT TOOLS
// ============================================================================
log('\n🛠️ 7. DEPLOYMENT TOOLS\n', 'blue');

test('PM2 installed', () => commandExists('pm2'));
test('MongoDB installed', () => commandExists('mongod') || commandExists('mongosh'));
test('Caddy or Nginx installed', () => commandExists('caddy') || commandExists('nginx'));

if (commandExists('pm2')) {
  log(`   PM2 version: ${getVersion('pm2')}`, 'cyan');
}
if (commandExists('mongod')) {
  log(`   MongoDB installed`, 'cyan');
}
if (commandExists('caddy')) {
  log(`   Caddy installed`, 'cyan');
}
if (commandExists('nginx')) {
  log(`   Nginx installed`, 'cyan');
}

// ============================================================================
// 8. DEPLOYMENT SCRIPTS
// ============================================================================
log('\n📜 8. DEPLOYMENT SCRIPTS\n', 'blue');

const scripts = [
  'build.sh',
  'deploy.sh',
  'install-mongodb.sh',
  'ecosystem.config.js',
  'Caddyfile',
  'nginx.conf'
];

scripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  test(`${script} exists`, () => fileExists(scriptPath));
  
  if (script.endsWith('.sh')) {
    test(`${script} is executable`, () => {
      try {
        const stats = fs.statSync(scriptPath);
        return (stats.mode & 0o111) !== 0;
      } catch {
        return false;
      }
    });
  }
});

// ============================================================================
// 9. CONFIGURATION FILES
// ============================================================================
log('\n⚙️ 9. CONFIGURATION FILES\n', 'blue');

test('ecosystem.config.js valid', () => {
  try {
    require('./ecosystem.config.js');
    return true;
  } catch {
    return false;
  }
});

test('Caddyfile has no conflicts', () => !hasMergeConflicts(path.join(__dirname, 'Caddyfile')));

// ============================================================================
// 10. DOCUMENTATION
// ============================================================================
log('\n📚 10. DOCUMENTATION\n', 'blue');

const docs = [
  'README.md',
  'SERVER_SETUP.md',
  'MONGODB_SETUP.md',
  'DEPLOYMENT_CHECKLIST.md'
];

docs.forEach(doc => {
  test(`${doc} exists`, () => fileExists(path.join(__dirname, doc)));
});

// ============================================================================
// SUMMARY
// ============================================================================
log('\n' + '='.repeat(60), 'cyan');
log('📊 TEST SUMMARY', 'cyan');
log('='.repeat(60), 'cyan');

const totalScore = Math.round((passedTests / totalTests) * 100);
const scoreColor = totalScore >= 80 ? 'green' : totalScore >= 50 ? 'yellow' : 'red';

log(`\nTotal Tests: ${totalTests}`, 'cyan');
log(`Passed: ${passedTests}`, 'green');
log(`Failed: ${failedTests}`, 'red');
log(`Warnings: ${warnings}`, 'yellow');
log(`\nDeployment Readiness Score: ${totalScore}%`, scoreColor);

if (totalScore >= 80) {
  log('\n✅ System is ready for deployment!', 'green');
} else if (totalScore >= 50) {
  log('\n⚠️ System needs attention before deployment', 'yellow');
} else {
  log('\n❌ System is NOT ready for deployment', 'red');
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================
log('\n📋 NEXT STEPS:\n', 'blue');

if (failedTests > 0) {
  log('Critical issues to fix:', 'red');
  
  if (!checkDependencies(path.join(__dirname, 'backend/package.json'))) {
    log('  1. Install backend dependencies: cd backend && npm install', 'yellow');
  }
  
  if (!checkDependencies(path.join(__dirname, 'frontend/package.json'))) {
    log('  2. Install frontend dependencies: cd frontend && npm install', 'yellow');
  }
  
  if (!dirExists(path.join(__dirname, 'frontend/dist'))) {
    log('  3. Build frontend: cd frontend && npm run build', 'yellow');
  }
  
  if (!commandExists('mongod') && !commandExists('mongosh')) {
    log('  4. Install MongoDB: sudo ./install-mongodb.sh', 'yellow');
  }
  
  if (!commandExists('pm2')) {
    log('  5. Install PM2: npm install -g pm2', 'yellow');
  }
  
  if (!commandExists('caddy') && !commandExists('nginx')) {
    log('  6. Install Caddy or Nginx', 'yellow');
  }
  
  // Check for merge conflicts
  const filesWithConflicts = criticalFiles.filter(file => {
    const filePath = path.join(__dirname, file);
    return fileExists(filePath) && hasMergeConflicts(filePath);
  });
  
  if (filesWithConflicts.length > 0) {
    log(`  7. Resolve merge conflicts in: ${filesWithConflicts.join(', ')}`, 'yellow');
  }
}

log('\nFor detailed deployment instructions, see:', 'cyan');
log('  - DEPLOYMENT_CHECKLIST.md', 'cyan');
log('  - SERVER_SETUP.md', 'cyan');
log('  - MONGODB_SETUP.md', 'cyan');

log('\n' + '='.repeat(60) + '\n', 'cyan');

process.exit(failedTests > 0 ? 1 : 0);
