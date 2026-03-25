import http from 'http';

function test(path) {
    console.log(`Testing ${path}...`);
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Path: ${path} | Status: ${res.statusCode} | Body: ${data}`);
        });
    });
    req.on('error', err => {
        console.error(`Error: ${err.message}`);
    });
    req.write(JSON.stringify({ email: 'test@test.com', password: 'password' }));
    req.end();
}

test('/api/auth/login');
