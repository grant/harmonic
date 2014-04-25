harmonic
========

A music discovery app.

See it live at [http://harmonic.herokuapp.com/](http://harmonic.herokuapp.com/)


API
====


## Authenticate:

`GET /auth/facebook`

If user has previously logged in then returns the user profile else redirects to FB and then returns the user details as JSON.

## Playlist interaction:

`POST /playlist`

(Requires authenticated user)

Adds a song to the users playlist.

Form needed:

    songURL: url of a soundcloud song

Returns

	{
		'response' : 'OK'
		'user' : {...}
	}

`DELETE /playlist`

(Requires authenticated user)

Form needed:

    songURL: url of a soundcloud song

Returns

	{
		'response' : 'OK'
		'user' : {...}
	}