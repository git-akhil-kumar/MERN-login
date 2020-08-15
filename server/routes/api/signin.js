const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const Course = require('../../models/Course');

module.exports = (app) => {
      
    app.get('/v1/api/account', (req, res, next) => {
        // Get all data of active the user
        User.find({
            
        } ) 
     })

    app.post('/v1/api/account/signup', (req, res, next) => {
        

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

    app.post('/v1/api/account/signin', (req, res, next) => {

        console.log( '1');
        
        const { body } = req ;
        const {
            password
        } = body;
        

        let { email } = body;

       // console.error( ' body', req);

        if(!email){
            return res.send({
                success: false,
                message: 'Email can not be blank'
            });
        };

        if(!password){
            return res.send({
                success: false,
                message: 'Password can not be blank'
            });
        };

        email = email.toLowerCase();
        email = email.trim() ;

        User.find({
                email: email
            }, (err, users) => {
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error: Server Error!!!'
                    });
                }
                
                if(users.length == 0){
                    return res.send({
                        success: false,
                        message: 'No User Found'
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
                        token: doc._id,
                        data: user,
                    });
                });
        });});

    app.get('/v1/api/account/verify', (req, res, next) => {
        // get the token id
        const { query } = req;

        const { token } = query;

        // verify the session token and make sure its not deleted

        // find the token id and 
        UserSession.find({ 
            _id: token    ,                                       // finding perimeters 
            isDeleted: false
        },(err, sessions) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            };
            
            if(sessions.length == 0 ){
                return res.send({
                    success: false,
                    message: 'Error: sessions object empty'
                });
            }else{
                return res.send({
                    success: true,
                    message: 'Success Login Token Id'
                })
            }
        })
        });

    app.get('/v1/api/account/logout', (req, res, next) =>{
        const { query } = req;
        const { token } = query;

        UserSession.findOneAndUpdate({ 
            _id: token,                                       // finding perimeters 
            isDeleted: false
        },{
            $set: {
                isDeleted: true
            }                                                     // updating parameters
        },  null ,(err ,sessions) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            };
            
            if(!sessions){
                return res.send({
                    success: false,
                    message: 'Not an active token..',
                });
            }
            console.log( ' Sessions : ', sessions);
            if(sessions.length === 0  ){
                return res.send({
                    success: false,
                    message: 'Error: sessions object empty'
                });
            }else{
                return res.send({
                    success: true,
                    message: 'Successfully logout !!'
                });
            };
        });
        });

    app.post('/v1/api/courses/add', (req, res, next) => {
        
        const { body } = req ;
        
        const { 
            name,
            details
        } = body ;

        if(!name) {

            return res.send({
                success: false,
                message: 'Error: Course name can not be blank' 
            })
        } 

        if(!details) {

            return res.send({
                success: false,
                message: 'Error: details can not be blank' 
            })///
        } 

        const newCourse = new Course();

        newCourse.name = name;
        newCourse.details = details;

        newCourse.save((err, user) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }

            return res.send({
                success: true,
                message: 'Course Added',
                data: newCourse,
            });
        })
      });

    app.get('/v1/api/courses', (req, res, next) => {
        Course.find((err, result) => {
            if(err) 
            {
                return res.status(500).send(err);
            }
            return res.send({
                success: true,
                message: 'All courses fetched successfully !!',
                data: result,
            });
        });
     }); 

};
