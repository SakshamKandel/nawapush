import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const TOKEN = 'your_jwt_token'; // Replace with your actual token

async function testEndpoints() {
  try {
    // Test GET all teachers
    console.log('Testing GET /api/teachers...');
    const getResponse = await fetch(`${BASE_URL}/api/teachers`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    const teachers = await getResponse.json();
    console.log('Teachers:', teachers);

    if (teachers.length > 0) {
      const teacherId = teachers[0]._id;
      console.log(`\nTesting DELETE /api/teachers/${teacherId}...`);
      
      // Test DELETE teacher
      const deleteResponse = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const deleteResult = await deleteResponse.json();
      console.log('Delete result:', deleteResult);
    }
  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

testEndpoints(); 