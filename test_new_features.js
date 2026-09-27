const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 8080,
      path: path
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }));
    }).on('error', reject);
  });
}

async function runTest() {
  console.log('=== TEST 1: Register New Complaint (e-FIR) ===');
  const complaintPayload = {
    complainantName: 'Rohan Sharma',
    contactPhone: '+91 98840 12345',
    contactEmail: 'rohan.sharma@example.com',
    crimeType: 'Mobile Phone Theft',
    location: 'Chennai',
    incidentDate: '2026-09-27',
    description: 'Gold iPhone 15 Pro snatched by two individuals riding a black sports motorcycle near T. Nagar bus terminal.',
    victimAge: 26,
    suspectAge: 22,
    suspectDetails: 'Black motorcycle, red helmet, sped towards Panagal Park',
    landmark: 'T. Nagar Bus Terminal',
    severity: 'Medium'
  };

  const regRes = await post('/api/complaints', complaintPayload);
  console.log('Registered e-FIR Status:', regRes.status);
  console.log('Tracking Number:', regRes.data.trackingNumber);
  console.log('Statutory Citation:', regRes.data.recommendedPenalCode);
  console.log('AI Triage Summary:', regRes.data.aiTriageSummary);

  console.log('\n=== TEST 2: Track Newly Registered e-FIR ===');
  const trackRes = await get(`/api/complaints/track/${regRes.data.trackingNumber}`);
  console.log('Tracking Status:', trackRes.status);
  console.log('Police Station:', trackRes.data.assignedPoliceStation);
  console.log('Investigation Milestones:', trackRes.data.investigationMilestones);

  console.log('\n=== TEST 3: Ask AI Chatbot About This New Complaint ===');
  const chatRes = await post('/api/chat', {
    message: 'What recent mobile phone theft occurred near T Nagar bus terminal?',
    sessionId: 'test-session-e2e'
  });
  console.log('AI Chat Answer:', chatRes.data.answer);
  console.log('Evidence Cases Found:', chatRes.data.evidence.map(e => e.caseId + ' (' + e.crimeType + ' in ' + e.location + ')'));

  console.log('\n=== TEST 4: Fetch Analytics ===');
  const analyticsRes = await get('/api/analytics');
  console.log('Total Records:', analyticsRes.data.totalRecords);
  console.log('Solved Rate:', analyticsRes.data.solvedRate + '%');
  console.log('Top Cities:', Object.keys(analyticsRes.data.cityDistribution).slice(0, 5));
}

runTest().catch(console.error);
