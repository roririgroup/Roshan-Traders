const express = require('express')
const truckOwnerService = require('./truck_owner.service')
const { authenticateToken, authorizeRoles } = require('../../shared/middleware/auth.middleware')
const { serializeBigInt } = require('../../shared/lib/json')

// helper to send serialized responses
const sendResponse = (res, status, payload) => {
  res.status(status).json(serializeBigInt(payload))
}

const router = express.Router()

// All routes require authentication and truck_owner role
router.use(authenticateToken)
router.use(authorizeRoles(['Truck Owner']))

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await truckOwnerService.getDashboardStats(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: stats })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    sendResponse(res, 500, {
      success: false,
      message: error.message || 'Failed to fetch dashboard stats'
    })
  }
})

// Truck Management
router.get('/trucks', async (req, res) => {
  try {
    const trucks = await truckOwnerService.getTrucks(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: trucks })
  } catch (error) {
    sendResponse(res, 500, { success: false, message: error.message })
  }
})

router.post('/trucks', async (req, res) => {
  try {
    const truck = await truckOwnerService.createTruck(req.user.employeeId, req.body)
    sendResponse(res, 201, { success: true, data: truck, message: 'Truck created successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

router.put('/trucks/:id', async (req, res) => {
  try {
    const truck = await truckOwnerService.updateTruck(
      parseInt(req.params.id),
      req.user.employeeId,
      req.body
    )
    sendResponse(res, 200, { success: true, data: truck, message: 'Truck updated successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

router.delete('/trucks/:id', async (req, res) => {
  try {
    await truckOwnerService.deleteTruck(parseInt(req.params.id), req.user.employeeId)
    sendResponse(res, 200, { success: true, message: 'Truck deleted successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

// Driver Management
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await truckOwnerService.getDrivers(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: drivers })
  } catch (error) {
    sendResponse(res, 500, { success: false, message: error.message })
  }
})

router.post('/drivers', async (req, res) => {
  try {
    const driver = await truckOwnerService.createDriver(req.user.employeeId, req.body)
    sendResponse(res, 201, { success: true, data: driver, message: 'Driver created successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

// Order Management
router.get('/orders', async (req, res) => {
  try {
    const orders = await truckOwnerService.getAssignedOrders(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: orders })
  } catch (error) {
    sendResponse(res, 500, { success: false, message: error.message })
  }
})

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await truckOwnerService.updateOrderStatus(
      req.params.id,
      req.user.employeeId,
      req.body.status
    )
    sendResponse(res, 200, { success: true, data: order, message: 'Order status updated successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

// Profile Management
router.get('/profile', async (req, res) => {
  try {
    const profile = await truckOwnerService.getProfile(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: profile })
  } catch (error) {
    sendResponse(res, 500, { success: false, message: error.message })
  }
})

router.put('/profile', async (req, res) => {
  try {
    const profile = await truckOwnerService.updateProfile(req.user.employeeId, req.body)
    sendResponse(res, 200, { success: true, data: profile, message: 'Profile updated successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

module.exports = router