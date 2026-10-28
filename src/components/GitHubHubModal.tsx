import React, { useState } from 'react';
import { StudentRepoConfig, createPythonActivityZipBlob } from '../utils/zipGenerator';
import { uploadToGitHubViaApi, GitHubUploadProgress } from '../utils/githubApi';
import { CASE_STUDIES } from '../data/caseStudiesData';
import {
  Github,
  X,
  Download,
  Copy,
  Check,
  FolderGit2,
  Terminal,
  Key,
  ExternalLink,
  RefreshCw,
  Folder,
  FileCode,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentConfig: StudentRepoConfig;
  onUpdateStudentConfig: (config: StudentRepoConfig) => void;
}

export const GitHubHubModal: React.FC<Props> = ({
  isOpen,
  onClose,
  studentConfig,
  onUpdateStudentConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'cli' | 'api' | 'tree'>('cli');
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [isPackaging, setIsPackaging] = useState(false);
  
  // API upload state
  const [githubToken, setGithubToken] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<GitHubUploadProgress | null>(null);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsPackaging(true);
      const blob = await createPythonActivityZipBlob(studentConfig);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentConfig.repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPackaging(false);
    }
  };

  const cliCommands = `# 1. Extract the downloaded ${studentConfig.repoName}.zip into your workspace
cd ${studentConfig.repoName}

# 2. Initialize local Git repository
git init

# 3. Stage all 10 case study directories and deliverables
git add .

# 4. Commit all files
git commit -m "feat: complete all mandatory deliverables for 10 Python case studies"

# 5. Set default branch to main
git branch -M main

# 6. Add your GitHub remote repository
git remote add origin https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git

# 7. Push all materials to GitHub
git push -u origin main`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const handleStartApiUpload = async () => {
    if (!githubToken.trim()) {
      setUploadError('Please provide a GitHub Personal Access Token (PAT) with repo permissions.');
      return;
    }
    setUploadError(null);
    setUploadSuccessUrl(null);
    setIsUploading(true);

    try {
      const result = await uploadToGitHubViaApi(githubToken, studentConfig, (progress) => {
        setUploadProgress(progress);
      });
      setUploadSuccessUrl(result.repoUrl);
    } catch (err: any) {
      setUploadError(err.message || 'An unexpected error occurred during GitHub upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Upload to Student GitHub:</span>
                <span className="font-mono text-amber-400 font-semibold">{studentConfig.repoName}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated bundle generation & sync suite for all 10 mandatory case study deliverables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Configuration Strip */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Student Name</label>
            <input
              type="text"
              value={studentConfig.studentName}
              onChange={(e) => onUpdateStudentConfig({ ...studentConfig, studentName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-medium"
              placeholder="e.g. Nagna Boyina Satya Sri"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">GitHub Username</label>
            <input
              type="text"
              value={studentConfig.githubUsername}
              onChange={(e) => onUpdateStudentConfig({ ...studentConfig, githubUsername: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-amber-400 font-mono"
              placeholder="e.g. nagnaboyinasatyasri"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Repository (Mandatory)</label>
            <input
              type="text"
              value={studentConfig.repoName}
              disabled
              className="w-full bg-slate-900/50 border border-slate-800 rounded px-2.5 py-1 text-amber-400 text-xs font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cli')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cli'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Method 1: Download & Push CLI (Standard)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Method 2: Direct GitHub API Committer</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tree'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Repository Blueprint Tree</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Step 1: Download Ready-to-Push Repository Bundle
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generates a pre-configured .zip with all 10 case study folders, scripts, README, tests, SVGs & screenshots.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={isPackaging}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md text-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
                >
                  {isPackaging ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isPackaging ? 'Packaging...' : 'Download PythonActivity.zip'}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Step 2: Run in Terminal to Push to Your GitHub
                  </h4>
                  <button
                    onClick={handleCopyCommands}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCommands ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Commands!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto select-text leading-relaxed">
                  <pre>{cliCommands}</pre>
                </div>

                <p className="text-[11px] text-slate-500 mt-2">
                  Tip: A helper script named <code className="text-amber-400">push_to_github.sh</code> (and <code className="text-amber-400">push_to_github.bat</code> for Windows) is also included inside the zip to automate this in one click!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  Direct Browser-to-GitHub Cloud Upload
                </h4>
                <p className="text-slate-400 leading-relaxed mb-3">
                  Upload all 10 case study directories, SVGs, python files, and reports directly into your GitHub account using a GitHub Personal Access Token (classic token with <code className="text-amber-300">repo</code> scope).
                </p>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 text-xs font-mono focus:outline-hidden focus:border-amber-400"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Token is stored only in browser memory during upload.</span>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=PythonActivityUpload"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Create Token on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {uploadError && (
                  <div className="mt-3 p-3 bg-rose-950/60 border border-rose-800/80 rounded text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadProgress && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">{uploadProgress.step}</span>
                      <span className="text-amber-400">{uploadProgress.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-200"
                        style={{ width: `${uploadProgress.percent}%` }}
                      />
                    </div>
                    {uploadProgress.currentFile && (
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        Pushed: {uploadProgress.currentFile}
                      </div>
                    )}
                  </div>
                )}

                {uploadSuccessUrl && (
                  <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded text-emerald-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>All 10 case studies successfully uploaded to GitHub!</span>
                    </div>
                    <a
                      href={uploadSuccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center gap-1 shrink-0"
                    >
                      <span>View Live Repo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={handleStartApiUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading Files...</span>
                      </>
                    ) : (
                      <>
                        <Github className="w-3.5 h-3.5" />
                        <span>Upload Directly to GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tree' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>The generated bundle contains the standard structure:</span>
                <span className="font-mono text-slate-500">10 Folders · 54 Deliverable Files</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs max-h-[350px] overflow-y-auto space-y-2 select-text">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Folder className="w-4 h-4 fill-amber-400/20" />
                  <span>{studentConfig.repoName}/</span>
                </div>

                <div className="pl-5 space-y-1 text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>README.md (Master Deliverables Index & Rubric)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>push_to_github.sh (Automated Unix Push Script)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>push_to_github.bat (Automated Windows Push Script)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>requirements.txt</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>.gitignore</span>
                  </div>

                  {CASE_STUDIES.map((cs) => (
                    <div key={cs.id} className="pt-2">
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                        <Folder className="w-3.5 h-3.5 fill-indigo-400/20" />
                        <span>{cs.slug}/</span>
                      </div>
                      <div className="pl-5 space-y-0.5 text-slate-400 text-[11px]">
                        <div>├── README.md (All 10 deliverables detailed)</div>
                        <div>├── solution.py (Executable Python 3 source code)</div>
                        <div>├── test_cases.py (Automated unittest suite)</div>
                        <div>├── flowchart.svg (Vector SVG diagram)</div>
                        <div>├── output_screenshot.svg (Terminal execution graphic)</div>
                        <div>└── terminal_output.txt (Console log transcript)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for submission under repository: <strong className="text-white">{studentConfig.repoName}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
