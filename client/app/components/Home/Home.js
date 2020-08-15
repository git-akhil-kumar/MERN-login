import React, { Component } from 'react';
import Button from 'react-bootstrap';
import 'whatwg-fetch';
import {
    get_logout,
    post_sign_in,
    post_sign_up,
    post_add_course,
    get_courses,
    get_verify,
} from '../../Api/api';

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
        
        console.log(' componentDidMount', obj , obj.token ) ;
        if(obj && obj.token)
        {

            // Verify Token ... 
            const { token } = obj ;
            fetch('/v1/api/account/verify?token=' +token)
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

        fetch(post_sign_in,{
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

    onLogout()
    {
         const {
            token
        } = this.state;

        this.setState({
            isLoading: true,
        });

        fetch(get_logout+token)
            .then( res => res.json() )
            .then(json => {
                if(json.success){
                    setInStorage('the_main_app', { token: ''});
                    this.setState({
                        signInError: json.message,
                        isLoading: false,
                        signInEmail: '',
                        signInPassword: '',    
                        token: '',
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
                    <button onClick={this.onSignIn}>SignIn</button>{' '}
                    
                </div>
            );
        }

        return (
            
            <div>   
                <p> Hello</p>
                <button onClick={this.onLogout}>Logout</button>{' '}
            </div>
           
        );
    }
}

export default Home;
