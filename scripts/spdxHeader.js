import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";

// Configuration
const CONFIG = {
  targetDirectories: [
    "/home/runner/work/fables-fe/fables-fe/components",
    "/home/runner/work/fables-fe/fables-fe/utils",
    "/home/runner/work/fables-fe/fables-fe/pages",
    "/home/runner/work/fables-fe/fables-fe/stores",
  ],
  spdxHeader: "// SPDX-License-Identifier: Apache-2.0\n",
  allowedExtensions: [".vue", ".ts"],
  isDryRun: process.argv.includes("--dry-run"),
  branchName: `add-spdx-header-${Date.now()}`,
  commitMessage: "Add SPDX headers",
  pullRequestTitle: "Add SPDX headers to project files",
  pullRequestBody: "This pull request adds SPDX headers to the specified project files.",
  repoOwner: "your-username-or-org",
  repoName: "fables-fe",
  token: process.env.GITHUB_TOKEN, // Ensure this token has appropriate repo permissions
};

// Function to execute shell commands
function execCommand(command) {
  try {
    return execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`, error.message);
    throw error;
  }
}

// Other functions like `validateDirectories`, `addHeaderToFiles`, `addHeaderToFile`, and `shouldProcessFile` remain the same

// Main execution
async function main() {
  try {
    console.log(`SPDX Header Addition Tool`);
    console.log(`Mode: ${CONFIG.isDryRun ? "DRY RUN" : "LIVE"}`);
    console.log(`Target Directories: ${CONFIG.targetDirectories.join(", ")}`);
    console.log(`File Types: ${CONFIG.allowedExtensions.join(", ")}`);
    console.log("----------------------------------------");

    validateDirectories(CONFIG.targetDirectories);

    // Create and switch to a new branch
    execCommand(`git checkout -b ${CONFIG.branchName}`);

    let totalModified = 0;
    let totalSkipped = 0;

    CONFIG.targetDirectories.forEach((directory) => {
      console.log(`Processing directory: ${directory}`);
      const { modified, skipped } = addHeaderToFiles(directory);
      totalModified += modified;
      totalSkipped += skipped;
    });

    if (totalModified > 0 && !CONFIG.isDryRun) {
      // Stage and commit changes
      execCommand("git add .");
      execCommand(`git commit -m "${CONFIG.commitMessage}"`);

      // Push the branch to the remote repository
      execCommand(`git push origin ${CONFIG.branchName}`);

      // Create a pull request using GitHub API
      const octokit = new Octokit({ auth: CONFIG.token });
      const { data: pr } = await octokit.pulls.create({
        owner: CONFIG.repoOwner,
        repo: CONFIG.repoName,
        title: CONFIG.pullRequestTitle,
        body: CONFIG.pullRequestBody,
        head: CONFIG.branchName,
        base: "main", // Adjust if your default branch is different
      });

      console.log(`Pull request created: ${pr.html_url}`);
    } else {
      console.log("No files modified. Skipping commit and pull request.");
    }

    console.log("----------------------------------------");
    console.log("Summary:");
    console.log(`Files that would be modified: ${totalModified}`);
    console.log(`Files skipped (header exists): ${totalSkipped}`);

    if (CONFIG.isDryRun) {
      console.log("\nThis was a dry run. No files were modified.");
      console.log("To apply changes, run without --dry-run flag.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Script failed:", error.message);
    process.exit(1);
  }
}

main();
