const http = require('http');
const url = require('url');
const qs = require('querystring');

const secretNumber = Math.floor(Math.random() * 10) + 1;
console.log(`Generated secret number: ${secretNumber}`);

const server = http.createServer((req, res) => {
  const path = url.parse(req.url, true).pathname;

  if (path === '/') {
    const html = require('fs').readFileSync('index.html');
    res.end(html);
  } else if (path === '/guess' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const postData = qs.parse(body);
      const userGuess = parseInt(postData.number);

      if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
        res.end(JSON.stringify({ result: 'Please enter a valid number between 1 and 10.' }));
      } else {
        console.log(secretNumber);

        if (userGuess === secretNumber) {
          res.end(JSON.stringify({ result: 'Congratulations! You guessed the correct number.' }));
        } else {
          res.end(JSON.stringify({ result: 'Wrong guess. Try again!' }));
        }
      }
    });
  } else {
    res.end('Not Found');
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
