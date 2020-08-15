import React, { Component } from 'react';
// import Button from 'react-bootstrap';
import 'whatwg-fetch';

import {
    getFromStorage,
    setInStorage
} from '../../utilis/storage';

class Home extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            signInEmail: '',
            signInPassword: '',
        };

        // binding all the functions ....

        this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this) ;
        this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this) ;
        this.onSignIn =  this.onSignIn.bind(this);

    }

    componentWillMount() 
    {
        const obj = getFromStorage('the_main_app');
        
        if(obj && obj.token)
        {
            // Verify Token ... 
            const { token } = obj ;
            fetch('/api/v1/account/verify?token='+token)
            .then(res => res.json())
            .then(json => {
                if(json.success ){

                    this.setState({
                        token: token,
                        isLoading: false
                    });
                    console.log( ' yes we are here !!! ' ) ;
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                };
            });
        }
        else
        {
            this.setState({
                isLoading: false,
            });
        }
    }

    onTextBoxChangeSignInEmail(event) 
    {
        this.setState({
                signInEmail: event.target.value,
            })
    }

    onTextBoxChangeSignInPassword(event) 
    {
        this.setState({
            signInPassword: event.target.value,
        })
    }

    onSignIn()
    {
        // Post request for Login

        const {
            signInEmail,
            signInPassword
        } = this.state;

        this.setState({
            isLoading: true,
        });

        fetch('/api/v1/account/signin',{
            method: 'POST',
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword
            }),
            headers: {
                "Content-Type":"application/json",
            }
        }).then( res => res.json() )
            .then(json => {
                if(json.success){
                    setInStorage('the_main_app', { token: json.token});
                    this.setState({

                        signInError: json.message,
                        isLoading: false,
                        signInEmail: '',
                        signInPassword: '',    
                        token: json.token,
                    });
                }
                else
                {
                   this.setState({
                        signInError:    json.message,
                        isLoading: false
                    }); 
                }
            })  
        
    }

    render() {
        const {
            isLoading,
            token,
            signInError,
            signInEmail,
            signInPassword
        } = this.state;

        if(isLoading)
        {
            return (
                <div>
                    <p> Loading..</p>
                </div>
            );
        }

        if(!token)
        {
            return (
                <div>
                    { // in-line JSX
                        (signInError) ? 
                        (
                            <p>{signInError}</p>
                            ) : (null)  
                    }
                    <h5>Please Sign In..</h5>
                    <input 
                        type = "email" 
                        placeholder = "Email" 
                        value = {signInEmail}
                        onChange = {this.onTextBoxChangeSignInEmail}
                    />
                    <br/>
                    <br/>
                    <input 
                        type = "password" 
                        placeholder = "Password"
                        value = {signInPassword}
                        onChange = {this.onTextBoxChangeSignInPassword}
                    />
                    <br/>
                    <br/>
                    <Button onClick={this.onSignIn} variant="primary">SignIn</Button>{' '}
                    
                </div>
            );
        }

        return (
            
            <div>   
                <p> Hello</p>
            </div>
           
        );
    }
}

export default Home;
