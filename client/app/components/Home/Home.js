import React, { Component } from 'react';
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
    }

    componentWillMount() 
    {
        const token = getFromStorage('the_main_app');

        if(token)
        {
            // Verify Token ... 
            fetch('/api/v1/account/verify?token='+token)
            .then(res => res.json())
            .then(json => {
                if(json.success ){

                    this.setState({
                        token: token,
                        isLoading: false
                    });
                    console.log( ' yes we are here !!! ' ) ;
                }else{
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
        else
        {
            this.setState({
                isLoading: false,
            })
        }
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
                    <p>Please sign in ... </p>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={signInEmail}
                        
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={signInPassword}
                        
                    />
                    <button>Sign In</button>  
                </div>

                
            );
        }

        return (
         
            <div>
                <p> hello </p>
            </div>
           
        );
    }
}

export default Home;
