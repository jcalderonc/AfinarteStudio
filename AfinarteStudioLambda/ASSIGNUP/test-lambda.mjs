#!/usr/bin/env node

// Test the ASSIGNUP Lambda handler directly by importing and invoking it
import { handler } from './index.mjs';

console.log('🧪 Testing ASSIGNUP Lambda Handler Locally');
console.log('==========================================\n');

// Test event for user registration
const testEvent = {
  httpMethod: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria.test@afinartestudio.com",
    phone: "555-5678",
    password: "testpass123",
    acceptTerms: true
  })
};

async function testLambdaHandler() {
  try {
    console.log('📤 Invoking ASSIGNUP Lambda handler with test event...');
    console.log('Event:', JSON.stringify(testEvent, null, 2));
    console.log('\n⏳ Processing registration...\n');
    
    // Call the handler function directly
    const result = await handler(testEvent);
    
    console.log('📥 Lambda Response:');
    console.log('Status Code:', result.statusCode);
    console.log('Headers:', JSON.stringify(result.headers, null, 2));
    
    const responseBody = JSON.parse(result.body);
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
    
    if (result.statusCode === 201) {
      console.log('\n✅ SUCCESS! User registration completed successfully.');
      console.log('🎯 MongoDB connection and user creation logic are functional.');
      process.exit(0);
    } else if (result.statusCode === 409) {
      console.log('\n⚠️  User already exists - this is expected behavior.');
      console.log('🎯 Duplicate email validation is working correctly.');
      process.exit(0);
    } else {
      console.log('\n❌ Registration failed with unexpected status code.');
      console.log('🔍 Check the response details above for troubleshooting.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n💥 Lambda handler threw an exception:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    console.log('\n🔧 This indicates an issue with:');
    console.log('   - MongoDB connection configuration');
    console.log('   - Lambda function code syntax/logic');
    console.log('   - Missing dependencies');
    console.log('   - Invalid input data structure');
    
    process.exit(1);
  }
}

// Run the test
testLambdaHandler().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
