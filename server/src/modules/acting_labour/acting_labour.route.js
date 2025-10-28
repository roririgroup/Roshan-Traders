const express = require('express');
const router = express.Router();
const actingLabourService = require('./acting_labour.service');
const { serializeBigInt } = require('../../shared/lib/json');

// Helper function to send serialized response
const sendResponse = (res, status, data) => {
  res.status(status).json(serializeBigInt(data));
};

// Get all acting labours with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, status, assignedToType, search, includeEmployees } = req.query;
    /** @type {{type?:string,status?:string,assignedToType?:string,search?:string,includeEmployees?:boolean}} */
    const filters = {};

    /**
     * @param {string | import('qs').ParsedQs | string[] | import('qs').ParsedQs[] | undefined} v
     * @returns {string|undefined}
     */
    const toStringValue = (v) => {
      if (v === undefined || v === null) return undefined;
      if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : String(v[0]);
      if (typeof v === 'string') return v;
      return String(v);
    }; 
    

    if (type) filters.type = toStringValue(type);
    if (status) filters.status = toStringValue(status);
    if (assignedToType) filters.assignedToType = toStringValue(assignedToType);
    if (search) filters.search = toStringValue(search);
    // Parse includeEmployees as boolean
    filters.includeEmployees = includeEmployees === 'true' || includeEmployees === '1';

    const labours = await actingLabourService.getAllActingLabours(filters);
    sendResponse(res, 200, labours);
  } catch (error) {
    console.error('Error in GET /acting-labours:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendResponse(res, 500, { error: errorMessage });
  }
});

// Get acting labour by ID
router.get('/:id', async (req, res) => {
  try {
    const labour = await actingLabourService.getActingLabourById(req.params.id);
    res.json(labour);
  } catch (error) {
    console.error('Error in GET /acting-labours/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Acting labour not found') {
      res.status(404).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
});

// Create new acting labour
router.post('/', async (req, res) => {
  try {
    // Log incoming body for debugging and ensure required fields are present
    console.log('POST /api/acting-labours body:', req.body);

    const body = req.body || {};
    if (!body.name || !body.type || !body.phone || !body.location) {
      return sendResponse(res, 400, { error: 'Missing required fields: name, type, phone, location' });
    }

    const labour = await actingLabourService.createActingLabour(body);
    sendResponse(res, 201, labour);
  } catch (error) {
    console.error('Error in POST /acting-labours:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Missing required fields')) {
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
});

// Update acting labour
router.put('/:id', async (req, res) => {
  try {
    const labour = await actingLabourService.updateActingLabour(req.params.id, req.body);
    sendResponse(res, 200, labour);
  } catch (error) {
    console.error('Error in PUT /acting-labours/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const status = errorMessage === 'Acting labour not found' ? 404 : 500;
    sendResponse(res, status, { error: errorMessage });
  }
});

// Delete acting labour
router.delete('/:id', async (req, res) => {
  try {
    const result = await actingLabourService.deleteActingLabour(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error in DELETE /acting-labours/:id:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Acting labour not found') {
      res.status(404).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
});

// Assign labour to manufacturer or truck owner
router.post('/:id/assign', async (req, res) => {
  try {
    const { assignedToId, assignedToType } = req.body;
    const labour = await actingLabourService.assignLabour(req.params.id, { assignedToId, assignedToType });
    res.json(labour);
  } catch (error) {
    console.error('Error in POST /acting-labours/:id/assign:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('not found') || errorMessage.includes('Invalid') || errorMessage.includes('Missing')) {
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
});

// Unassign labour
router.post('/:id/unassign', async (req, res) => {
  try {
    const labour = await actingLabourService.unassignLabour(req.params.id);
    res.json(labour);
  } catch (error) {
    console.error('Error in POST /acting-labours/:id/unassign:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

// Get assigned labours for a target (manufacturer or truck owner)
router.get('/assigned/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const labours = await actingLabourService.getAssignedLabours(targetId, targetType);
    res.json(labours);
  } catch (error) {
    console.error('Error in GET /acting-labours/assigned/:targetType/:targetId:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

// Get available labours
router.get('/available/:type?', async (req, res) => {
  try {
    const type = req.params.type || undefined;
    const labours = await actingLabourService.getAvailableLabours(type);
    res.json(labours);
  } catch (error) {
    console.error('Error in GET /acting-labours/available:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
