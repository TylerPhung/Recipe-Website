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
			<label id="banner">{this.props.banner}</label>
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
					this.props.rating.toString()
					+ (this.props.rating >= 0 ?
						"\uD83D\uDC4D" :
						"\uD83D\uDC4E"
					)
					+ " - " + this.props.name
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
			<input type="text" id="name" value={this.props.name} />
			<br />
			<label>Brief description: </label>
			<input type="text" id="desc" value={this.props.desc} />
			<br />
			<label>Meal type:</label>
			{
				selectDropDownItem(
				<select id="type">
					<option value="breakfast">Breakfast</option>
					<option value="lunch">Lunch</option>
					<option value="dinner">Dinner</option>
					<option value="dessert">Dessert</option>
					<option value="drink">Drink</option>
				</select>, this.props.type)
			}
			<br />
			<label>Ingredients: </label>
			<br />
			<textarea id="ingredients" cols="50" rows="5">
				{this.props.ingredients}
			</textarea>
			<br />
			<label>Instructions: </label>
			<br />
			<textarea id="instructions" cols="50" rows="5">
				{this.props.instructions}
			</textarea>
		</form>;
	}
}



class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: "view",
			username: "",
			banner: "",
			results: [],
			focus_recipe: null,
		};
	}
	
	render() {
		switch(this.state.mode) {
			case "sign_in":
				return <>
					<button onClick={() => this.set_mode("view")}>Back</button>
					<SignIn banner={this.state.banner}/>
					<button onClick={() => this.sign_in()}>Sign in</button>
					<button onClick={() => this.create_account()}>Create Account</button>
				</>;
			case "add":
				return <>
					<button onClick={() => this.set_mode(this.state.focus_recipe ? "results" : "view")}>Back</button>
					{this.state.focus_recipe !== null ?
						<CreateRecipe
							name={this.state.focus_recipe.name}
							desc={this.state.focus_recipe.desc}
							type={this.state.focus_recipe.type}
							ingredients={this.state.focus_recipe.ingredients}
							instructions={this.state.focus_recipe.instructions}
						/> :
						<CreateRecipe />
					}
					<button onClick={() => this.publish_recipe()}>Submit</button>
				</>;
				
			case "results":
				return <>
					<button onClick={() =>this.set_mode("view")}>Back</button>
					{this.state.results.map((recipe, idx) =>
						<RecipeSummary
							rating={recipe.rating.score}
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
					<span>
						<button onClick={() => this.set_mode("results")}>Back</button>
						{this.state.focus_recipe.author === this.state.username ?
							<button onClick={() => this.create_recipe(true)}>Edit</button> : null
						}
					</span>
					<span>
						<h2>{
							this.state.focus_recipe.rating.score.toString()
							+ (this.state.focus_recipe.rating.score >= 0 ?
								"\uD83D\uDC4D" :
								"\uD83D\uDC4E"
							)
							+ "\xa0\xa0"
						}</h2>
						{this.state.username !== "" ?
							<>
								<button onClick={() => this.rate(1)}>&#128077;</button>
								<button onClick={() => this.rate(-1)}>&#128078;</button>
							</>
							: null
						}
					</span>
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
						<button onClick={() => this.create_recipe()}>Create recipe</button>
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
	
	create_recipe(isEditing) {
		if(this.state.username !== "") {
			this.set_mode("add");
			
			if(isEditing !== true) {
				this.setState({focus_recipe: null});
			}
		}
		else {
			this.setState({
				mode: "sign_in",
				banner: "-- Users must be logged in to create recipes",
			});
		}
	}
	
	publish_recipe() {
		let body = {
			author: this.state.username,
			name: document.getElementById('name').value,
			desc: document.getElementById('desc').value,
			type: document.getElementById('type').value,
			ingredients: document.getElementById('ingredients').value,
			instructions: document.getElementById('instructions').value,
			rating: {
				score: 0,
				by: [],
			}
		};
		
		// If we are modifying and existing recipe
		if(this.state.focus_recipe) {
			body = {
				old: this.state.focus_recipe,
				update: body,
			};
		}
		
		body = JSON.stringify(body);
		
		let options = {
			hostname: "localhost",
			port: 5000,
			path: this.state.focus_recipe ? "/update_recipe" : "/recipes",
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
	
	rate(vote) {
		if(this.state.username in this.state.focus_recipe.rating.by) {
			if(this.state.focus_recipe.rating.by[this.state.username] !== vote){
				let modified = this.state.focus_recipe;
				modified.rating.score += 2 * vote;
				this.setState({focus_recipe: modified});
				this.state.focus_recipe.rating.by[this.state.username] = vote;
				
				this.make_vote(vote);
			}
		}
		else {
			this.state.focus_recipe.rating.by[this.state.username] = vote;
			let modified = this.state.focus_recipe;
			modified.rating.score += vote;
			this.setState({focus_recipe: modified});
			
			this.make_vote(vote);
		}
	}
	
	make_vote(vote) {
		let body = JSON.stringify({
			username: this.state.username,
			recipe: this.state.focus_recipe,
			vote: vote,
		});
		let options = {
			hostname: "localhost",
			port: 5000,
			path: "/vote",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
		};
		
		
		
		http.request(options, res => {
			res.on('data', () => {});
			
			res.on('end',  () => {});
		})
		.on("error", console.error)
		.end(body);
	}
}



ReactDOM.render(
	<Page />,
	document.getElementById('root')
);



function selectDropDownItem(selection, value) {
	for(const i in selection.options) {
		const option = selection.options[i];
		
		if(option.value.toLowerCase() === value) {
			selection.options[i].selected = true;
			break;
		}
	}
	
	return selection;
}