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
		
		
		
		case "/update_recipe":
			req.on('data', data => {
				let obj = JSON.parse(data);
				
				for(const i in recipes) {
					let recipe = recipes[i];
					
					if(recipe.author === obj.old.author
					&& recipe.desc === obj.old.desc) {
						recipes[i] = obj.update;
						fs.writeFileSync('./recipes.json', JSON.stringify(recipes));
						
						break;
					}
				}
				
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
				
				payload.sort((a, b) => b.rating.score - a.rating.score);
				
				res.end(JSON.stringify(payload));
			});
			break;
		
		
		
		case "/vote":
			req.on('data', data => {
				let obj = JSON.parse(data);
				
				for(const i in recipes) {
					let recipe = recipes[i];
					
					if(recipe.name === obj.recipe.name
					&& recipe.desc === obj.recipe.desc) {
						if(obj.username in recipe.rating.by) {
							if(recipe.rating.by[obj.username] !== obj.vote) {
								recipe.rating.by[obj.username] = obj.vote;
								recipe.rating.score += 2 * obj.vote;
							}
						}
						else {
							recipe.rating.by[obj.username] = obj.vote;
							recipe.rating.score += obj.vote;
						}
						
						break;
					}
				}
				
				fs.writeFileSync('./recipes.json', JSON.stringify(recipes));
				
				res.end();
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