var API_URL = "http://api.danielfang.org/";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var getFromNow = function(date) {
	return moment(new Date(date)).fromNow();
};

var App = React.createClass({displayName: "App",
  render: function () {
    return (
      React.createElement("div", {className: true}, 
        React.createElement("header", {id: "nav"}, 
          React.createElement("ul", null, 
            React.createElement("li", null, React.createElement(Link, {to: "home"}, "Home")), 
            React.createElement("li", null, React.createElement(Link, {to: "code"}, "Code")), 
            React.createElement("li", null, React.createElement("a", {target: "_blank", href: "resume.pdf"}, "Résumé"))
          )
        ), 

        React.createElement("div", {id: "content"}, 
        	React.createElement(RouteHandler, null)
        ), 

        React.createElement("footer", null, 
        	React.createElement("p", null, "Made with ", React.createElement("a", {target: "_blank", href: "https://github.com/danfang/me-api"}, "Me API"), ", React, and Sass")
        )
      )
    );
  }
});

var Home = React.createClass({displayName: "Home",
	getInitialState: function() {
		return { me: null, tweets: [], checkins: [], btc: null };
	},
	componentDidMount: function() {
		$.get(API_URL, function(data) {
			console.log(data);
			this.setState({ me: data.me });
		}.bind(this));

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
		var me = this.state.me;
		if (!me) return React.createElement("div", null);
		var checkinNode = this.state.checkins.length ? React.createElement(Checkin, {checkin: this.state.checkins[0]}) : "";
		var tweetNode = this.state.tweets.length ? React.createElement(Tweet, {tweet: this.state.tweets[0]}) : "";
		var txnNode = this.state.btc ? React.createElement(BtcTransaction, {txn: this.state.btc.txns[0]}) : "";
		var addressNode = this.state.btc ? React.createElement(BtcAddress, {addrs: this.state.btc.addrs}) : "";
		return (
			React.createElement("div", {id: "home"}, 
				React.createElement("div", {className: "overview"}, 
					React.createElement("h2", null, me.name), 
					React.createElement("p", null, me.bio)
				), 
				React.createElement("div", {id: "status", className: "row"}, 
					checkinNode, 
					tweetNode, 
					txnNode
				), 
				React.createElement("div", {className: "pay"}, 
					addressNode
				)
			)
		);
	}}
);

var Checkin = React.createClass({displayName: "Checkin",
	render: function() {
		var checkin = this.props.checkin;
		return (
			React.createElement("div", {className: "checkin media col-md-4", id: "latest-checkin"}, 
				React.createElement("div", {className: "media-left"}, 
					React.createElement("i", {className: "fa fa-2x fa-map-marker"})
				), 
				React.createElement("div", {className: "media-body"}, 
					React.createElement("p", {className: "location title"}, checkin.venue.name), 
					React.createElement("p", {className: "description"}, checkin.shout), 
					React.createElement("p", {className: "date"}, getFromNow(checkin.createdAt * 1000))
				)
			)
		);
	}
});

var Tweet = React.createClass({displayName: "Tweet",
	render: function() {
		var tweet = this.props.tweet;
		return (
			React.createElement("div", {className: "tweet media col-md-4", id: "latest-tweet"}, 
				React.createElement("div", {className: "media-left"}, 
					React.createElement("i", {className: "fa fa-2x fa-twitter"})
				), 
				React.createElement("div", {className: "media-body"}, 
					React.createElement("a", {target: "_blank", href: "https://twitter.com/" + tweet.user.screen_name}, 
						React.createElement("p", {className: "screenName title"}, "@", tweet.user.screen_name)
					), 
					React.createElement("p", {className: "description"}, tweet.text), 
					React.createElement("p", {className: "date"}, getFromNow(tweet.created_at))
				)
			)
		);
	}
});


var BtcTransaction = React.createClass({displayName: "BtcTransaction",
	render: function() {
		var txn = this.props.txn;
		var amount = Number(txn.amount.amount);
		var recipient = txn.recipient ? txn.recipient.name : txn.recipient_address.splice(5);
		return (
			React.createElement("div", {className: "btc-txn media col-md-4", id: "latest-txn"}, 
				React.createElement("div", {className: "media-left"}, 
					React.createElement("i", {className: "fa fa-2x fa-money"})
				), 
				React.createElement("div", {className: "media-body"}, 
					React.createElement("p", {className: "title"}, 
						amount < 0 ? "Sent ": "Received ", 
						Math.abs(amount), " ", txn.amount.currency, " ", amount < 0 ? "to ": "from ", " ", recipient
					), 
					React.createElement("p", {className: "description"}, txn.notes), 
					React.createElement("p", {className: "date"}, getFromNow(txn.created_at))
				)
			)
		);
	}
});

