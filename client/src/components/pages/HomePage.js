import React, { Component } from 'react'
import Header from '../Header'
import Logo from '../Logo'
import Main from '../Main'
import Input from '../Input'
import Textlink from '../Textlink'

class Homepage extends Component {
    state = {
        email: '',
        password: '',
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let userData = this.state
    
        fetch('http://example.com',{
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          }).then(response => {
            response.json().then(data =>{
              console.log("Successful" + data);
            })
        })
      }  

    render() {
        return (
            <React.Fragment>
                <Header>
                    <Logo />
                </Header>
                <Main>
                    <form onSubmit={this.handleSubmit}>
                        <Input 
                            type='email'
                            name='email'
                            placeholder='Email address'
                            value={this.state.email} 
                            onChange={this.handleChange}
                        />
                        <Input 
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={this.state.password} 
                            onChange={this.handleChange}
                        />
                        <Textlink title="Forgot password?" to='/forgotpassword'/>
                        <button>Log In</button>
                    </form>
                </Main>
            </React.Fragment>
        )
    }
}

export default Homepage
