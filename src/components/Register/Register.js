import React from "react";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registeredUserName: "",
      registeredEmail: "",
      registeredPassword: "",
    };
  }

  OnRegisteredUserNameChange = (event) => {
    this.setState({ registeredUserName: event.target.value });
  };

  OnRegisteredEmailChange = (event) => {
    this.setState({ registeredEmail: event.target.value });
  };

  OnRegisteredPasswordChange = (event) => {
    this.setState({ registeredPassword: event.target.value });
  };

  OnRegisterClick = () => {
    fetch("http://localhost:5000/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.registeredUserName,
        email: this.state.registeredEmail,
        password: this.state.registeredPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user) {
          this.props.onLoadUser(user);
          this.props.onRouteChange("Home");
        }
      });
  };

  render() {
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="user-name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="user-name"
                  id="user-name"
                  onChange={this.OnRegisteredUserNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.OnRegisteredEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.OnRegisteredPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.OnRegisterClick}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
