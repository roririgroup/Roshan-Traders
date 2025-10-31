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
    sendResponse(res, 500, { success: false, message: error.message })
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

router.put('/drivers/:id', async (req, res) => {
  try {
    const driver = await truckOwnerService.updateDriver(
      parseInt(req.params.id),
      req.user.employeeId,
      req.body
    )
    sendResponse(res, 200, { success: true, data: driver, message: 'Driver updated successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

router.delete('/drivers/:id', async (req, res) => {
  try {
    await truckOwnerService.deleteDriver(parseInt(req.params.id), req.user.employeeId)
    sendResponse(res, 200, { success: true, message: 'Driver deleted successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

router.post('/drivers/:driverId/assign/:truckId', async (req, res) => {
  try {
    const result = await truckOwnerService.assignDriverToTruck(
      parseInt(req.params.driverId),
      parseInt(req.params.truckId),
      req.user.employeeId
    )
    sendResponse(res, 200, { success: true, data: result, message: 'Driver assigned successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

// Trip Management
router.get('/trips', async (req, res) => {
  try {
    const trips = await truckOwnerService.getTrips(req.user.employeeId)
    sendResponse(res, 200, { success: true, data: trips })
  } catch (error) {
    sendResponse(res, 500, { success: false, message: error.message })
  }
})

router.post('/trips', async (req, res) => {
  try {
    const trip = await truckOwnerService.createTrip(req.user.employeeId, req.body)
    sendResponse(res, 201, { success: true, data: trip, message: 'Trip created successfully' })
  } catch (error) {
    sendResponse(res, 400, { success: false, message: error.message })
  }
})

router.put('/trips/:id/status', async (req, res) => {
  try {
    const { status, ...additionalData } = req.body
    const trip = await truckOwnerService.updateTripStatus(
      parseInt(req.params.id),
      req.user.employeeId,
      status,
      additionalData
    )
    sendResponse(res, 200, { success: true, data: trip, message: 'Trip status updated successfully' })
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
