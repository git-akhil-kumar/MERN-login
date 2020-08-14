import React, { Component } from 'react';
import 'whatwg-fetch';

import {
    getFromStorage,
    setInStorage
} from '../../utils/storage' ;

class Home extends Component {
    constructor(props) {
        super(props); 

        // initialize the state 
        this.state = {
            counter: [],
            isSignedIn: false,
            isLoading: false,
            signUpError: false,
            signInError: false,
        };

        componentDidMount() {
            if(getFromStorage(''))
        }  
    }

    render() {
        const {
            isLoading,
        } = this.state;

        if(isLoading) {  // loader
            return (
                <div>
                    <p>   Loading ..... </p>
                </div>
            );
        }  

        return (
            <div>
                <h1> Hello from carry </h1>
            </div>
        );
    }
}

export default Home;
