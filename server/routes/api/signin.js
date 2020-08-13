const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
      
      app.post('/api/account/signup', (req, res, next) => {
        

        const { body } = req ;
        
        const { 
            firstname,
            lastname,
            password
        } = body ;

        let { email } = body;

        if(!firstname) {

            return res.send({
                success: false,
                message: 'Error: First name can not be blank' 
            })
        } 

        if(!lastname) {

            return res.send({
                success: false,
                message: 'Error: Last name can not be blank' 
            })///
        } 

        if(!email) {

            return res.send({
                success: false,
                message: 'Error: email address can not be blank' 
            })
        } 

        if(!password) {

            return res.send({
                success: false,
                message: 'Error: password can not be blank' 
            })
        } 

        email = email.toLowerCase() ;
        email = email.trim() ;

        const newUser = new User();

        newUser.firstname = firstname;
        newUser.lastname = lastname;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);

        newUser.save((err, user) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }

            return res.send({
                success: true,
                message: 'Signed up'
            });
        })
      });


       /*
       * signin
      */

    app.post('/api/account/signin', (req, res, next) => {

        console.log( '1');
        
        const { body } = req ;
        const {
            password
        } = body;
        
        console.log( '2' );

        let { email } = body;

        if(!email){
            return res.send({
                success: false,
                message: 'Email can not be blank'
            });
        };

        console.log( '3' );

        if(!password){
            return res.send({
                success: false,
                message: 'Password can not be blank'
            });
        };

        email = email.toLowerCase();
        email = email.trim() ;

        console.log( '4' );

        User.find({
                email: email
            }, (err, users) => {
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error: Server Error!!!'
                    });
                }

                console.log( '5' );
                if(users.length == 0){
                    return res.send({
                        success: false,
                        message: 'Error: Invalid 5'
                    })
                }
                const user = users[0];

                console.log( ' dekho users[0] -> ' , user._id);
                if(!user.validPassword(password)){
                    return res.send({
                        success: false,
                        message: 'Error: Invalid'   
                    });
                }

                /* 
                everythings passes
                lets create a new user sessions
                */
                console.log( '6' );
                const usersession = new UserSession();

                usersession.userId = user._id;   // referencing User table _id to userSessionId

                usersession.save((err, doc) => {
                    if(err){
                        res.send({
                            success: false,
                            message: 'Error: Server Error creating user sessions'
                        });
                    }

                    /*
                    created successfully
                    */

                    return res.send({
                        success:true,
                        message: 'User Session created successfully',
                        token: doc._id
                    });
                });
        });

    });
};