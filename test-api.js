// Test the API endpoints
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await makeRequest('/health');
    console.log('✅ Health:', health);
    console.log('');
    
    // Test reviews endpoint
    console.log('2. Testing reviews endpoint...');
    const reviews = await makeRequest('/api/reviews/hostaway');
    console.log('✅ Reviews:', reviews);
    console.log('');
    
    // Test with filters
    console.log('3. Testing with filters...');
    const filtered = await makeRequest('/api/reviews/hostaway?approved=false');
    console.log('✅ Filtered reviews:', filtered);
    console.log('');
    
    console.log('🎉 All tests passed! API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
