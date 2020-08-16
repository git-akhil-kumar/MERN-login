import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
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
    setInStorage,
    removeInStorage,
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
        this.onLogout = this.onLogout.bind(this);

    }

    componentWillMount() 
    {
        const obj = getFromStorage('the_main_app');
        if(obj && obj.token)
        {
            // Verify Token ... 
            const { token } = obj ;
            fetch(get_verify +token)
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

        fetch(get_logout+token)
            .then( res => res.json() )
            .then(json => {
                if(json.success){
                    removeInStorage(token);
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
                <div className="container" style={{marginBottom:'200px',marginTop:'200px'}}>
                    <div className="row">
                        <div className="col"></div>
                        <div className="col">
                            <div className="row" style={{justifyContent:'center'}}>
                                { // in-line JSX
                                (signInError) ? 
                                (
                                    <p>{signInError}</p>
                                    ) : (null)  
                                }
                                <h2>Login to your account</h2>
                            </div>

                            <div className="row">
                                <input 
                                    style={{width:'100%',marginBottom: '10px'    }}
                                    type = "email" 
                                    placeholder = "Email" 
                                    value = {signInEmail}
                                    onChange = {this.onTextBoxChangeSignInEmail}
                                />
                                <input 
                                    style={{width:'100%',marginBottom: '10px'}}
                                    type = "password" 
                                    placeholder = "Password"
                                    value = {signInPassword}
                                    onChange = {this.onTextBoxChangeSignInPassword}
                                />
                            </div>

                            <div className="row" >
                                 <button style={{width:'100%'}} type='button' className='btn btn-secondary' onClick={this.onSignIn}>Login</button>{' '}
                            </div>

                            <div className='row' style={{marginTop:'4px'}}>
                                <h6 style={{fontSize:'9px'}}>Don't have an account? </h6>
 
                                <h6 style={{display:'block',marginRight:'0',marginLeft:'auto',fontSize:'9px'}}>Forgot Password ?</h6>
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            );
        }

        return (
            
            <div className="container">   
                <p> Hello</p>

                <Button onClick={this.onLogout}>Logout</Button>{' '}
            </div>
           
        );
    }
}

export default Home;
