import React, { useState, useEffect } from 'react';
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

export const PortfolioStudio: React.FC<PortfolioStudioProps> = ({
  candidate,
  onNavigateToOutreach,
}) => {
  const [githubUsername, setGithubUsername] = useState(() => 
    candidate.githubUrl ? candidate.githubUrl.replace('https://github.com/', '').replace('/', '') : 'shadcn'
  );
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

  useEffect(() => {
    fetchGitHubData(githubUsername);
  }, []);

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
    <div className="space-y-6 text-[#EDEDED] font-sans">
      {/* Top Header & Search Bar */}
      <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F1F1F] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-white" />
              <span>Real GitHub Proof-of-Work Fetcher</span>
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Enter any real GitHub username to pull live repositories, stars, and languages to embed in founder pitches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPitchProof}
              disabled={!userData}
              className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1F1F1F] text-xs font-mono rounded-lg border border-[#262626] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#888888]" />}
              <span>{copiedSummary ? 'Copied Proof!' : 'Copy Proof Block'}</span>
            </button>

            <button
              onClick={onNavigateToOutreach}
              className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-lg transition-colors"
            >
              Attach to Pitch →
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
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="e.g. shadcn, torvalds, or your username"
              className="w-full pl-9 pr-3 py-2 bg-[#000000] border border-[#262626] rounded-lg text-xs font-mono text-white placeholder-[#555555] focus:outline-none focus:border-[#444444]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-xs font-mono text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Fetch Real Data</span>
          </button>
        </form>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 font-mono">
            {error}
          </div>
        )}
      </div>

      {/* GitHub Profile Card */}
      {userData && (
        <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#1F1F1F] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-12 h-12 rounded-full border border-[#262626]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{userData.name || userData.login}</h3>
                  <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#666666] hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-[#888888] font-mono">@{userData.login}</p>
                {userData.bio && <p className="text-xs text-[#AAAAAA] mt-1">{userData.bio}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
              <div>
                <span className="text-white font-bold block text-sm">{userData.public_repos}</span>
                <span>Public Repos</span>
              </div>
              <div>
                <span className="text-white font-bold block text-sm">{userData.followers}</span>
                <span>Followers</span>
              </div>
              {userData.location && (
                <div>
                  <span className="text-white font-bold block text-sm">{userData.location}</span>
                  <span>Location</span>
                </div>
              )}
            </div>
          </div>

          {/* Repositories Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-[#888888] uppercase tracking-wider">
              Recent Public Repositories ({repos.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-3.5 rounded-lg bg-[#000000] border border-[#1F1F1F] hover:border-[#333333] transition-colors flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs font-bold text-white hover:underline flex items-center gap-1.5"
                      >
                        <Code className="w-3 h-3 text-[#888888]" />
                        <span>{repo.name}</span>
                      </a>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888]">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
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

                    <p className="text-xs text-[#888888] line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#666666] pt-2 border-t border-[#141414]">
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