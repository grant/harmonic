harmonic
========

A music discovery app.

See it live at [http://harmonic.herokuapp.com/](http://harmonic.herokuapp.com/)


API
====


## Authenticate:

`GET /auth/facebook`

If user has previously logged in then returns the user profile else redirects to FB and then returns the user details as JSON.