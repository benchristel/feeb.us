This project is a music player that plays songs from Youtube. It fetches the artist and album information from the Spotify API. Its aim is to provide an easy way to create and access a curated library of media on any device.

It's up and running at [http://feeb.us](http://feeb.us).

![a screenshot of the application](https://raw.githubusercontent.com/benchristel/feeb.us/gh-pages/Screen%20Shot%202016-07-12%20at%2011.12.25%20PM.png)


## Development

You need Ruby and Bundler for local development. Installing Ruby is beyond the scope of this documentation, but if you have it, you can do the following to install the Ruby dependencies:

```bash
gem install bundler
gem install sass

# in the feeb.us directory
bundle install
```

You can then start the server with the `run` script:

```bash
# in the feeb.us directory
./run
```

If you make changes to the .scss files, you will need to run sass to compile them to css.

```bash
sass --watch app.scss:app.css
```

## Contributing

Pull requests, especially to add new content to the library file, are welcome. Fork the repository and develop on the `gh-pages` branch.
