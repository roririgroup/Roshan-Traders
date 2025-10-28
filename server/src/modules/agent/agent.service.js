const prisma = require('../../shared/lib/db.js');

const createAgent = async (payload) => {
  const { name, phone, email, location, status, referrals, image } = payload;

  // Validation
  if (!name || !phone) {
    throw new Error('Name and phone are required');
  }

  // Check if phone number already exists
  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber: phone },
  });
  if (existingUser) {
    throw new Error('Phone number already exists');
  }

  // Check if email already exists if provided
  if (email) {
    const existingProfile = await prisma.userProfile.findUnique({
      where: { email },
    });
    if (existingProfile) {
      throw new Error('Email already exists');
    }
  }

  // Create user first
  const user = await prisma.user.create({
    data: {
      phoneNumber: phone,
      userType: 'AGENT',
      isVerified: true, // Assume verified for now
    },
  });

  // Create user profile if name or email provided
  if (name || email) {
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        fullName: name,
        email: email,
        profileImageUrl: image,
      },
    });
  }

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      userId: user.id,
      agentCode: `AG${user.id.toString().padStart(4, '0')}`,
      commissionRate: 0.0,
      totalEarnings: 0.0,
      assignedArea: location,
      isApproved: status === 'active',
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return {
    id: agent.id.toString(),
    userId: agent.userId.toString(),
    name: agent?.user?.profile?.fullName || 'Unknown',
    phone: agent?.user?.phoneNumber || '',
    email: agent?.user?.profile?.email || '',
    location: agent?.assignedArea || '',
    status: agent?.isApproved ? 'active' : 'inactive',
    referrals: 0, // Default value since not in schema
    image: agent?.user?.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    createdAt: agent.createdAt,
    agentCode: agent.agentCode,
    commissionRate: agent.commissionRate,
    totalEarnings: agent.totalEarnings,
  };
};

const getAllAgents = async () => {
  const agents = await prisma.agent.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return agents.map(agent => ({
    id: agent.id.toString(),
    userId: agent.userId.toString(),
    name: agent?.user?.profile?.fullName || 'Unknown',
    phone: agent?.user?.phoneNumber || '',
    email: agent?.user?.profile?.email || '',
    location: agent?.assignedArea || '',
    status: agent?.isApproved ? 'active' : 'inactive',
    referrals: 0, // Default value since not in schema
    image: agent?.user?.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    createdAt: agent.createdAt,
    agentCode: agent.agentCode,
    commissionRate: agent.commissionRate,
    totalEarnings: agent.totalEarnings,
  }));
};

const getAgentById = async (id) => {
  const agent = await prisma.agent.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!agent) return null;

  // Transform the response to match frontend expectations
  return {
    id: agent.id.toString(),
    name: agent?.user?.profile?.fullName || 'Unknown',
    phone: agent?.user?.phoneNumber || '',
    email: agent?.user?.profile?.email || '',
    location: agent?.assignedArea || '',
    status: agent?.isApproved ? 'active' : 'inactive',
    referrals: 0, // Default value since not in schema
    image: agent?.user?.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    createdAt: agent.createdAt,
    agentCode: agent.agentCode,
    commissionRate: agent.commissionRate,
    totalEarnings: agent.totalEarnings,
  };
};

const updateAgent = async (id, payload) => {
  const { name, phone, email, location, status, referrals, image } = payload;

  const agent = await prisma.agent.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  // Update user
  await prisma.user.update({
    where: { id: agent.userId },
    data: {
      phoneNumber: phone,
    },
  });

  // Update profile
  await prisma.userProfile.upsert({
    where: { userId: agent.userId },
    update: {
      fullName: name,
      email: email,
      profileImageUrl: image,
    },
    create: {
      userId: agent.userId,
      fullName: name,
      email: email,
      profileImageUrl: image,
    },
  });

  // Update agent
  const updatedAgent = await prisma.agent.update({
    where: { id: parseInt(id) },
    data: {
      assignedArea: location,
      isApproved: status === 'active',
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Transform the response to match frontend expectations
  return {
    id: updatedAgent.id.toString(),
    name: updatedAgent?.user?.profile?.fullName || 'Unknown',
    phone: updatedAgent?.user?.phoneNumber || '',
    email: updatedAgent?.user?.profile?.email || '',
    location: updatedAgent?.assignedArea || '',
    status: updatedAgent?.isApproved ? 'active' : 'inactive',
    referrals: 0, // Default value since not in schema
    image: updatedAgent?.user?.profile?.profileImageUrl || 'https://via.placeholder.com/150',
    createdAt: updatedAgent.createdAt,
    agentCode: updatedAgent.agentCode,
    commissionRate: updatedAgent.commissionRate,
    totalEarnings: updatedAgent.totalEarnings,
  };
};

const deleteAgent = async (id) => {
  const agent = await prisma.agent.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  // Delete agent first
  await prisma.agent.delete({
    where: { id: parseInt(id) },
  });

  // Delete user (cascade will handle profile and other relations)
  await prisma.user.delete({
    where: { id: agent.userId },
  });
};

module.exports = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};
