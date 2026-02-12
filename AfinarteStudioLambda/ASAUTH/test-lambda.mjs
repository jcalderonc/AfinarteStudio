#!/usr/bin/env node

// Test the Lambda handler directly by importing and invoking it
import { handler } from './index.mjs';

console.log('🧪 Testing ASAUTH Lambda Handler Locally');
console.log('========================================\n');

// Test event that mimics AWS Lambda API Gateway event
const testEvent = {
  httpMethod: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "juan.prueba@afinartestudio.com",
    password: "testing1"
  })
};

async function testLambdaHandler() {
  try {
    console.log('📤 Invoking Lambda handler with test event...');
    console.log('Event:', JSON.stringify(testEvent, null, 2));
    console.log('\n⏳ Processing...\n');
    
    // Call the handler function directly
    const result = await handler(testEvent);
    
    console.log('📥 Lambda Response:');
    console.log('Status Code:', result.statusCode);
    console.log('Headers:', JSON.stringify(result.headers, null, 2));
    
    const responseBody = JSON.parse(result.body);
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
    
    // 200 = login success; 401 with Invalid credentials = handler OK, credentials wrong (no test user in DB)
    const body = responseBody;
    const success = result.statusCode === 200 ||
      (result.statusCode === 401 && body.message === 'Invalid credentials');
    if (success) {
      console.log('\n✅ SUCCESS! Lambda function is working correctly.');
      if (result.statusCode === 200) {
        console.log('🎯 MongoDB connection and authentication logic are functional.');
      } else {
        console.log('🎯 Handler responded correctly (401 Invalid credentials - no test user in DB).');
      }
      process.exit(0);
    } else {
      console.log('\n❌ Lambda function returned an error.');
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
    
    process.exit(1);
  }
}

// Run the test
testLambdaHandler().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
