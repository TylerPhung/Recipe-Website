const http = require("http")
const fs = require("fs");

let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	
	req.on('data', chunk => {
		obj = JSON.parse(chunk);
		
		if(obj.username in users) {
			res.statusCode = 409;
		}
		else {
			users[obj.username] = {pw: obj.password};
			fs.writeFileSync('./users.json', JSON.stringify(users));
		}
		
		res.end();
	});
	
	req.on('end', () => {
		res.end();
	});
})

server.listen(5000, "localhost", (req, res) => {
	console.log("Server is listening on port 5000");
})