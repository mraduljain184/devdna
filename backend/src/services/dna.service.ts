export interface DNAScores {
  clarityScore: number;
  defensivenessScore: number;
  velocityScore: number;
  architectureScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  collaborationScore: number;
  growthScore: number;
  overallScore: number;
  personalityType: string;
}

export class DNAAnalyzer {
  // Analyze commit messages quality
  analyzeCommitMessages(commits: any[]): number {
    if (commits.length === 0) return 0;

    let score = 0;
    const goodPatterns = [
      /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?: .{10,}/i,
      /^(add|update|remove|fix|improve|refactor).{10,}/i,
    ];

    commits.forEach((commit) => {
      const message = commit.commit?.message || "";
      const firstLine = message.split("\n")[0];

      // Good length (10-72 chars)
      if (firstLine.length >= 10 && firstLine.length <= 72) score += 2;

      // Follows conventional commits
      if (goodPatterns.some((p) => p.test(firstLine))) score += 3;

      // Has description (multi-line)
      if (message.split("\n").length > 1) score += 1;
    });

    return Math.min(100, (score / (commits.length * 6)) * 100);
  }

  // Analyze commit frequency (velocity)
  analyzeVelocity(commits: any[]): number {
    if (commits.length === 0) return 0;

    // Get commits per week
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
    const recentCommits = commits.filter((c) => {
      const date = new Date(c.commit?.author?.date || 0).getTime();
      return date > oneYearAgo;
    });

    const commitsPerWeek = recentCommits.length / 52;

    // Score based on commits per week
    if (commitsPerWeek >= 10) return 100;
    if (commitsPerWeek >= 7) return 90;
    if (commitsPerWeek >= 5) return 80;
    if (commitsPerWeek >= 3) return 70;
    if (commitsPerWeek >= 2) return 60;
    if (commitsPerWeek >= 1) return 50;
    if (commitsPerWeek >= 0.5) return 35;
    return 20;
  }

  // Analyze language consistency
  analyzeConsistency(repos: any[]): number {
    if (repos.length === 0) return 0;

    // Check how consistent language usage is
    const languages = repos.map((r) => r.language).filter(Boolean);

    if (languages.length === 0) return 50;

    const languageCounts: Record<string, number> = {};
    languages.forEach((lang) => {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });

    const topLanguageCount = Math.max(...Object.values(languageCounts));
    const consistencyRatio = topLanguageCount / languages.length;

    // Check repo naming consistency
    const repoNames = repos.map((r) => r.name);
    const kebabCase = repoNames.filter((n) => /^[a-z0-9-]+$/.test(n)).length;
    const namingScore = (kebabCase / repoNames.length) * 100;

    return Math.round((consistencyRatio * 100 + namingScore) / 2);
  }

  // Analyze architecture based on repo structure
  analyzeArchitecture(repos: any[]): number {
    if (repos.length === 0) return 0;

    let score = 50; // base score

    // Has multiple repos (modular thinking)
    if (repos.length >= 5) score += 10;
    if (repos.length >= 10) score += 10;

    // Uses different languages (versatile)
    const uniqueLangs = new Set(repos.map((r) => r.language).filter(Boolean));
    if (uniqueLangs.size >= 3) score += 10;
    if (uniqueLangs.size >= 5) score += 10;

    // Has description on repos (documentation mindset)
    const withDesc = repos.filter((r) => r.description).length;
    const descRatio = withDesc / repos.length;
    score += descRatio * 20;

    return Math.min(100, Math.round(score));
  }

  // Analyze reliability (stars, forks = trusted code)
  analyzeReliability(repos: any[]): number {
    if (repos.length === 0) return 0;

    const totalStars = repos.reduce(
      (sum, r) => sum + (r.stargazers_count || 0),
      0,
    );
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const hasTopics = repos.filter((r) => r.topics?.length > 0).length;

    let score = 40; // base

    // Stars indicate reliable code
    if (totalStars >= 100) score += 30;
    else if (totalStars >= 50) score += 20;
    else if (totalStars >= 10) score += 10;
    else if (totalStars >= 1) score += 5;

    // Forks indicate reusable code
    if (totalForks >= 20) score += 20;
    else if (totalForks >= 5) score += 10;
    else if (totalForks >= 1) score += 5;

    // Topics = organized thinking
    score += Math.min(10, (hasTopics / repos.length) * 10);

    return Math.min(100, Math.round(score));
  }

