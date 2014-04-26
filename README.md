harmonic
========

A music discovery app.

See it live at [http://harmonic.herokuapp.com/](http://harmonic.herokuapp.com/)


Tech
====

- Heroku
- Node/Express
- Facebook API
- Soundcloud API
- Socket.IO
- Redis
- Mongodb
- Leap Motion
- Stylus
- Jade
- SVG

API
====


## Authenticate:

`GET /auth/facebook`

If user has previously logged in then redirect to homepage with the flag `success = true` else flag is false.

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

`POST /recommendsong`

Send a song recommendation to a different user.

**Parameters:**

`toUserFb` - Facebook user ID of the person who the song is being recommended to
`songURL` - SoundCloud URL of the song

Result: None. Just status code `200`.

## Playlist interaction:

### Get all tracks in playlist

`GET /playlist`

(Requires authenticated user)

Returns:

	{
    	"tracks": [url1, url2, ...]
	}

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
