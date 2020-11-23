import moment from "moment";
import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";

const API_URL = "https://api.danielfang.org/";

interface State {
  me?: any;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const r = await fetch(API_URL);
    if (r) {
      const data = await r.json();
      this.setState({ me: data.me });
    }
  }

  render() {
    const me = this.state.me;
    let contactNode;
    if (me) {
      contactNode = (
        <div>
          {me.contact.map((c: any) => (
            <a
              key={c.name}
              target="_blank"
              rel="noreferrer"
              href={c.link}
              style={{ marginRight: 5 }}
            >
              {c.name}
            </a>
          ))}
        </div>
      );
    }
    return (
      <Router>
        <header id="nav">
          <ul>
            <li className="nav-link">
              <Link to="">Home</Link>
            </li>
            <li className="nav-link">
              <Link to="projects">Projects</Link>
            </li>
            <li className="nav-link">
              <a target="_blank" rel="noreferrer" href="resume.pdf">
                R&eacute;sum&eacute;
              </a>
            </li>
          </ul>
        </header>
        <div id="content">
          <Switch>
            <Route path="/" exact>
              <Home me={me} />
            </Route>
            <Route path="/projects" exact>
              <Projects me={me} />
            </Route>
          </Switch>
        </div>
        <footer>
          <p>
            Made with{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/danfang/me-api"
            >
              danfang/me-api
            </a>
          </p>
          {contactNode}
        </footer>
      </Router>
    );
  }
}

interface HomeState {
  tweets: any[];
  checkins: any[];
}

class Home extends React.Component<{ me?: any }, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = { tweets: [], checkins: [] };
  }

  async componentDidMount() {
    const t = await fetch(API_URL + "twitter");
    const tweets = t.ok ? ((await t.json()) as any).tweets : [];

    const l = await fetch(API_URL + "location");
    const location = l.ok ? await l.json() : [];

    this.setState({ tweets: tweets, checkins: location.checkins.items });
  }

  render() {
    var me = this.props.me;
    let description;
    if (!me) {
      description = (
        <h3>
          <a target="_blank" rel="noreferrer" href="https://api.danielfang.org">
            api.danielfang.org
          </a>
          <span> is currently unavailable!</span>
        </h3>
      );
    } else {
      description = (
        <div>
          <p>{me.bio}</p>
          <p>
            {"Currently working on "}
            <a target="_blank" rel="noreferrer" href={me.currentWork.url}>
              {me.currentWork.name}
            </a>
            .
          </p>
        </div>
      );
    }
    return (
      <div>
        <div>
          <h1>{me?.name || "Daniel Fang"}</h1>
          {description}
        </div>
        <div>
          {this.state.tweets.length > 0 && (
            <Tweet tweet={this.state.tweets[0]} />
          )}
          {this.state.checkins.length > 0 && (
            <Checkin checkin={this.state.checkins[0]} />
          )}
        </div>
      </div>
    );
  }
}

function Projects(props: { me?: any }) {
  var me = props.me;
  if (!me) {
    return null;
  }
  return (
    <div>
      {me.projects.map((p: any) => (
        <Project key={p.title} project={p} />
      ))}
    </div>
  );
}

function Project(props: { project: any }) {
  var project = props.project;
  return (
    <div>
      <h2>
        {project.url ? (
          <a href={project.url}>{project.title}</a>
        ) : (
          project.title
        )}
      </h2>
      <p>{project.date}</p>
      <p>{project.description}</p>
    </div>
  );
}

function Checkin(props: { checkin: any }) {
  var checkin = props.checkin;
  var venue = checkin.venue;
  var mapsURL = "https://www.google.com/maps?z=12&t=m&q=loc:";
  mapsURL += venue.location.lat + "+" + venue.location.lng;
  return (
    <div>
      {"Visited "}
      <a target="_blank" rel="noreferrer" href={mapsURL}>
        {checkin.venue.name}
      </a>{" "}
      {getFromNow(checkin.createdAt * 1000)}.
    </div>
  );
}

function Tweet(props: { tweet: any }) {
  var tweet = props.tweet;
  var twitterURL = "https://twitter.com/" + tweet.user.screen_name;
  return (
    <p>
      <a target="_blank" rel="noreferrer" href={twitterURL}>
        @{tweet.user.screen_name}
      </a>
      : {tweet.text}
    </p>
  );
}

function getFromNow(date: any) {
  return moment(new Date(date)).fromNow();
}

export default App;
