import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Star, 
  GitFork, 
  Search, 
  Loader2,
  Code
} from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
  location: string | null;
}

interface PortfolioStudioProps {
  candidate: CandidateProfile;
  onNavigateToOutreach: () => void;
}

function getGitHubUsername(profileUrl: string): string {
  try {
    const url = new URL(profileUrl);
    if (url.hostname.toLowerCase() !== 'github.com' && url.hostname.toLowerCase() !== 'www.github.com') return '';
    return url.pathname.split('/').filter(Boolean)[0] || '';
  } catch {
    return '';
  }
}

export const PortfolioStudio: React.FC<PortfolioStudioProps> = ({
  candidate,
  onNavigateToOutreach,
}) => {
  const [githubUsername, setGithubUsername] = useState(() => getGitHubUsername(candidate.githubUrl));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const fetchGitHubData = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}/repos?sort=updated&per_page=6`),
      ]);

      if (!userRes.ok) {
        throw new Error(`GitHub user "${username}" not found (${userRes.status})`);
      }

      const userJson: GitHubUser = await userRes.json();
      const reposJson: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

      setUserData(userJson);
      setRepos(reposJson);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch GitHub profile';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitchProof = () => {
    if (!userData) return;
    const repoLines = repos
      .slice(0, 3)
      .map((r) => `• ${r.name} (${r.language || 'Code'}${r.stargazers_count ? ` · ⭐ ${r.stargazers_count}` : ''}): ${r.description || r.html_url}`)
      .join('\n');

    const proofText = `GitHub: ${userData.html_url}\nKey Projects:\n${repoLines}`;
    navigator.clipboard.writeText(proofText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Top Header & Search Bar */}
      <div className="bg-white dark:bg-[#121316] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-500" />
              <span>GitHub Proof Importer</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Fetch verified public profile and repository stats, then copy a verifiable proof block into your founder pitch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPitchProof}
              disabled={!userData}
              className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{copiedSummary ? 'Copied Proof!' : 'Copy Proof Block'}</span>
            </button>

            <button
              onClick={onNavigateToOutreach}
              className="px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Open Pitch Composer →
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchGitHubData(githubUsername);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="GitHub username (e.g. torvalds or your username)"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !githubUsername.trim()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-black text-xs font-mono font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xs"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Fetch profile</span>
          </button>
        </form>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 font-mono">
            {error}
          </div>
        )}
        {!userData && !error && !loading && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            Enter your GitHub handle to pull verified public repos and inject evidence into your outreach.
          </p>
        )}
      </div>

      {/* GitHub Profile Card */}
      {userData && (
        <div className="bg-white dark:bg-[#121316] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{userData.name || userData.login}</h3>
                  <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">@{userData.login}</p>
                {userData.bio && <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">{userData.bio}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <div>
                <span className="text-neutral-900 dark:text-white font-bold block text-sm">{userData.public_repos}</span>
                <span>Public Repos</span>
              </div>
              <div>
                <span className="text-neutral-900 dark:text-white font-bold block text-sm">{userData.followers}</span>
                <span>Followers</span>
              </div>
              {userData.location && (
                <div>
                  <span className="text-neutral-900 dark:text-white font-bold block text-sm">{userData.location}</span>
                  <span>Location</span>
                </div>
              )}
            </div>
          </div>

          {/* Repositories Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Recent Public Repositories ({repos.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-3.5 rounded-lg bg-neutral-50/70 dark:bg-black/40 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-2.5 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs font-bold text-neutral-900 dark:text-white hover:underline flex items-center gap-1.5"
                      >
                        <Code className="w-3 h-3 text-neutral-400" />
                        <span>{repo.name}</span>
                      </a>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-0.5">
                            <GitFork className="w-3 h-3" />
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-500 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                    <span>{repo.language || 'Plain Text'}</span>
                    <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioStudio;
