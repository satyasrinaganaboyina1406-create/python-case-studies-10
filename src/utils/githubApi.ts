import { CASE_STUDIES } from '../data/caseStudiesData';
import { generateCaseStudyMarkdown, generateRootReadme, StudentRepoConfig } from './zipGenerator';
import { generateFlowchartSvg, generateTerminalOutputSvg } from './svgGenerators';

export interface GitHubUploadProgress {
  step: string;
  percent: number;
  currentFile?: string;
  error?: string;
}

export async function uploadToGitHubViaApi(
  token: string,
  studentConfig: StudentRepoConfig,
  onProgress: (p: GitHubUploadProgress) => void
): Promise<{ repoUrl: string }> {
  const headers = {
    Authorization: `token ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  // 1. Verify token & get authenticated user
  onProgress({ step: 'Authenticating with GitHub...', percent: 10 });
  const userRes = await fetch('https://api.github.com/user', { headers });
  if (!userRes.ok) {
    throw new Error('Invalid GitHub token or insufficient permissions. Please check your Personal Access Token.');
  }
  const userData = await userRes.json();
  const owner = userData.login;

  // 2. Check if repo exists; if not, create it
  onProgress({ step: `Checking repository "${studentConfig.repoName}"...`, percent: 20 });
  let repoRes = await fetch(`https://api.github.com/repos/${owner}/${studentConfig.repoName}`, { headers });
  
  if (repoRes.status === 404) {
    onProgress({ step: `Creating new repository "${studentConfig.repoName}"...`, percent: 30 });
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: studentConfig.repoName,
        description: 'Mandatory deliverables for 10 selected Python case studies: Problem statement, objectives, assumptions, algorithm, flowchart, pseudocode, Python source code, test cases, output screenshots, and conclusion.',
        auto_init: true,
        private: false,
      }),
    });
    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Failed to create repository: ${err.message || 'Unknown error'}`);
    }
    // Wait brief moment for repo to initialize
    await new Promise(r => setTimeout(r, 1500));
  } else if (!repoRes.ok) {
    throw new Error('Failed to query repository information.');
  }

  // 3. Prepare list of all files to upload
  const filesToCommit: Array<{ path: string; content: string }> = [];

  // Root README
  filesToCommit.push({
    path: 'README.md',
    content: generateRootReadme(studentConfig),
  });

  // Requirements & gitignore
  filesToCommit.push({
    path: 'requirements.txt',
    content: '# Python 3 standard library implementations\n',
  });
  filesToCommit.push({
    path: '.gitignore',
    content: '__pycache__/\n*.pyc\n.pytest_cache/\nvenv/\n',
  });

  // Each Case Study
  for (const cs of CASE_STUDIES) {
    filesToCommit.push({
      path: `${cs.slug}/README.md`,
      content: generateCaseStudyMarkdown(cs, studentConfig),
    });
    filesToCommit.push({
      path: `${cs.slug}/solution.py`,
      content: cs.deliverables.pythonCode.trim() + '\n',
    });
    filesToCommit.push({
      path: `${cs.slug}/flowchart.svg`,
      content: generateFlowchartSvg(cs),
    });
    filesToCommit.push({
      path: `${cs.slug}/output_screenshot.svg`,
      content: generateTerminalOutputSvg(cs),
    });
    filesToCommit.push({
      path: `${cs.slug}/terminal_output.txt`,
      content: `$ ${cs.deliverables.outputScreenshot.terminalCommand}\n\n${cs.deliverables.outputScreenshot.rawConsoleOutput}\n`,
    });
  }

  // 4. Upload files via GitHub contents API
  const totalFiles = filesToCommit.length;
  for (let i = 0; i < totalFiles; i++) {
    const file = filesToCommit[i];
    const pct = 35 + Math.round(((i + 1) / totalFiles) * 60);
    onProgress({
      step: `Uploading files (${i + 1}/${totalFiles})...`,
      currentFile: file.path,
      percent: pct,
    });

    // Check if file already exists to get SHA for update
    let sha: string | undefined = undefined;
    const existingRes = await fetch(`https://api.github.com/repos/${owner}/${studentConfig.repoName}/contents/${file.path}`, { headers });
    if (existingRes.ok) {
      const existingData = await existingRes.json();
      sha = existingData.sha;
    }

    // Base64 encode UTF-8
    const contentBase64 = btoa(unescape(encodeURIComponent(file.content)));

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${studentConfig.repoName}/contents/${file.path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat(case-studies): add ${file.path}`,
        content: contentBase64,
        sha,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      console.warn(`Could not push ${file.path}:`, err);
    }
  }

  onProgress({ step: 'Upload successfully finished!', percent: 100 });
  return { repoUrl: `https://github.com/${owner}/${studentConfig.repoName}` };
}
