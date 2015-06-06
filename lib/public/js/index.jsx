var API_URL = "http://api.danielfang.org/";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

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
				</div>
			);
		}
		return (
			<div className>
				<header id="nav">
					<ul>
						<li><Link to="home">Home</Link></li>
						<li><Link to="code">Code</Link></li>
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
		if (!me) return <div></div>;
		var checkinNode = this.state.checkins.length ? <Checkin checkin={this.state.checkins[0]} /> : "";
		var tweetNode = this.state.tweets.length ? <Tweet tweet={this.state.tweets[0]} /> : "";
		var txnNode = this.state.btc ? <BtcTransaction txn={this.state.btc.txns[0]} /> : "";
		var addressNode = this.state.btc ? <BtcAddress addrs={this.state.btc.addrs} /> : "";
		return (
			<div id="home">
				<div className="overview">
					<h1>{me.name}</h1>
					<p className="bio">{me.bio}</p>
					<p className="current">Currently working on <a target="_blank" href={me.currentWork.url}>{me.currentWork.name}</a>.</p>
				</div>
				<div id="status" className="row">
					{checkinNode}
					{tweetNode}
					{txnNode}
				</div>
			</div>
		);
	}}
);

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


var BtcTransaction = React.createClass({
	render: function() {
		var txn = this.props.txn;
		var amount = Number(txn.amount.amount);
		var recipient = txn.recipient ? txn.recipient.name : txn.recipient_address.splice(5);
		var coinbaseURL = "https://www.coinbase.com/join/dfang1";
		return (
			<div className="btc-txn media col-md-4" id="latest-txn">
				<div className="media-left">
					<a target="_blank" href={coinbaseURL}>
						<i className="fa fa-2x fa-money"></i>
					</a>
				</div>
				<div className="media-body">					
					<a target="_blank" href={coinbaseURL}>
						<p className="title">
							{amount < 0 ? "Sent ": "Received "}
							{Math.abs(amount)} {txn.amount.currency} {amount < 0 ? "to ": "from "} {recipient}
						</p>
					</a>
					<p className="description">{txn.notes}</p>
					<p className="date">{getFromNow(txn.created_at)}</p>
				</div>
			</div>
		);
	}
});

var BtcAddress = React.createClass({
	render: function() {
		var addrs = this.props.addrs;
		var addr = addrs[Math.floor(Math.random()*addrs.length)];
		return (
			<div className="btc-addr" id="btc-addr">
				<i className="fa fa-btc"></i>
				<span className="addr">{addr.address.address}</span>
			</div>
		);
	}
});

var Code = React.createClass({	
	getInitialState: function() {
		return { events: [] };
	},
	componentDidMount: function() {
		$.get(API_URL + "code", function(data) {
			console.log(data);
			this.setState({ events: data });
		}.bind(this));
	},
	render: function() { 
		if (!this.state.events.length) return <div></div>;
		var eventNodes = this.state.events.map(function(event) {
			if (event.type == 'WatchEvent') return <WatchEvent event={event} />;
			if (event.type == 'CreateEvent') return <CreateEvent event={event} />;
			if (event.type == 'PushEvent') return <PushEvent event={event} />;
			if (event.type == 'PublicEvent') return <PublicEvent event={event} />;
			if (event.type == 'IssuesEvent') return <IssuesEvent event={event} />;
		});
		return (
			<div id="code">
				<h1>My latest Github activity</h1>
				<div className="events">
					{eventNodes}
				</div>
			</div>
		);
	}
});

var WatchEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-star-o fa-lg"></i>
					Starred <a target="_blank" href={"https://github.com/" + repo.name}>{repo.name}</a>
				</p>
				<p className="date">{getFromNow(event.created_at)}</p>
			</div>
		);
	}
});

var CreateEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-code-fork fa-lg"></i>
					Created {event.payload.ref_type} {event.payload.ref} in
					<a target="_blank" href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="date">{getFromNow(event.created_at)}</p>
			</div>
		);
	}
});

var PushEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-code fa-lg"></i>
					Pushed {event.payload.commits.length} commit{event.payload.commits.length == 1 ? "" : "s"} to
					<a target="_blank" href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="commit">&quot;{event.payload.commits[0].message}&quot; on {event.payload.ref}</p>
				<p className="date">{getFromNow(event.created_at)}</p>
			</div>
		);
	}
});

var PublicEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-code fa-lg"></i>
					Open sourced <a target="_blank" href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="date">{getFromNow(event.created_at)}</p>
			</div>
		);
	}
});

var IssuesEvent = React.createClass({
	render: function() {
		var event = this.props.event;
		var action = event.payload.action;
		action = action.charAt(0).toUpperCase() + action.slice(1);
		var repo = event.repo;
		return (
			<div className="github-event">
				<p className="title">
					<i className="fa fa-flag-o fa-lg"></i>
					{action} <a target="_blank" href={event.payload.issue.html_url}>issue</a> in <a target="_blank" href={"https://github.com/" + repo.name}> {repo.name}</a>
				</p>
				<p className="description">{event.payload.issue.title}</p>
				<p className="date">{getFromNow(event.created_at)}</p>
			</div>
		);
	}
});


var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="code" handler={Code}/>
    <DefaultRoute name="home" handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById("global-container"));
});
