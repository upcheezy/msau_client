import React, { Component } from 'react'
import Main from './main/main'
import Login from './login/Login'
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

export default class App extends Component {

  state = {
    isAuth: false,
    // once in state pass as prop to main
    codes: [],
  }

  // componentDidMount() {
  //   let token = window.localStorage.getItem('token')
  //   if (!token) {
  //     return
  //   }
  //   this.setState({isAuth: true})
  // }

  Login = (loginData) => {
    fetch("http://localhost:8000/login", {
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
        console.log(data)
        if (data.token) {
          window.localStorage.setItem('token',data.token)
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
    fetch("http://localhost:8000/code", {
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
        console.log(data)
        this.setState({
          geomData: data.rows
        })
        // console.log(data)
      })
      .catch((error) => this.setState({ error }));
  }

  Signup = (SignupData) => {
    fetch("http://localhost:8000/signup", {
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
    console.log(this.state.isAuth)
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
          <Route path='/' render={() => (<Main geomData={this.state.geomData} codes={this.state.codes}/>)} ></Route>
        </Switch>
      ) 
    }
    return (
      <div>
        {routes}
      </div>
    )
  }
}

