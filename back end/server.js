const http = require("http")
const fs = require("fs");

let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
let recipes = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	
	switch(req.url) {
		case "/new_account":
			req.on('data', data => {
				let obj = JSON.parse(data);
				
				if(obj.username in users) {
					res.statusCode = 409;
				}
				else {
					users[obj.username] = {pw: obj.password};
					fs.writeFileSync('./users.json', JSON.stringify(users));
				}
				
				res.end();
			});
			break;
		
		
		
		case "/sign_in":
			req.on('data', data => {
				let obj = JSON.parse(data);
				
				if(obj.username in users) {
					if(obj.password !== users[obj.username].pw) {
						res.statusCode = 409;
					}
				}
				else {
					res.statusCode = 409;
				}
				
				res.end();
			});
			break;
		
		
		
		case "/recipes":
			req.on('data', data => {
				let obj = JSON.parse(data);
				
				recipes.push(obj);
				fs.writeFileSync('./recipes.json', JSON.stringify(recipes));
				
				res.end();
			});
			break;
		
		
		
		case "/find_recipes":
			req.on('data', data => {
				let obj = JSON.parse(data);
				let terms = (obj.terms ? obj.terms.split(" ") : []);
				let payload = [];
				
				for(const i in recipes) {
					let recipe = recipes[i];
					
					if(recipe.type === obj.type) {
						payload.push(recipe);
					}
					else {
						for(const j in terms) {
							let term = terms[j];
							
							if(recipe.ingredients.includes(term)) {
								payload.push(recipe);
								break;
							}
						}
					}
				}
				
				res.end(JSON.stringify(payload));
			});
			break;
		
		
		
		default:
			break;
	}
	
	req.on('end', () => {
		res.end();
	});
})

server.listen(5000, "localhost", (req, res) => {
	console.log("Server is listening on port 5000");
})