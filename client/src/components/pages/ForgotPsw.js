import React, { Component } from 'react'
import Header from '../Header'
import Logo from '../Logo'
import Main from '../Main'
import Input from '../Input'
import BackBtn from '../BackBtn'

class Homepage extends Component {
    state = {
        email: '',
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <React.Fragment>
                <Header>
                    <BackBtn />
                    <Logo />
                </Header>
                <Main>
                    <form>
                        <Input 
                            type='email'
                            name='email'
                            placeholder='Email address'
                            value={this.state.email} 
                            onChange={this.handleChange}
                        />
                        <button>Recover Password</button>
                    </form>
                </Main>
            </React.Fragment>
        )
    }
}

export default Homepage