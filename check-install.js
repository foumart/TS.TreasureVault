const fs = require('fs');

if (!fs.existsSync('node_modules')) {
    console.error('Please run npm install');
    process.exit(1);
}