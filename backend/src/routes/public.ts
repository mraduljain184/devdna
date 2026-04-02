import express from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

// Get public profile by github username
router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { githubUsername: username },
      include: {
        dnaProfile: true,
        dnaSnapshots: {
          orderBy: { snapshotDate: "asc" },
          take: 10,
        },
        repositories: {
          where: { isIncluded: true },
          take: 6,
          orderBy: { starCount: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Developer not found" });
    }

    // Check visibility
    if (user.profileVisibility === "PRIVATE") {
      return res.status(403).json({ message: "This profile is private" });
    }

    // Return anonymized if anonymous
    if (user.profileVisibility === "ANONYMOUS") {
      return res.json({
        user: {
          name: "Anonymous Developer",
          githubUsername: "anonymous",
          avatarUrl: null,
          bio: null,
          dnaProfile: user.dnaProfile,
        },
      });
    }

    // Return full public profile
    res.json({
      user: {
        id: user.id,
        name: user.name,
        githubUsername: user.githubUsername,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        dnaProfile: user.dnaProfile,
        dnaSnapshots: user.dnaSnapshots,
        repositories: user.repositories,
      },
    });
  } catch (error) {
    console.error("Public profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Get leaderboard — top developers by overall score
router.get("/leaderboard", async (req, res) => {
  try {
    const profiles = await prisma.dnaProfile.findMany({
      where: {
        user: {
          profileVisibility: "PUBLIC",
        },
        overallScore: { gt: 0 },
      },
      include: {
        user: {
          select: {
            name: true,
            githubUsername: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { overallScore: "desc" },
      take: 20,
    });

    res.json({ leaderboard: profiles });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

export default router;