var BtcAddress = React.createClass({displayName: "BtcAddress",
	render: function() {
		var addrs = this.props.addrs;
		var addr = addrs[Math.floor(Math.random()*addrs.length)];
		return (
			React.createElement("div", {className: "btc-addr", id: "btc-addr"}, 
				React.createElement("i", {className: "fa fa-btc"}), 
				React.createElement("span", {className: "addr"}, addr.address.address)
			)
		);
	}
});

var Code = React.createClass({displayName: "Code",	
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
		if (!this.state.events.length) return React.createElement("div", null);
		var eventNodes = this.state.events.map(function(event) {
			if (event.type == 'WatchEvent') return React.createElement(WatchEvent, {event: event});
			if (event.type == 'CreateEvent') return React.createElement(CreateEvent, {event: event});
			if (event.type == 'PushEvent') return React.createElement(PushEvent, {event: event});
			if (event.type == 'PublicEvent') return React.createElement(PublicEvent, {event: event});
			if (event.type == 'IssuesEvent') return React.createElement(IssuesEvent, {event: event});
		});
		return React.createElement("div", {id: "code"}, eventNodes);
	}
});

var WatchEvent = React.createClass({displayName: "WatchEvent",
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			React.createElement("div", {className: "github-event"}, 
				React.createElement("p", {className: "title"}, 
					React.createElement("i", {className: "fa fa-star fa-lg"}), 
					"Starred ", React.createElement("a", {target: "_blank", href: "https://github.com/" + repo.name}, repo.name)
				), 
				React.createElement("p", {className: "date"}, getFromNow(event.created_at))
			)
		);
	}
});

var CreateEvent = React.createClass({displayName: "CreateEvent",
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			React.createElement("div", {className: "github-event"}, 
				React.createElement("p", {className: "title"}, 
					React.createElement("i", {className: "fa fa-code-fork fa-lg"}), 
					"Created ", event.payload.ref_type, " ", event.payload.ref, " in", 
					React.createElement("a", {target: "_blank", href: "https://github.com/" + repo.name}, " ", repo.name)
				), 
				React.createElement("p", {className: "date"}, getFromNow(event.created_at))
			)
		);
	}
});

var PushEvent = React.createClass({displayName: "PushEvent",
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			React.createElement("div", {className: "github-event"}, 
				React.createElement("p", {className: "title"}, 
					React.createElement("i", {className: "fa fa-code fa-lg"}), 
					"Pushed ", event.payload.commits.length, " commit", event.payload.commits.length == 1 ? "" : "s", " to", 
					React.createElement("a", {target: "_blank", href: "https://github.com/" + repo.name}, " ", repo.name)
				), 
				React.createElement("p", {className: "commit"}, "\"", event.payload.commits[0].message, "\" on ", event.payload.ref), 
				React.createElement("p", {className: "date"}, getFromNow(event.created_at))
			)
		);
	}
});

var PublicEvent = React.createClass({displayName: "PublicEvent",
	render: function() {
		var event = this.props.event;
		var repo = event.repo;
		return (
			React.createElement("div", {className: "github-event"}, 
				React.createElement("p", {className: "title"}, 
					React.createElement("i", {className: "fa fa-code fa-lg"}), 
					"Open sourced ", React.createElement("a", {target: "_blank", href: "https://github.com/" + repo.name}, " ", repo.name)
				), 
				React.createElement("p", {className: "date"}, getFromNow(event.created_at))
			)
		);
	}
});

var IssuesEvent = React.createClass({displayName: "IssuesEvent",
	render: function() {
		var event = this.props.event;
		var action = event.payload.action;
		action = action.charAt(0).toUpperCase() + action.slice(1);
		var repo = event.repo;
		return (
			React.createElement("div", {className: "github-event"}, 
				React.createElement("p", {className: "title"}, 
					React.createElement("i", {className: "fa fa-code fa-lg"}), 
					action, " ", React.createElement("a", {target: "_blank", href: event.payload.issue.html_url}, "issue"), " in ", React.createElement("a", {target: "_blank", href: "https://github.com/" + repo.name}, " ", repo.name)
				), 
				React.createElement("p", {className: "description"}, event.payload.issue.title), 
				React.createElement("p", {className: "date"}, getFromNow(event.created_at))
			)
		);
	}
});


var routes = (
  React.createElement(Route, {name: "app", path: "/", handler: App}, 
    React.createElement(Route, {name: "code", handler: Code}), 
    React.createElement(DefaultRoute, {name: "home", handler: Home})
  )
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById("global-container"));
});
