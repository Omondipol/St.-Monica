/**
 * GitHub REST API Sync & Deployment Engine
 * Allows committing site catalogs & content directly to GitHub from any device (phone, laptop)
 * via the GitHub Contents API without needing git installed.
 */

import { fetchJsonFromSupabaseStorage, uploadJsonToSupabaseStorage } from './supabaseChoirData';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  autoCommit: boolean;
  lastSyncTime?: string;
  lastCommitSha?: string;
  lastCommitMessage?: string;
  workflowName?: string;
}

const GITHUB_CONFIG_STORAGE_KEY = 'st_monica_github_config';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  owner: '',
  repo: '',
  branch: 'main',
  token: '',
  autoCommit: true,
  workflowName: 'deploy.yml'
};

/**
 * Load GitHub configuration from localStorage with Supabase storage fallback
 */
export function getStoredGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GITHUB_CONFIG, ...parsed };
    }
  } catch (_) {}
  return DEFAULT_GITHUB_CONFIG;
}

/**
 * Asynchronously fetch shared GitHub config from Supabase Storage (so admin credentials sync across devices)
 */
export async function fetchSharedGitHubConfig(): Promise<GitHubConfig | null> {
  try {
    const remote = await fetchJsonFromSupabaseStorage<GitHubConfig>('github_config.json');
    if (remote && remote.owner && remote.repo && remote.token) {
      // Merge with local config
      const local = getStoredGitHubConfig();
      const merged = { ...local, ...remote };
      try {
        localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(merged));
      } catch (_) {}
      return merged;
    }
  } catch (_) {}
  return null;
}

/**
 * Save GitHub configuration to localStorage and optionally to Supabase Storage for cross-device admin sharing
 */
export async function saveGitHubConfig(
  config: GitHubConfig, 
  syncToCloud = true
): Promise<void> {
  try {
    localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (_) {}

  if (syncToCloud && config.token && config.owner && config.repo) {
    try {
      await uploadJsonToSupabaseStorage('github_config.json', config);
    } catch (_) {}
  }
}

/**
 * Test GitHub connection and token permissions
 */
export async function testGitHubConnection(config: GitHubConfig): Promise<{
  ok: boolean;
  message: string;
  defaultBranch?: string;
  repoFullName?: string;
}> {
  if (!config.owner.trim() || !config.repo.trim()) {
    return { ok: false, message: 'Please specify GitHub Owner and Repository name.' };
  }
  if (!config.token.trim()) {
    return { ok: false, message: 'GitHub Personal Access Token is required.' };
  }

  try {
    const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${config.token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 401) {
        return { ok: false, message: 'Invalid GitHub Personal Access Token (Unauthorized).' };
      }
      if (res.status === 404) {
        return { ok: false, message: `Repository "${config.owner}/${config.repo}" was not found or token lacks access.` };
      }
      return { ok: false, message: errJson.message || `GitHub error: HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      ok: true,
      message: `Connected successfully to ${data.full_name}!`,
      defaultBranch: data.default_branch || 'main',
      repoFullName: data.full_name
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Network error connecting to GitHub API.' };
  }
}

/**
 * Commit a single file to GitHub via the Contents API
 */
export async function commitFileToGitHub(
  config: GitHubConfig,
  filePath: string,
  contentStr: string,
  commitMessage: string
): Promise<{ ok: boolean; commitSha?: string; message: string }> {
  if (!config.token || !config.owner || !config.repo) {
    return { ok: false, message: 'GitHub configuration incomplete (missing token, owner, or repo).' };
  }

  const cleanOwner = config.owner.trim();
  const cleanRepo = config.repo.trim();
  const branch = config.branch?.trim() || 'main';
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const apiUrl = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`;

  try {
    // 1. Check if the file already exists to get its SHA
    let existingSha: string | undefined = undefined;
    try {
      const checkRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${config.token.trim()}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (_) {}

    // 2. Base64 encode file content safely with UTF-8 support
    const utf8Bytes = new TextEncoder().encode(contentStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64Content = btoa(binary);

    // 3. Put / commit the file
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${config.token.trim()}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch: branch,
        ...(existingSha ? { sha: existingSha } : {})
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      return {
        ok: false,
        message: errData.message || `Failed to commit file to GitHub (HTTP ${putRes.status}).`
      };
    }

    const putData = await putRes.json();
    const newCommitSha = putData?.commit?.sha || putData?.content?.sha;

    return {
      ok: true,
      commitSha: newCommitSha,
      message: `Committed successfully (${newCommitSha?.slice(0, 7) || 'ok'}).`
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Error executing GitHub commit request.'
    };
  }
}

/**
 * Commit the full choir site state to GitHub in public/data/site_content.json
 * This triggers the GitHub Actions deploy workflow automatically.
 */
export async function commitChoirStateToGitHub(
  config: GitHubConfig,
  fullState: any,
  customMessage?: string
): Promise<{ ok: boolean; commitSha?: string; message: string }> {
  const dateStr = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  const commitMessage = customMessage || 
    `Admin Update: Sync choir catalogs, mass & rehearsal schedule (${dateStr})`;

  const jsonString = JSON.stringify(fullState, null, 2);

  // Commit to public/data/site_content.json so Vite includes it in dist/
  const res = await commitFileToGitHub(
    config,
    'public/data/site_content.json',
    jsonString,
    commitMessage
  );

  if (res.ok && res.commitSha) {
    // Update config with last commit info
    const updatedConfig: GitHubConfig = {
      ...config,
      lastSyncTime: new Date().toISOString(),
      lastCommitSha: res.commitSha,
      lastCommitMessage: commitMessage
    };
    saveGitHubConfig(updatedConfig, true);
  }

  return res;
}

/**
 * Trigger GitHub Actions workflow dispatch directly (deploy.yml)
 */
export async function triggerGitHubWorkflowDispatch(
  config: GitHubConfig
): Promise<{ ok: boolean; message: string }> {
  if (!config.token || !config.owner || !config.repo) {
    return { ok: false, message: 'GitHub configuration incomplete.' };
  }

  const cleanOwner = config.owner.trim();
  const cleanRepo = config.repo.trim();
  const branch = config.branch?.trim() || 'main';
  const workflowName = config.workflowName || 'deploy.yml';

  try {
    const url = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/actions/workflows/${workflowName}/dispatches`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${config.token.trim()}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        ref: branch
      })
    });

    if (res.status === 204) {
      return { ok: true, message: `GitHub Actions deployment triggered successfully on branch "${branch}".` };
    }

    const err = await res.json().catch(() => ({}));
    return { ok: false, message: err.message || `Could not trigger workflow (HTTP ${res.status}).` };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Workflow dispatch failed.' };
  }
}
