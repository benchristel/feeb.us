This project is a music player that plays songs from Youtube. Its aim is to provide an easy way to access a curated library of media on any device.

![a screenshot of the application](https://raw.githubusercontent.com/benchristel/oath-structure/gh-pages/screenshot-2015-07-12.png)

## Library File Format

An example `library.txt` file is included in the repository.

Songs in a library file are grouped by artist and album. A line that stands alone, surrounded by blank lines, is an _artist name_, and any albums that follow it will be associated with that artist.

Albums are separated by blank lines. The first line of an album entry is the title of the album; the remaining lines are songs.

## Development

You need Ruby and Bundler for local development. Installing Ruby is beyond the scope of this documentation, but if you have it, you can do the following to install the Ruby dependencies:

```bash
gem install bundler

# in the oath-structure directory
bundle install
```

You can then start the server with the `run` script:

```bash
# in the oath-structure directory
./run
```

## Contributing

Pull requests, especially to add new content to the library file, are welcome. Fork the repository and develop on the `gh-pages` branch.
