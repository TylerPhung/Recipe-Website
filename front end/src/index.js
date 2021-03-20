import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import http from 'http';



/*
const mealEnum = {
	BREAKFAST: "breakfast",
	LUNCH: "lunch",
	DINNER: "dinner",
	DESSERT: "dessert",
	DRINK: "drink",
}
*/



class SignIn extends React.Component {
	render() {
		return <form>
			<label id="banner"></label>
			<br />
			<label htmlFor="username">Username: </label>
			<input type="text" id="username" />
			<br />
			<label htmlFor="password">Password: </label>
			<input type="password" id="password" />
		</form>;
	}
}



class RecipeSummary extends React.Component {
	render() {
		return (
			<div className="recipe_summary">
				<h3 onClick={this.props.onClick}>{
					"\u2605".repeat(this.props.rating)
					+ "\u2606".repeat(5 - this.props.rating)
					+ " " + this.props.name
					+ " - " + this.props.author
				}</h3>
				<p>{this.props.desc}</p>
			</div>
		);
	}
}



class RecipeListing extends React.Component {
	render() {
		return <>
			<h2>{this.props.name + " (By " + this.props.author + ")"}</h2>
			<p>{this.props.desc}</p>
			<br />
			<h2>Ingredients</h2>
			<p>{this.props.ingredients}</p>
			<br />
			<h2>Instructions</h2>
			<p>{this.props.instructions}</p>
		</>;
	}
}



class CreateRecipe extends React.Component {
	render() {
		return <form>
			<label>Name of recipe: </label>
			<input type="text" id="name" />
			<br />
			<label>Brief description: </label>
			<input type="text" id="desc" />
			<br />
			<label>Meal type:</label>
			<select id="type">
				<option value="breakfast">Breakfast</option>
				<option value="lunch">Lunch</option>
				<option value="dinner">Dinner</option>
				<option value="dessert">Dessert</option>
				<option value="drink">Drink</option>
			</select>
			<br />
			<label>Ingredients: </label>
			<br />
			<textarea id="ingredients" cols="50" rows="5"></textarea>
			<br />
			<label>Instructions: </label>
			<br />
			<textarea id="instructions" cols="50" rows="5"></textarea>
		</form>;
	}
}



class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: "view",
			username: "",
			results: [],
			focus_recipe: null,
		};
	}
	
	render() {
		switch(this.state.mode) {
			case "sign_in":
				return <>
					<button onClick={() => this.set_mode("view")}>Back</button>
					<SignIn />
					<button onClick={() => this.sign_in()}>Sign in</button>
					<button onClick={() => this.create_account()}>Create Account</button>
				</>;
			case "add":
				return <>
					<button onClick={() =>this.set_mode("view")}>Back</button>
					<CreateRecipe />
					<button onClick={() => this.publish_recipe()}>Submit</button>
				</>;
				
			case "results":
				return <>
					<button onClick={() =>this.set_mode("view")}>Back</button>
					{this.state.results.map((recipe, idx) =>
						<RecipeSummary
							rating="5"
							name={recipe.name}
							author={recipe.author}
							desc={recipe.desc}
							onClick={() => this.show_full_recipe(idx)}
						/>
					)}
					{this.state.results.length === 0 ?
						<p>No results</p> : null
					}
				</>;
			
			case "show_recipe":
				return <>
					<button onClick={() => this.set_mode("results")}>Back</button>
					<RecipeListing
						name={this.state.focus_recipe.name}
						author={this.state.focus_recipe.author}
						desc={this.state.focus_recipe.desc}
						type={this.state.focus_recipe.type}
						ingredients={this.state.focus_recipe.ingredients}
						instructions={this.state.focus_recipe.instructions}
					/>
				</>
			
			default: // view
				return <>
					<span>
						{this.state.username !== "" ?
							<button onClick={() => this.set_mode("add")}>Create recipe</button> : null
						}
						<button onClick={() => 
							this.state.username === "" ?
								this.set_mode("sign_in") :
								this.sign_out()
						}>
							Sign {this.state.username === "" ? "in" : "out"}
						</button>
						{this.state.username !== "" ?
							<p>Welcome, {this.state.username}!</p> : null
						}
					</span>
					
					
					<div>
						<label>Search by ingredients:</label>
						<br />
						<input type="text" id="terms" />
						<button onClick={() => this.search_by_ingredients()}>Search</button>
						<br />
						<label>OR</label>
						<br />
						<label>Search by meal type: </label>
						<select id="type">
							<option value="breakfast">Breakfast</option>
							<option value="lunch">Lunch</option>
							<option value="dinner">Dinner</option>
							<option value="dessert">Dessert</option>
							<option value="drink">Drink</option>
						</select>
						<button onClick={() => this.search_by_type()}>Search</button>
					</div>
				</>;
		}
	}
	
	set_mode(mode) {
		this.setState({mode: mode});
	}
	
	submit_form() {
		switch(this.state.mode) {
			case "sign_in":
				this.setState({username: document.getElementById('username').value});
				
				break;
			default:
				break;
		}
		
		
		
		this.set_mode("view");
	}
	
	create_account() {
		let username = document.getElementById('username').value;
		let password = document.getElementById('password').value;
		
		
		let body = JSON.stringify({
			username: username,
			password: password,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/new_account",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', () => {});
			
			res.on('end', () => {
				if(res.statusCode === 200){
					this.submit_form();
				}
				else {
					document.getElementById('banner').innerHTML = "-- Username is already taken, try again";
					document.getElementById('username').value = "";
					document.getElementById('password').value = "";
				}
			});
		})
		.on("error", console.error)
		.end(body);
	}
	
	sign_in() {
		let username = document.getElementById('username').value;
		let password = document.getElementById('password').value;
		
		
		let body = JSON.stringify({
			username: username,
			password: password,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/sign_in",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', () => {});
			
			res.on('end', () => {
				if(res.statusCode === 200){
					this.submit_form();
				}
				else {
					document.getElementById('banner').innerHTML = "-- Invalid credentials, try again";
					document.getElementById('password').value = "";
				}
			});
		})
		.on("error", console.error)
		.end(body);
	}
	
	sign_out() {
		this.setState({username: ""});
	}
	
	publish_recipe() {
		let body = JSON.stringify({
			author: this.state.username,
			name: document.getElementById('name').value,
			desc: document.getElementById('desc').value,
			type: document.getElementById('type').value,
			ingredients: document.getElementById('ingredients').value,
			instructions: document.getElementById('instructions').value,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/recipes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', () => {});
			
			res.on('end', () => {
				this.submit_form();
			});
		})
		.on("error", console.error)
		.end(body);
	}
	
	search_by_ingredients() {
		let body = JSON.stringify({
			terms: document.getElementById('terms').value,
			type: null,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/find_recipes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', data => {
				this.setState({
					results: JSON.parse(data)
				});
			});
			
			res.on('end', () => {
				this.set_mode("results");
			});
		})
		.on("error", console.error)
		.end(body);
	}
	
	search_by_type() {
		let body = JSON.stringify({
			terms: null,
			type: document.getElementById('type').value,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/find_recipes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', data => {
				this.setState({
					results: JSON.parse(data)
				});
			});
			
			res.on('end', () => {
				this.set_mode("results");
			});
		})
		.on("error", console.error)
		.end(body);
	}
	
	show_full_recipe(num) {
		this.setState({
			mode: "show_recipe",
			focus_recipe: this.state.results[num],
		});
	}
}



ReactDOM.render(
	<Page />,
	document.getElementById('root')
);