import axios from "axios";

const GITHUB_API = "https://api.github.com";

export class GitHubService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  // Fetch all repos of the user
  async getUserRepos() {
    const repos = [];
    let page = 1;

    while (true) {
      const response = await axios.get(`${GITHUB_API}/user/repos`, {
        headers: this.headers,
        params: {
          per_page: 100,
          page,
          sort: "updated",
          affiliation: "owner",
        },
      });

      if (response.data.length === 0) break;
      repos.push(...response.data);
      page++;

      if (response.data.length < 100) break;
    }

    return repos;
  }

  // Fetch commits for a repo
  async getRepoCommits(owner: string, repo: string, since?: string) {
    try {
      const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/commits`,
        {
          headers: this.headers,
          params: {
            per_page: 100,
            since:
              since ||
              new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      );
      return response.data;
    } catch {
      return [];
    }
  }

  // Fetch languages used in a repo
  async getRepoLanguages(owner: string, repo: string) {
    try {
      const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/languages`,
        { headers: this.headers },
      );
      return response.data;
    } catch {
      return {};
    }
  }

  // Fetch repo contents (file tree)
  async getRepoContents(owner: string, repo: string, path = "") {
    try {
      const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
        { headers: this.headers },
      );
      return response.data;
    } catch {
      return [];
    }
  }

  // Fetch a single file content
  async getFileContent(owner: string, repo: string, path: string) {
    try {
      const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
        { headers: this.headers },
      );
      if (response.data.encoding === "base64") {
        return Buffer.from(response.data.content, "base64").toString("utf-8");
      }
      return null;
    } catch {
      return null;
    }
  }

  // Fetch pull requests
  async getRepoPullRequests(owner: string, repo: string) {
    try {
      const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/pulls`,
        {
          headers: this.headers,
          params: { state: "all", per_page: 100 },
        },
      );
      return response.data;
    } catch {
      return [];
    }
  }

  // Fetch repo stats
  async getRepoStats(owner: string, repo: string) {
    try {
      const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
        headers: this.headers,
      });
      return response.data;
    } catch {
      return null;
    }
  }
}
