import fs from 'node:fs';
import path from 'node:path';

// Configuration
const CONFIG = {
  targetDirectory: ['/home/runner/work/fables-fe/fables-fe/components', '/home/runner/work/fables-fe/fables-fe/utils', '/home/runner/work/fables-fe/fables-fe/pages', '/home/runner/work/fables-fe/fables-fe/stores']
  spdxHeader: '// SPDX-License-Identifier: Apache-2.0\n',
  allowedExtensions: ['.vue', '.ts'],
  isDryRun: process.argv.includes('--dry-run'),
};

// Function to validate the target directory exists
function validateDirectory(directory) {
  try {
    const stats = fs.statSync(directory);
    if (!stats.isDirectory()) {
      throw new Error(`${directory} is not a directory`);
    }
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Directory ${directory} does not exist`);
    }
    throw error;
  }
}

// Function to recursively process files
function addHeaderToFiles(directory) {
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    let modifiedFiles = 0;
    let skippedFiles = 0;

    entries.forEach((entry) => {
      const fullPath = path.join(directory, entry.name);
      try {
        if (entry.isDirectory()) {
          const { modified, skipped } = addHeaderToFiles(fullPath);
          modifiedFiles += modified;
          skippedFiles += skipped;
        } else if (entry.isFile() && shouldProcessFile(entry.name)) {
          const result = addHeaderToFile(fullPath);
          if (result.wouldModify) modifiedFiles++;
          if (result.skipped) skippedFiles++;
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    });

    return { modified: modifiedFiles, skipped: skippedFiles };
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
    throw error;
  }
}

// Function to check if a file should be processed
function shouldProcessFile(fileName) {
  return CONFIG.allowedExtensions.includes(path.extname(fileName));
}

// Function to add SPDX header to a file
function addHeaderToFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Check if the file already has any variation of the SPDX header
    if (fileContent.includes('SPDX-License-Identifier: Apache-2.0')) {
      console.log(`[SKIP] Header already exists in ${filePath}`);
      return { skipped: true, wouldModify: false };
    }

    const updatedContent = CONFIG.spdxHeader + fileContent;

    if (CONFIG.isDryRun) {
      console.log(`[DRY RUN] Would add header to ${filePath}`);
      return { skipped: false, wouldModify: true };
    }

    // Create backup before modification
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, fileContent, 'utf8');

    // Prepend the SPDX header
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    // Remove backup after successful write
    fs.unlinkSync(backupPath);
    
    console.log(`[ADDED] Header added to ${filePath}`);
    return { skipped: false, wouldModify: true };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    throw error;
  }
}

// Main execution
try {
  console.log(`SPDX Header Addition Tool`);
  console.log(`Mode: ${CONFIG.isDryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Target Directory: ${CONFIG.targetDirectory}`);
  console.log(`File Types: ${CONFIG.allowedExtensions.join(', ')}`);
  console.log('----------------------------------------');

  validateDirectory(CONFIG.targetDirectory);
  const { modified, skipped } = addHeaderToFiles(CONFIG.targetDirectory);

  console.log('----------------------------------------');
  console.log('Summary:');
  console.log(`Files that would be modified: ${modified}`);
  console.log(`Files skipped (header exists): ${skipped}`);
  
  if (CONFIG.isDryRun) {
    console.log('\nThis was a dry run. No files were modified.');
    console.log('To apply changes, run without --dry-run flag.');
  }

  process.exit(0);
} catch (error) {
  console.error('Script failed:', error.message);
  process.exit(1);
}
