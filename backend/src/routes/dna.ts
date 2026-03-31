import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { GitHubService } from "../services/github.service";
import { DNAAnalyzer } from "../services/dna.service";

const router = express.Router();

// Middleware to verify JWT token
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all repos of logged in user
router.get("/repos", authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { githubConnection: true },
    });

    if (!user || !user.githubConnection) {
      return res.status(404).json({ message: "GitHub connection not found" });
    }

    const github = new GitHubService(user.githubConnection.accessToken);
    const repos = await github.getUserRepos();

    // Save repos to database
    for (const repo of repos) {
      await prisma.repository.upsert({
        where: {
          userId_githubRepoId: {
            userId: user.id,
            githubRepoId: String(repo.id),
          },
        },
        update: {
          name: repo.name,
          fullName: repo.full_name,
          language: repo.language,
          isPrivate: repo.private,
          starCount: repo.stargazers_count,
          commitCount: repo.size,
        },
        create: {
          userId: user.id,
          githubRepoId: String(repo.id),
          name: repo.name,
          fullName: repo.full_name,
          language: repo.language,
          isPrivate: repo.private,
          starCount: repo.stargazers_count,
          commitCount: repo.size,
        },
      });
    }

    res.json({ repos, total: repos.length });
  } catch (error) {
    console.error("Error fetching repos:", error);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
});

// Analyze DNA
router.post("/analyze", authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { githubConnection: true },
    });

    if (!user || !user.githubConnection) {
      return res.status(404).json({ message: "GitHub connection not found" });
    }

    const github = new GitHubService(user.githubConnection.accessToken);
    const analyzer = new DNAAnalyzer();

    // Fetch all repos
    const repos = await github.getUserRepos();

    // Fetch commits from top 5 most recently updated repos
    const topRepos = repos.slice(0, 5);
    let allCommits: any[] = [];
    let allPullRequests: any[] = [];

    for (const repo of topRepos) {
      const [commits, prs] = await Promise.all([
        github.getRepoCommits(repo.owner.login, repo.name),
        github.getRepoPullRequests(repo.owner.login, repo.name),
      ]);
      allCommits = [...allCommits, ...commits];
      allPullRequests = [...allPullRequests, ...prs];
    }

    // Calculate DNA scores
    const scores = await analyzer.calculateDNA(
      repos,
      allCommits,
      allPullRequests,
    );

    // Save to database
    const dnaProfile = await prisma.dnaProfile.upsert({
      where: { userId: user.id },
      update: {
        ...scores,
        analyzedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...scores,
        analyzedAt: new Date(),
      },
    });

    // Save snapshot
    await prisma.dnaSnapshot.create({
      data: {
        userId: user.id,
        snapshotDate: new Date(),
        ...scores,
      },
    });

    // Update github connection
    await prisma.githubConnection.update({
      where: { userId: user.id },
      data: {
        reposAnalyzed: repos.length,
        lastSyncedAt: new Date(),
      },
    });

    res.json({ dnaProfile, scores });
  } catch (error) {
    console.error("DNA analysis error:", error);
    res.status(500).json({ message: "DNA analysis failed" });
  }
});

// Get DNA profile
router.get("/profile", authenticate, async (req: any, res) => {
  try {
    const dnaProfile = await prisma.dnaProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!dnaProfile) {
      return res.status(404).json({ message: "DNA profile not found" });
    }

    res.json({ dnaProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch DNA profile" });
  }
});

// Get DNA snapshots (evolution timeline)
router.get("/snapshots", authenticate, async (req: any, res) => {
  try {
    const snapshots = await prisma.dnaSnapshot.findMany({
      where: { userId: req.userId },
      orderBy: { snapshotDate: "asc" },
    });

    res.json({ snapshots });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch snapshots" });
  }
});

export default router;
