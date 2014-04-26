harmonic
========

A music discovery app.

See it live at [http://harmonic.herokuapp.com/](http://harmonic.herokuapp.com/)


API
====


## Authenticate:

`GET /auth/facebook`

If user has previously logged in then redirect to homepage with the flag `success = true` else no flag is set.

## Queue

`GET /nextsong`

Returns 5 next songs in the queue.

	{
		tracks: [
			"https://api.soundcloud.com/tracks/57322132",
			"https://api.soundcloud.com/tracks/98430936",
			"https://api.soundcloud.com/tracks/49813687",
			"https://api.soundcloud.com/tracks/135334184",
			"https://api.soundcloud.com/tracks/117842383"
		]
	}

## Playlist interaction:

### Add song

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

### Remove song

`DELETE /playlist`

(Requires authenticated user)

Form needed:

    songURL: url of a soundcloud song

Returns

	{
		'response' : 'OK'
		'user' : {...}
	}
