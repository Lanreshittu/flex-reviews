const fs = require('fs');
const path = require('path');

// Ensure dist/src directory exists
const distSrcDir = path.join(process.cwd(), 'dist', 'src');
if (!fs.existsSync(distSrcDir)) {
  fs.mkdirSync(distSrcDir, { recursive: true });
}

// Copy mock file if it exists
const sourceMockFile = path.join(process.cwd(), 'src', 'hostaway.mock.json');
const destMockFile = path.join(distSrcDir, 'hostaway.mock.json');

if (fs.existsSync(sourceMockFile)) {
  fs.copyFileSync(sourceMockFile, destMockFile);
  console.log('✅ Copied hostaway.mock.json to dist/src/');
} else {
  console.log('⚠️  hostaway.mock.json not found in src/, skipping copy');
}

console.log('📦 Assets copied successfully');
