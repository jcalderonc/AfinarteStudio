import { handler } from './index.mjs';

console.log('🧪 Testing ASAPPOINTMENT Lambda Handler Locally');
console.log('===============================================');

// Test data
const testAppointment = {
  email: 'test.appointment@afinartestudio.com',
  date: '2025-12-25T10:00:00.000Z',
  type: 'Coro',
  comments: 'Prueba de appointment',
  location: 'Iglesia de Prueba'
};

// Test 1: OPTIONS request
console.log('\n📤 Test 1: OPTIONS Request');
console.log('===========================');

const optionsEvent = {
  httpMethod: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
};

try {
  const optionsResponse = await handler(optionsEvent);
  console.log('✅ OPTIONS Response:', optionsResponse.statusCode);
  console.log('Headers:', JSON.stringify(optionsResponse.headers, null, 2));
} catch (error) {
  console.error('❌ OPTIONS Error:', error.message);
  process.exit(1);
}

// Test 2: POST create appointment
console.log('\n📤 Test 2: POST Create Appointment');
console.log('===================================');

const postEvent = {
  httpMethod: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testAppointment)
};

let createdAppointmentId = null;

try {
  const postResponse = await handler(postEvent);
  console.log('✅ POST Response Status:', postResponse.statusCode);
  const postData = JSON.parse(postResponse.body);
  console.log('Response Body:', JSON.stringify(postData, null, 2));
  
  // Store appointment ID for GET test
  if (postData.success && postData.data && postData.data.appointment) {
    createdAppointmentId = postData.data.appointment.id;
    console.log('📝 Created appointment ID:', createdAppointmentId);
  }
} catch (error) {
  console.error('❌ POST Error:', error.message);
  process.exit(1);
}

// Test 3: GET appointments to verify the created appointment
console.log('\n📤 Test 3: GET Appointments (Verify Created)');
console.log('==============================================');

const getEvent = {
  httpMethod: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  queryStringParameters: {
    email: 'test.appointment@afinartestudio.com'
  }
};

try {
  const getResponse = await handler(getEvent);
  console.log('✅ GET Response Status:', getResponse.statusCode);
  const getData = JSON.parse(getResponse.body);
  console.log('Response Body:', JSON.stringify(getData, null, 2));
  
  // Verify the created appointment is in the results
  if (getData.success && getData.data && getData.data.appointments) {
    const foundAppointment = getData.data.appointments.find(apt => apt.id === createdAppointmentId);
    if (foundAppointment) {
      console.log('✅ Created appointment found in GET results');
    } else {
      console.log('⚠️  Created appointment not found in GET results');
    }
  }
} catch (error) {
  console.error('❌ GET Error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Essential tests completed!');
console.log('==============================');

// Exit with success code (same as ASAUTH/ASSIGNUP)
process.exit(0);
