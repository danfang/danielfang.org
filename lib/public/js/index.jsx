var API_URL = "http://api.danielfang.org/";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var Link = Router.Link;
var Route = Router.Route;

var getFromNow = function(date) {
	return moment(new Date(date)).fromNow();
};

var App = React.createClass({
	getInitialState: function() {
		return { me: null };
	},
	componentDidMount: function() {
		$.get(API_URL, function(data) {
			console.log(data);
			this.setState({ me: data.me });
		}.bind(this));
	},
	render: function () {
		var me = this.state.me;
		var contactNode;
		if (me) {
			contactNode = (
				<div id="contact">
					<a target="_blank" href={"mailto:" + me.contact.email}><i className="fa fa-envelope"></i></a>
					<a target="_blank" href={me.contact.facebook}><i className="fa fa-facebook"></i></a>
					<a target="_blank" href={me.contact.github}><i className="fa fa-github"></i></a>
					<a target="_blank" href={me.contact.linkedin}><i className="fa fa-linkedin"></i></a>
					<a target="_blank" href={me.contact.twitter}><i className="fa fa-twitter"></i></a>
					<a target="_blank" href={me.contact.keybase}><i className="fa fa-key"></i></a>
				</div>
			);
		}
		return (
			<div className>
				<header id="nav">
					<ul>
						<li><Link to="home">Home</Link></li>
						<li><Link to="projects">Projects</Link></li>
						<li><a target="_blank" href="resume.pdf">R&eacute;sum&eacute;</a></li>
					</ul>
				</header>

				<div id="content">
					<RouteHandler me={this.state.me}/>
				</div>

				<footer>
					<p>Made with <a target="_blank" href="https://github.com/danfang/me-api">Me API</a>, React, and Sass</p>
					{contactNode}
				</footer>
			</div>
		);
	}
});

var Home = React.createClass({
	getInitialState: function() {
		return { tweets: [], checkins: [], btc: null };
	},
	componentDidMount: function() {
		$.get(API_URL + "twitter", function(data) {
			console.log(data);
			this.setState({ tweets: data.tweets });
		}.bind(this));

		$.get(API_URL + "location", function(data) {
			console.log(data);
			this.setState({ checkins: data.checkins.items });
		}.bind(this));

		$.get(API_URL + "btc", function(data) {
			console.log(data);
			this.setState({ btc: data });
		}.bind(this));
	},
	render: function() {
		var me = this.props.me;
		if (!me) return (
			<div id="home">
				<div className="overview">
					<h1>Daniel Fang</h1>
					<h3>
						<a target="_blank" href="http://api.danielfang.org">api.danielfang.org</a>
						<span> is currently unavailable!</span>
					</h3>
				</div>
			</div>
		);
		var checkinNode = this.state.checkins.length ? <Checkin checkin={this.state.checkins[0]} /> : "";
		var tweetNode = this.state.tweets.length ? <Tweet tweet={this.state.tweets[0]} /> : "";
		return (
			<div id="home">
				<div className="overview">
					<h1>{me.name}</h1>
					<p className="bio">{me.bio}</p>
					<p className="current">{'Currently working on '}
						<a target="_blank" href={me.currentWork.url}>
							{me.currentWork.name}
						</a>
					.</p>
				</div>
				<div id="status" className="row">
					{tweetNode}
					{checkinNode}
				</div>
			</div>
		);
	}
});

var Projects = React.createClass({
	render: function() {
		var me = this.props.me;
		if (!me) return <div id="projects"></div>;
    var projectNodes = me.projects.map(function(el) {
        return <Project project={el} />;
    });
    return <div id="projects">{projectNodes}</div>;
	}
});

var Project = React.createClass({
  render: function() {
  	var project = this.props.project;
  	var imgNode = project.img? <img src={project.img} /> : "";
  	var urlNode = project.url? <a target="_blank" href={project.url}><i className="fa fa-external-link"></i></a> : "";
  	return (
  		<div className="project">
  			<h1 className="title">{project.title}{urlNode}</h1>
  			<p className="date">{project.date}</p>
  			<p className="description">{project.description}</p>
  			{imgNode}
  		</div>
	);
  }
});

var Checkin = React.createClass({
	render: function() {
		var checkin = this.props.checkin;
		var venue = checkin.venue;
		var mapsURL = "https://www.google.com/maps?z=12&t=m&q=loc:";
		mapsURL += venue.location.lat + "+" + venue.location.lng;
		return (
			<div className="checkin media col-md-4" id="latest-checkin">
				<div className="media-left">
					<a target="_blank" href={mapsURL}><i className="fa fa-2x fa-map-marker"></i></a>
				</div>
				<div className="media-body">
					<a target="_blank" href={mapsURL}><p className="location title">{checkin.venue.name}</p></a>
					<p className="description">{checkin.shout}</p>
					<p className="date">{getFromNow(checkin.createdAt * 1000)}</p>
				</div>
			</div>
		);
	}
});

var Tweet = React.createClass({
	render: function() {
		var tweet = this.props.tweet;
		var twitterURL = "https://twitter.com/" + tweet.user.screen_name;
		return (
			<div className="tweet media col-md-4" id="latest-tweet">
				<div className="media-left">
					<a target="_blank" href={twitterURL}>
						<i className="fa fa-2x fa-twitter"></i>
					</a>
				</div>
				<div className="media-body">
					<a target="_blank" href={twitterURL}>
						<p className="screenName title">@{tweet.user.screen_name}</p>
					</a>
					<p className="description">{tweet.text}</p>
					<p className="date">{getFromNow(tweet.created_at)}</p>
				</div>
			</div>
		);
	}
});
var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="projects" handler={Projects}/>
    <DefaultRoute name="home" handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDOM.render(<Handler/>, document.getElementById("root"));
});