  // Analyze collaboration
  analyzeCollaboration(repos: any[], pullRequests: any[]): number {
    let score = 30; // base

    // Has public repos
    const publicRepos = repos.filter((r) => !r.private).length;
    if (publicRepos >= 5) score += 20;
    else if (publicRepos >= 1) score += 10;

    // Has forks of others repos
    const forkedRepos = repos.filter((r) => r.fork).length;
    if (forkedRepos >= 3) score += 15;
    else if (forkedRepos >= 1) score += 8;

    // Pull requests
    if (pullRequests.length >= 20) score += 35;
    else if (pullRequests.length >= 10) score += 25;
    else if (pullRequests.length >= 5) score += 15;
    else if (pullRequests.length >= 1) score += 8;

    return Math.min(100, Math.round(score));
  }

  // Analyze clarity (readme, descriptions, topics)
  analyzeClarity(repos: any[]): number {
    if (repos.length === 0) return 0;

    let score = 0;
    let maxScore = 0;

    repos.forEach((repo) => {
      maxScore += 30;

      // Has description
      if (repo.description) score += 10;

      // Has topics/tags
      if (repo.topics?.length > 0) score += 10;

      // Has homepage/website
      if (repo.homepage) score += 5;

      // Name is readable
      if (/^[a-z0-9-]+$/.test(repo.name)) score += 5;
    });

    return Math.round((score / maxScore) * 100);
  }

  // Analyze growth (recent activity vs old activity)
  analyzeGrowth(commits: any[]): number {
    if (commits.length === 0) return 0;

    const now = Date.now();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    const recentCommits = commits.filter((c) => {
      const date = new Date(c.commit?.author?.date || 0).getTime();
      return date > sixMonthsAgo;
    }).length;

    const olderCommits = commits.filter((c) => {
      const date = new Date(c.commit?.author?.date || 0).getTime();
      return date > oneYearAgo && date <= sixMonthsAgo;
    }).length;

    if (olderCommits === 0) return recentCommits > 0 ? 75 : 30;

    const growthRatio = recentCommits / olderCommits;

    if (growthRatio >= 2) return 100;
    if (growthRatio >= 1.5) return 90;
    if (growthRatio >= 1) return 75;
    if (growthRatio >= 0.7) return 60;
    if (growthRatio >= 0.5) return 45;
    return 30;
  }

  // Determine personality type based on scores
  determinePersonalityType(scores: Partial<DNAScores>): string {
    const {
      clarityScore = 0,
      velocityScore = 0,
      reliabilityScore = 0,
      architectureScore = 0,
      collaborationScore = 0,
      consistencyScore = 0,
    } = scores;

    // The Architect: high architecture + clarity
    if (architectureScore >= 75 && clarityScore >= 75) {
      return "The Architect";
    }

    // The Sprinter: high velocity
    if (velocityScore >= 80) {
      return "The Sprinter";
    }

    // The Craftsman: high reliability + consistency
    if (reliabilityScore >= 70 && consistencyScore >= 70) {
      return "The Craftsman";
    }

    // The Collaborator: high collaboration
    if (collaborationScore >= 75) {
      return "The Collaborator";
    }

    // The Pragmatist: balanced scores
    const avg =
      (clarityScore + velocityScore + reliabilityScore + architectureScore) / 4;
    if (avg >= 60) {
      return "The Pragmatist";
    }

    // The Explorer: low consistency (tries many things)
    if (consistencyScore < 40) {
      return "The Explorer";
    }

    return "The Generalist";
  }

  // Main function - calculate all DNA scores
  async calculateDNA(
    repos: any[],
    commits: any[],
    pullRequests: any[],
  ): Promise<DNAScores> {
    const clarityScore = this.analyzeClarity(repos);
    const defensivenessScore = this.analyzeCommitMessages(commits);
    const velocityScore = this.analyzeVelocity(commits);
    const architectureScore = this.analyzeArchitecture(repos);
    const reliabilityScore = this.analyzeReliability(repos);
    const consistencyScore = this.analyzeConsistency(repos);
    const collaborationScore = this.analyzeCollaboration(repos, pullRequests);
    const growthScore = this.analyzeGrowth(commits);

    const overallScore = Math.round(
      (clarityScore +
        defensivenessScore +
        velocityScore +
        architectureScore +
        reliabilityScore +
        consistencyScore +
        collaborationScore +
        growthScore) /
        8,
    );

    const personalityType = this.determinePersonalityType({
      clarityScore,
      velocityScore,
      reliabilityScore,
      architectureScore,
      collaborationScore,
      consistencyScore,
    });

    return {
      clarityScore,
      defensivenessScore,
      velocityScore,
      architectureScore,
      reliabilityScore,
      consistencyScore,
      collaborationScore,
      growthScore,
      overallScore,
      personalityType,
    };
  }
}
