import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



const mealEnum = {
	BREAKFAST: "BREAKFAST",
	LUNCH: "LUNCH",
	DINNER: "DINNER",
	DESSERT: "DESSERT",
	DRINK: "DRINK",
}



class SignIn extends React.Component {
	render() {
		return <form>
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
			<span className="recipe_summary">
				<img src={"./photos/" + this.props.photo} alt=""></img>
				<div>
					<h3>{
						"\u2605".repeat(this.props.rating)
						+ "\u2606".repeat(5 - this.props.rating)
						+ " " + this.props.name
					}</h3>
					<p>{this.props.desc}</p>
				</div>
			</span>
		);
	}
}



class CreateRecipe extends React.Component {
	render() {
		return <form>
			<label htmlFor="name">Name of recipe: </label>
			<input type="text" name="name" />
			<br />
			<label htmlFor="desc">Brief description: </label>
			<input type="text" name="desc" />
			<br />
			<label htmlFor="ingredients">Ingredients: </label>
			<br />
			<textarea name="ingredients" cols="50" rows="5"></textarea>
			<br />
			<label htmlFor="instructions">Instructions: </label>
			<br />
			<textarea name="instructions" cols="50" rows="5"></textarea>
		</form>;
	}
}



class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: "view",
			username: "",
		};
	}
	
	render() {
		switch(this.state.mode){
			case "sign_in":
				return <>
					<SignIn />
					<button name="submit" onClick={() => this.submit_form()}>Submit</button>
				</>;
			case "add":
				return <>
					<CreateRecipe />
					<button name="submit" onClick={() => this.submit_form()}>Submit</button>
				</>;
			case "view":
				return <>
					<span>
						<button onClick={() => this.set_mode("add")}>
							Create recipe
						</button>
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
					
					<RecipeSummary rating="4" name="PB&J" desc="White bread with peanut butter and grape jelly" photo="pb_j.jpg"/>
				</>;
		}
	}
	
	set_mode(mode) {
		this.setState({mode: mode});
	}
	
	submit_form() {
		switch(this.state.mode){
			case "sign_in":
				this.state.username = document.getElementById('username').value;
				
				break;
			case "add":
				break;
		}
		
		
		
		this.set_mode("view");
	}
	
	sign_out() {
		this.setState({username: ""});
	}
}



ReactDOM.render(
	<Page />,
	document.getElementById('root')
);
