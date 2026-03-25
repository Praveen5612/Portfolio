import http from 'http';

function test(path) {
    console.log(`Testing ${path}...`);
    http.get(`http://localhost:5000${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Path: ${path} | Status: ${res.statusCode} | Body: ${data}`);
        });
    }).on('error', err => {
        console.error(`Error: ${err.message}`);
    });
}

test('/api/auth/me');
