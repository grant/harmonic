PlaySink
====

Required downloads are NodeJS and MongoDB. Do an `sudo npm install` downloads the dependencies (**angular, express, jade, mongodb, mongoose**). 

- Angular is used for data injections in the page. Has not been implemented yet since we haven't gotten to a place that acutal requires this. It makes the MVC design much better from my understanding. 
- Express is the framework that handles routes and making the server. So far this has made the code more readable. 
- Jade gets compiled into html it will help the future so we can reuse pages and what not and apparently jade and angular work well with each other. 
- Mongodb is the database we are using that uses JSON as the data being stored. I'm not entirely sure that this is what we should be using but we can do a lot with it and it is supposed to be fairly easy. 
- Mongoose makes it "easy" to work with MongoDB.

    - Install node
    - Install express (`npm install -g express`)
    - Create express project (`express --sessions nodetest1`)
    - Edit dependencies
    - `npm install`
    - Install mongodb system-wide
    - Navigate to `data/` and run `mongod --dbpath /path/to/data_folder` to start the db server
    - Then `node app.js` start the app.

- Passport for user authentication.
- smog used for mongo ui (kinda like admin)
    
        $ npm install smog -g
        $ smog

### Code structure

	|-- app.js        /* The application code itself       */
	|-- config        /* Application settings              */
	|   |-- middlewares
	|-- data          /* MongoDB database files            */
	|-- models        /* Models (classes) for everything   */
	|-- public        /* Publicly accessible resources     */
	|   |-- images
	|   |-- javascripts
	|   |-- stylesheets 
	|-- routes        /* The URL routes                    */
	|-- tests         /* Should hold all unit tests        */
	|-- views         /* The templates for the 'views'     */
	|   |-- errors
	|   |-- includes
	|   |-- layouts
	|   |-- users

## Current workflow

- Show homepage with a header
- Users can signup or signin
- If they try to access dashboard without signing in, they are redirected to signin page
- Upon registering, user is taken to the dashboard
- An authenticated user accessing homepage, signup or signin page is redirected to dashboard.
- Users who choose to sign in with Google, Facebook, or Twitter, will be redirected to the respective page and users have to allow us to access their information (email/name)
- Validation is checked amoung username and password, users with same Facebook and Google emails with get an error thrown since there can't be duplicates.
- If a user signs in with FB and Google with same email, the first strategy is used and second one is not added to the DB.

### Facebook Login

To login using facebook you must go to the url http://localhost:8888/auth/facebook and it will ask you on your facebook profile to use just your email address. Once you hit accept it will redirect you to your dashboard.

### Twitter Login

To login using Twitter you must go to the url
http://localhost:8888/auth/twitter and it will ask you to sign in or if you are logged in it will ask for permission to use. Once accespted it will take you to your dashboard. A porblem is that twitter doesn't give use acess to the email which I'm not sure if we need it or not.

### Google Login

To login using Google you must go to the url
http://localhost:888/auth/google and it will show you all your google accounts. Selct the one that you want to use.

### The server

After downloading mongodb you need to connect to the database and start it. This can be done by using the commmand in terminal `mongod --dbpath ~/path/to/PlaySink/data` and it should start listening. In another tab you can start a `mongo` shell. Just to see if the data is there you can do the following commands.

    use playsinkdb  // database to use

    db.usercollection.find().pretty()

    db.usercollection.insert({"username": name, "password": pass, "email": email}) // it uses JSON which is awesome make sure you enter it in all the same way


### Links that have helped

- http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
- http://mean.io/
- https://github.com/linnovate/mean
- https://github.com/madhums/node-express-mongoose-demo
- http://howtonode.org/express-mongodb