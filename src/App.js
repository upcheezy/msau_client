import React, { Component } from 'react'
import Main from './main/main'
import Login from './login/Login'
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "./App.css";

export default class App extends Component {

  state = {
    isAuth: false,
    // once in state pass as prop to main
    codes: [],
    spinner: false,
    background: false,
  }

  componentDidMount() {
    let token = window.localStorage.getItem('token')
    if (!token) {
      return
    }
    let edate = window.localStorage.edate
    if (new Date(edate) <= new Date()) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('codes')
      window.localStorage.removeItem('edate')
    } else {
      let codes = window.localStorage.getItem('codes')
      codes = [{codes:codes.split(' ')}]
      this.setState({isAuth: true, codes: codes})
      this.getGeom({token})
    }
  }

  Login = (loginData) => {
    fetch("https://msauserver.sc811.com//login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data)
        if (data.token) {
          // todo set expiration date in local storage as well
          let today = new Date()
          let hours = today.getHours() + 1
          let expNumber = today.setHours(hours)
          let expirationDate = new Date(expNumber)
          window.localStorage.setItem('edate', expirationDate)
          window.localStorage.setItem('token', data.token)
          window.localStorage.setItem('codes',data.codes.rows[0].codes.join(' '))
          this.setState({
            isAuth: true,
            // insert codes into state
            codes: data.codes.rows
          })
          this.getGeom(loginData)
          this.props.history.push('/')
        }
      })
      .catch((error) => this.setState({ error }));
  }

  getGeom = (loginData) => {
    this.handleSpinner();
    fetch("https://msauserver.sc811.com//code", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data)
        this.setState({
          geomData: data.rows
        })
        // console.log(data)
        this.handleSpinner();
      })
      .catch((error) => this.setState({ error }));
  }

  handleSpinner = () => {
    // console.log("spinning");
    this.setState({spinner: !this.state.spinner})
  };

  handleBackground = () => {
    this.setState({background: !this.state.background})
  }

  Signup = (SignupData) => {
    fetch("https://msauserver.sc811.com//signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(SignupData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(() => {
        this.Login(SignupData)
      })
      .catch((error) => this.setState({ error }));
  }

  render() {
    // protected routes
    // console.log(this.state.isAuth)
    let routes = (
      <Switch>
        <Route path='/' render={() => (<Login onLogin={this.Login}/>)}>
        </Route>
      </Switch>
    )
    if (this.state.isAuth) {
      routes = (
        <Switch>
          {/* change component to render like above and pass the state codes to main */}
          <Route path='/' render={() => (<Main geomData={this.state.geomData} codes={this.state.codes} spinner={this.state.spinner} handleSpinner={this.handleSpinner}/>)} ></Route>
        </Switch>
      ) 
    }
    return (
      <div>
        {this.state.spinner ? (<div className='spinner-background'>
          <div className='spinner'></div>
        </div>
        ) : ''
        }
        {routes}
      </div>
    )
  }
}

