import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

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

// Calculate percentile rank
function calculatePercentile(scores: number[], userScore: number): number {
  const below = scores.filter((s) => s < userScore).length;
  return Math.round((below / scores.length) * 100);
}

// Get benchmark data
router.get("/", authenticate, async (req: any, res) => {
  try {
    // Get current user DNA profile
    const userProfile = await prisma.dnaProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "Please analyze your DNA first before benchmarking",
      });
    }

    // Get ALL DNA profiles (anonymized)
    const allProfiles = await prisma.dnaProfile.findMany({
      select: {
        clarityScore: true,
        defensivenessScore: true,
        velocityScore: true,
        architectureScore: true,
        reliabilityScore: true,
        consistencyScore: true,
        collaborationScore: true,
        growthScore: true,
        overallScore: true,
        personalityType: true,
      },
    });

    if (allProfiles.length < 1) {
      return res
        .status(404)
        .json({ message: "Not enough data for benchmarking" });
    }

    // Calculate percentiles for each dimension
    const dimensions = [
      "clarityScore",
      "defensivenessScore",
      "velocityScore",
      "architectureScore",
      "reliabilityScore",
      "consistencyScore",
      "collaborationScore",
      "growthScore",
      "overallScore",
    ] as const;

    const percentiles: Record<string, number> = {};

    dimensions.forEach((dim) => {
      const allScores = allProfiles.map((p) => p[dim]);
      percentiles[dim] = calculatePercentile(allScores, userProfile[dim]);
    });

    // Calculate personality type distribution
    const personalityDistribution: Record<string, number> = {};
    allProfiles.forEach((p) => {
      const type = p.personalityType || "The Generalist";
      personalityDistribution[type] = (personalityDistribution[type] || 0) + 1;
    });

    // Calculate averages
    const averages: Record<string, number> = {};
    dimensions.forEach((dim) => {
      const allScores = allProfiles.map((p) => p[dim]);
      averages[dim] = Math.round(
        allScores.reduce((a, b) => a + b, 0) / allScores.length,
      );
    });

    // Find similar developers (within 10 points of overall score)
    const similarDevs = allProfiles.filter(
      (p) => Math.abs(p.overallScore - userProfile.overallScore) <= 10,
    ).length;

    res.json({
      totalDevelopers: allProfiles.length,
      percentiles,
      averages,
      personalityDistribution,
      similarDevs,
      userProfile,
    });
  } catch (error) {
    console.error("Benchmark error:", error);
    res.status(500).json({ message: "Failed to fetch benchmark data" });
  }
});

export default router;
