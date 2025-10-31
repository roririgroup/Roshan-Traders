// Test file to verify manufacturer data structure
import { manufacturersData, getManufacturerById } from './pages/Manufactures/manufactures.js'

console.log('Testing manufacturer data...')


// Test 1: Check if data exists
console.log('Total manufacturers:', manufacturersData.length)

// Test 2: Check first manufacturer founder data
const firstManufacturer = manufacturersData[0]
console.log('First manufacturer:', firstManufacturer.name)
console.log('Founder data:', firstManufacturer.founder)

// Test 3: Check if founder has required properties
if (firstManufacturer.founder) {
  console.log('Founder name:', firstManufacturer.founder.name)
  console.log('Founder experience:', firstManufacturer.founder.experience)
  console.log('Founder qualification:', firstManufacturer.founder.qualification)
} else {
  console.log('No founder data found!')
}

// Test 4: Check getManufacturerById function
const testManufacturer = getManufacturerById('rn-tiles')
console.log('Test manufacturer by ID:', testManufacturer?.name)
console.log('Test manufacturer founder:', testManufacturer?.founder)

export { manufacturersData, getManufacturerById }
