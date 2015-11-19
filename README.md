This project is a music player that plays songs from Youtube. Its aim is to provide an easy way to access a curated library of media on any device.

It's up and running at [http://benchristel.github.com/oath-structure](http://benchristel.github.com/oath-structure).

![a screenshot of the application](https://raw.githubusercontent.com/benchristel/oath-structure/gh-pages/screenshot-2015-07-12.png)

## Library File Format

An example `library.txt` file is included in the repository.

The library file organizes songs by artist and _grouping_. A grouping can be an album, or some other category of songs, such as live performances, singles, or full-album tracks.

An example of an artist with two groupings is shown below:

```
Wolf Parade

live
mzx_jpdp8gI I'll Believe in Anything (Live at CMJ 2005)
fYhGCICuTdk This Heart's on Fire (Live on the Late Late Show)
BxNogDqMdFU Language City

8OmL7xO41iA Wolf Parade EP
Kh8-r6O43Rw Shine a Light
veERnHfL59s You Are a Runner and I Am My Father's Son
e126OSZJh08 Disco Sheets
IS9saSyOOvA Lousy Pictures
```

The first grouping contains three live performances. The second is an album titled "Wolf Parade EP" with four songs.

The first line in a grouping is the name of the grouping. If the grouping is an album, the first line should contain a youtube video ID (used to find a thumbnail image of the album art) followed by the name of the album. If the grouping is not an album, the first line should be a short descriptive name, like "live" or "singles". The name must be shorter than 11 characters, to distinguish it from a video ID.

The remaining lines in a grouping describe songs, and consist of a youtube video ID and the title of the song.

Blank lines separate groupings from each other and from artist names.

## Development

You need Ruby and Bundler for local development. Installing Ruby is beyond the scope of this documentation, but if you have it, you can do the following to install the Ruby dependencies:

```bash
gem install bundler
gem install sass

# in the oath-structure directory
bundle install
```

You can then start the server with the `run` script:

```bash
# in the oath-structure directory
./run
```

If you make changes to the .scss files, you will need to run sass to compile them to css.

```bash
sass --watch app.scss:app.css
```

## Contributing

Pull requests, especially to add new content to the library file, are welcome. Fork the repository and develop on the `gh-pages` branch.
