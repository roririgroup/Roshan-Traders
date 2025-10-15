const { Router } = require('express');
const { createAgent, getAllAgents, getAgentById, updateAgent, deleteAgent } = require('./agent.service.js');

const router = Router();

// GET /api/agents - Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
});

// GET /api/agents/:id - Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await getAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agent' });
  }
});

// POST /api/agents - Create new agent
router.post('/', async (req, res) => {
  try {
    const agent = await createAgent(req.body);
    res.status(201).json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(400).json({ message: error.message || 'Failed to create agent' });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', async (req, res) => {
  try {
    const agent = await updateAgent(req.params.id, req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update agent' });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', async (req, res) => {
  try {
    await deleteAgent(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete agent' });
  }
});

module.exports = router;
