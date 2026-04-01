import express from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const router = express.Router()

// Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Create a team
router.post('/create', authenticate, async (req: any, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Team name must be at least 2 characters' })
    }

    // Check if user already owns a team with this name
    const existing = await prisma.team.findFirst({
      where: { ownerId: req.userId, name: name.trim() },
    })

    if (existing) {
      return res.status(400).json({ message: 'You already have a team with this name' })
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        ownerId: req.userId,
        members: {
          create: {
            userId: req.userId,
            role: 'LEAD',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              include: { dnaProfile: true },
            },
          },
        },
        owner: true,
      },
    })

    res.json({ team })
  } catch (error) {
    console.error('Create team error:', error)
    res.status(500).json({ message: 'Failed to create team' })
  }
})

// Join a team via invite code
router.post('/join', authenticate, async (req: any, res) => {
  try {
    const { inviteCode } = req.body

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' })
    }

    const team = await prisma.team.findUnique({
      where: { inviteCode },
      include: { members: true },
    })

    if (!team) {
      return res.status(404).json({ message: 'Team not found. Check your invite code.' })
    }

    // Check if already a member
    const alreadyMember = team.members.find((m) => m.userId === req.userId)
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this team' })
    }

    // Add member
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: req.userId,
        role: 'MEMBER',
      },
    })

    const updatedTeam = await prisma.team.findUnique({
      where: { id: team.id },
      include: {
        members: {
          include: {
            user: {
              include: { dnaProfile: true },
            },
          },
        },
        owner: true,
      },
    })

    res.json({ team: updatedTeam })
  } catch (error) {
    console.error('Join team error:', error)
    res.status(500).json({ message: 'Failed to join team' })
  }
})

// Get all teams of current user
router.get('/my', authenticate, async (req: any, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: { userId: req.userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              include: { dnaProfile: true },
            },
          },
        },
        owner: true,
      },
    })

    res.json({ teams })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teams' })
  }
})

// Get a single team by ID
router.get('/:teamId', authenticate, async (req: any, res) => {
  try {
    const { teamId } = req.params

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              include: { dnaProfile: true },
            },
          },
        },
        owner: true,
      },
    })

    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    // Check if user is a member
    const isMember = team.members.find((m) => m.userId === req.userId)
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this team' })
    }

    // Calculate team DNA averages
    const membersWithDNA = team.members.filter((m) => m.user.dnaProfile)
    const teamAverages = membersWithDNA.length > 0 ? {
      clarityScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.clarityScore || 0), 0) / membersWithDNA.length,
      defensivenessScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.defensivenessScore || 0), 0) / membersWithDNA.length,
      velocityScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.velocityScore || 0), 0) / membersWithDNA.length,
      architectureScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.architectureScore || 0), 0) / membersWithDNA.length,
      reliabilityScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.reliabilityScore || 0), 0) / membersWithDNA.length,
      consistencyScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.consistencyScore || 0), 0) / membersWithDNA.length,
      collaborationScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.collaborationScore || 0), 0) / membersWithDNA.length,
      growthScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.growthScore || 0), 0) / membersWithDNA.length,
      overallScore: membersWithDNA.reduce((sum, m) => sum + (m.user.dnaProfile?.overallScore || 0), 0) / membersWithDNA.length,
    } : null

    res.json({ team, teamAverages })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team' })
  }
})

// Leave a team
router.post('/:teamId/leave', authenticate, async (req: any, res) => {
  try {
    const { teamId } = req.params

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    if (team.ownerId === req.userId) {
      return res.status(400).json({ message: 'Team owner cannot leave. Delete the team instead.' })
    }

    await prisma.teamMember.deleteMany({
      where: { teamId, userId: req.userId },
    })

    res.json({ message: 'Left team successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave team' })
  }
})

export default router