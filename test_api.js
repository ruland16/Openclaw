/**
 * Test script for Mission Control Dashboard API
 */

const http = require('http');

const HOST = 'localhost';
const PORT = 3000;

async function testAPI() {
    console.log('🧪 Testing Mission Control Dashboard API...\n');
    
    const tests = [
        {
            name: 'Health Check',
            path: '/api/health',
            method: 'GET'
        },
        {
            name: 'Get Dashboard Stats',
            path: '/api/dashboard/stats',
            method: 'GET'
        },
        {
            name: 'Get All Agents',
            path: '/api/agents',
            method: 'GET'
        },
        {
            name: 'Get Agent Status View',
            path: '/api/dashboard/agent-status',
            method: 'GET'
        },
        {
            name: 'Get Recent Activities',
            path: '/api/activities/recent?limit=5',
            method: 'GET'
        },
        {
            name: 'Get All Tasks',
            path: '/api/tasks',
            method: 'GET'
        },
        {
            name: 'API Documentation',
            path: '/api',
            method: 'GET'
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        console.log(`📋 Test: ${test.name}`);
        console.log(`   ${test.method} ${test.path}`);
        
        try {
            const result = await makeRequest(test);
            
            if (result.statusCode >= 200 && result.statusCode < 300) {
                console.log(`   ✅ PASS (${result.statusCode})`);
                passed++;
                
                // Show some sample data for certain endpoints
                if (test.path === '/api/agents') {
                    const agents = JSON.parse(result.body);
                    console.log(`   👥 Found ${agents.length} agents`);
                    agents.slice(0, 3).forEach(agent => {
                        console.log(`      - ${agent.name} (${agent.status})`);
                    });
                } else if (test.path === '/api/dashboard/stats') {
                    const stats = JSON.parse(result.body);
                    console.log(`   📊 ${stats.agents.active_agents} active agents, ${stats.tasks.total_tasks} tasks`);
                }
            } else {
                console.log(`   ❌ FAIL (${result.statusCode}): ${result.body}`);
                failed++;
            }
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
            failed++;
        }
        
        console.log();
    }
    
    console.log('📊 Test Results:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! API is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Check the server logs for details.');
        process.exit(1);
    }
}

function makeRequest(test) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: test.path,
            method: test.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const req = http.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: body
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// Check if server is running
function checkServer() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: HOST,
            port: PORT,
            path: '/api/health',
            method: 'GET',
            timeout: 1000
        }, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

async function main() {
    console.log('🔍 Checking if server is running...');
    
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ Server is not running. Please start it first:');
        console.log('   cd /home/user/.openclaw/workspace && node server.js');
        console.log('\nThen run this test again.');
        process.exit(1);
    }
    
    console.log('✅ Server is running. Starting API tests...\n');
    
    await testAPI();
}

main().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});