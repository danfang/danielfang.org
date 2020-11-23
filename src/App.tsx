import {
  faFacebookF,
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKey, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      console.log(data.me);
      this.setState({ me: data.me });
    }
  }

  render() {
    const me = this.state.me;
    let contactNode;
    if (me) {
      contactNode = (
        <div id="contact">
          <a
            target="_blank"
            rel="noreferrer"
            href={"mailto:" + me.contact.email}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a target="_blank" rel="noreferrer" href={me.contact.facebook}>
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a target="_blank" rel="noreferrer" href={me.contact.github}>
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a target="_blank" rel="noreferrer" href={me.contact.linkedin}>
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a target="_blank" rel="noreferrer" href={me.contact.twitter}>
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a target="_blank" rel="noreferrer" href={me.contact.keybase}>
            <FontAwesomeIcon icon={faKey} />
          </a>
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
    if (!me)
      return (
        <div id="home">
          <div className="overview">
            <h1>Daniel Fang</h1>
            <h3>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://api.danielfang.org"
              >
                api.danielfang.org
              </a>
              <span> is currently unavailable!</span>
            </h3>
          </div>
        </div>
      );
    return (
      <div id="home">
        <div className="overview">
          <h1>{me.name || "Daniel Fang"}</h1>
          <p className="bio">{me.bio}</p>
          <p className="current">
            {"Currently working on "}
            <a target="_blank" rel="noreferrer" href={me.currentWork.url}>
              {me.currentWork.name}
            </a>
            .
          </p>
        </div>
        <div id="status" className="row">
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
    return <div id="projects"></div>;
  }
  return (
    <div id="projects">
      {me.projects.map((p: any) => (
        <Project key={p.title} project={p} />
      ))}
    </div>
  );
}

function Project(props: { project: any }) {
  var project = props.project;
  return (
    <div className="project">
      <h1 className="title">
        {project.url ? (
          <a href={project.url}>{project.title}</a>
        ) : (
          project.title
        )}
      </h1>
      <p className="date">{project.date}</p>
      <p className="description">{project.description}</p>
    </div>
  );
}

function Checkin(props: { checkin: any }) {
  var checkin = props.checkin;
  var venue = checkin.venue;
  var mapsURL = "https://www.google.com/maps?z=12&t=m&q=loc:";
  mapsURL += venue.location.lat + "+" + venue.location.lng;
  return (
    <div className="checkin media col-md-4" id="latest-checkin">
      <div className="media-left">
        <a target="_blank" rel="noreferrer" href={mapsURL}>
          <FontAwesomeIcon icon={faMapMarkedAlt} />
        </a>
      </div>
      <div className="media-body">
        <a target="_blank" rel="noreferrer" href={mapsURL}>
          <p className="location title">{checkin.venue.name}</p>
        </a>
        <p className="description">{checkin.shout}</p>
        <p className="date">{getFromNow(checkin.createdAt * 1000)}</p>
      </div>
    </div>
  );
}

function Tweet(props: { tweet: any }) {
  var tweet = props.tweet;
  var twitterURL = "https://twitter.com/" + tweet.user.screen_name;
  return (
    <div className="tweet media col-md-4" id="latest-tweet">
      <div className="media-left">
        <a target="_blank" rel="noreferrer" href={twitterURL}>
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      <div className="media-body">
        <a target="_blank" rel="noreferrer" href={twitterURL}>
          <p className="screenName title">@{tweet.user.screen_name}</p>
        </a>
        <p className="description">{tweet.text}</p>
        <p className="date">{getFromNow(tweet.created_at)}</p>
      </div>
    </div>
  );
}

function getFromNow(date: any) {
  return moment(new Date(date)).fromNow();
}

export default App;
