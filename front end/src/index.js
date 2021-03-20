import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class RecipeSummary extends React.Component {
	render() {
		return <span className="recipe_summary">
			<img src={"./photos/" + this.props.photo} alt=""></img>
			<div>
				<h3>{
					"\u2605".repeat(this.props.rating)
					+ "\u2606".repeat(5 - this.props.rating)
					+ " " + this.props.name
				}</h3>
				<p>{this.props.description}</p>
			</div>
		</span>;
	}
}



ReactDOM.render(
	(<RecipeSummary rating="4" name="PB&J" description="White bread with peanut butter and grape jelly" photo="pb_j.jpg"/>),
	document.getElementById('root')
);
