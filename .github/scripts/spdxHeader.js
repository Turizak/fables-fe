const fs = require('fs');
const path = require('path');

// Configuration
const targetDirectory = './src'; // Directory to process
const spdxHeader = '// SPDX-License-Identifier: Apache-2.0\n';

// Function to recursively process files
function addHeaderToFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      addHeaderToFiles(fullPath);
    } else if (entry.isFile() && shouldProcessFile(entry.name)) {
      // Process file
      addHeaderToFile(fullPath);
    }
  });
}

// Function to check if a file should be processed
function shouldProcessFile(fileName) {
  // Add logic to filter file types (e.g., only .js, .ts, .css, etc.)
  const allowedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java']; // Add extensions as needed
  return allowedExtensions.includes(path.extname(fileName));
}

// Function to add SPDX header to a file
function addHeaderToFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Check if the file already has the SPDX header
  if (fileContent.startsWith(spdxHeader)) {
    console.log(`Header already exists in ${filePath}`);
    return;
  }

  // Prepend the SPDX header
  const updatedContent = spdxHeader + fileContent;
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added header to ${filePath}`);
}

// Run the script
console.log(`Adding SPDX headers to files in: ${targetDirectory}`);
addHeaderToFiles(targetDirectory);
console.log('SPDX header addition completed.');
