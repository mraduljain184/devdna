import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = express.Router();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const githubRedirectUri = `${frontendUrl}/api/auth/callback/github`;

// Step 1: Redirect user to GitHub login
router.get("/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&scope=read:user,user:email,repo`;
  res.redirect(githubAuthUrl);
});

const handleGitHubCallback = async (
  req: express.Request,
  res: express.Response,
) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.redirect(`${frontendUrl}/login?error=no_token`);
    }

    // Get user info from GitHub
    const githubUser = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Get user emails from GitHub
    const githubEmails = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = githubEmails.data.find(
      (e: any) => e.primary && e.verified,
    )?.email;

    const { id, login, name, avatar_url } = githubUser.data;

    // Create or update user in our database
    const user = await prisma.user.upsert({
      where: { githubId: String(id) },
      update: {
        name: name || login,
        avatarUrl: avatar_url,
        email: primaryEmail,
        githubConnection: {
          update: {
            accessToken,
            lastSyncedAt: new Date(),
          },
        },
      },
      create: {
        githubId: String(id),
        githubUsername: login,
        name: name || login,
        avatarUrl: avatar_url,
        email: primaryEmail,
        githubConnection: {
          create: {
            accessToken,
            lastSyncedAt: new Date(),
          },
        },
      },
    });

    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, githubUsername: user.githubUsername },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/success?token=${jwtToken}`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

// Step 2: GitHub redirects back here with a code
router.get("/github/callback", handleGitHubCallback);
router.get("/callback/github", handleGitHubCallback);

// Get current logged in user
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { dnaProfile: true, githubConnection: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
