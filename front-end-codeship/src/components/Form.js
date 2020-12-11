import React, { Component } from "react";
// import axios from 'axios';

const initialState = {
  username: "",
  name: "",
  lastname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  description: "",
  image: "",
  errors: []
}

class Form extends Component {

    state= initialState;

  //track the change of input values and keep in sync with the state object
  changeHandler = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  //form validation
  validate = () => {
    
    let errors= [];
 
    if(this.state.username.length < 3){
      errors[0] = "Username should not be shorter than 3 characters";
    }
    if(this.state.username.length > 15){
      errors[0] = "Username should not be longer than 15 characters";
    }
    if(this.state.name.length < 3){
      errors[1] = "Name should not be shorter than 3 characters";
    }
    if(this.state.name.length > 12){
      errors[1] = "Name should not be longer than 12 characters";
    }

    if(this.state.lastname.length < 3){
      errors[2] = "Lastname should not be shorter than 3 characters";
    }

    if(this.state.lastname.length > 15){
      errors[2] = "Lastname should not be longer than 15 characters";
    }

    if(!this.state.email.includes('@')){
      errors[3] = "Mail should have an email format '@' "
    }

    if(!this.props.update && this.state.password < 6){
      errors[4] = "Password should be longer than 6 characters";
    }

    if(!this.props.update && this.state.passwordConfirm !== this.state.password){
      errors[5] = "Password does not match";
    }

    if(this.state.description > 250){
      errors[6] = "Description can't be longer than 250 characters"
    }

    if(errors.length > 0){
      console.log(errors)
      this.setState({errors });
      return false;
    }
    return true;
  };

  //submit handler
  
  submitHandler = e => {
    e.preventDefault()
    console.log(this.validate())
    const isValid = this.validate();
   

    if(isValid) {
      console.log(this.state)
      const body = new FormData(document.getElementById('form-register'));
      fetch('https://codeship-api.herokuapp.com/public/user',{method: "PUT", body: body})
      .then(response => {
        return response.json() //or .text you get a string
      }).then(data => {
        console.log(data)
      })
      .catch(error=> {
        console.log(error)
      })
      //clear Form if it's valid
      this.setState(initialState);

    }

   }

   submitUpdate = e => {
    e.preventDefault()
    const isValid = this.validate();
    if(isValid) {
      console.log(this.state)
      const token = sessionStorage.getItem("codeship-token")
      const body = new FormData(document.getElementById('form-register'));
      fetch('https://codeship-api.herokuapp.com/user',{method: "PATCH", body: body, headers:{"x-access-token":token}})

      .then(response => {
        return response.json()
      }).then(data =>{
        console.log(data)
      })
      .catch(error=> {
        console.log(error)
      })
      //clear Form if it's valid
      this.setState(initialState);
    }
   }

 render(){

  const {username, name, lastname, email, password, passwordConfirm, description, image} = this.state

  //register/update button display
  let myButton;
  if(this.props.register){
    myButton = <button type="submit"> Register </button>
  } else {
    myButton = <button type="submit"> Update </button>}

    let passwords;
  if(this.props.update){
    passwords = <div></div>

  } else {
    passwords = <div>
    <div>
    <label for="password">Password</label>
    <input type="text" id="password" name="password" value={password} onChange={this.changeHandler}placeholder="write a password"></input>
  </div>
  <div>{this.state.errors[4]}</div>
  <div>
    <label for="passwordConfirm">Confirm Password</label>
    <input type="text" id="passwordConfirm" name="passwordConfirm" value={passwordConfirm} onChange={this.changeHandler}placeholder=" confirm password"></input>
  </div>
  <div>{this.state.errors[5]}</div>
</div>}
  
  let button
  return (

    <form id="form-register" class="form-container" onSubmit={this.props.update?this.submitUpdate:this.submitHandler}>
            <div className="actual-form">
            <div className="image-register-container">
            <div>
                  <label for="image">Add Image</label>
                  <input type="image" id="image" name="image" value={image} onChange={this.changeHandler}placeholder="Upload a profile picture"></input>
                </div>
                <div>{this.state.imageError}</div>
            </div>
            <div className="form-register-container">
            <div>
                  <label for="username">Username</label>
                  <input type="text" id="username" name="username" value={username} onChange={this.changeHandler}placeholder="write your name"></input>
                </div>
               <div>{this.state.errors[0]}</div>
               <div>
                  <label for="name"> Name</label>
                  <input type="text" id="name" name="name" value={name} onChange={this.changeHandler}placeholder="write your name"></input>
                </div>
                <div>{this.state.errors[1]}</div>
                <div>
                  <label for="lastname"> Last name</label>
                  <input type="text" id="lastname" name="lastname" value={lastname} onChange={this.changeHandler}placeholder="write your last name"></input>
                </div>
                <div>{this.state.errors[2]}</div>
                <div>
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" value={email} onChange={this.changeHandler}placeholder="write your email"></input>
                </div>
                <div>{this.state.errors[3]}</div>
                  {passwords}
                <div>
                  <label for="description">Description</label>
                  <input type="text" id="description" name="description" value={description} onChange={this.changeHandler}placeholder="write a description"></input>
                </div>
                <div>{this.state.descriptionError}</div>
                {myButton}
            </div>
          </div>
        </form>
  );
}
}

export default Form;
