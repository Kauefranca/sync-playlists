# Sync Playlists

A simple project that converts playlists from Youtube to Spotify.

# Requirements
> nodejs & npm

## Instalation

```bash
> git clone https://github.com/Kauefranca/sync-playlists
> cd sync-playlists
> npm install
```

## How to use

This project uses SpotifyOAuth, see [Spotify API documentation](https://developer.spotify.com/documentation/general/guides/authorization/)

Create a file called .env that should look like this:

    client_id=xxxxxxxxxxx
    client_secret=xxxxxxxxxxx
    redirect_uri=http://localhost:8888/callback

For this credentials create a account on [Spotify for Developers](https://developer.spotify.com/) and make sure to add the redirect_url on Dashboard > Edit Settings > Redirect URIs


Now with everything set just run:

```bash
> node index.js
```

If you find some issue fell free to open a [issue](https://github.com/Kauefranca/sync-playlists/issues) or a [pull request](https://github.com/Kauefranca/sync-playlists/pulls)


## Todo
- [x] Full Youtube compability
- [x] Full Spotify compability

## License

[MIT](https://github.com/Kauefranca/sync-playlists/blob/master/LICENSE)

Made with 💜 by Kauê França