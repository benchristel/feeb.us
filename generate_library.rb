require 'rubygems'
gem 'google-api-client', '>0.7'
require 'google/api_client'
require 'json'
# require 'trollop'

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Credentials
# tab of
# {{ Google Cloud Console }} <{{ https://cloud.google.com/console }}>
# Please ensure that you have enabled the YouTube Data API for your project.
DEVELOPER_KEY = 'AIzaSyAczs-SDisyMN5g7gG3VmxdllnLW0Bjn98'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

def get_service
  client = Google::APIClient.new(
    :key => DEVELOPER_KEY,
    :authorization => nil,
    :application_name => $PROGRAM_NAME,
    :application_version => '1.0.0'
  )
  youtube = client.discovered_api(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION)

  return client, youtube
end

def seachYoutube(query)
  client, youtube = get_service
  begin
    # Call the search.list method to retrieve results matching the specified
    # query term.
    search_response = client.execute!(
      :api_method => youtube.search.list,
      :parameters => {
        :part => 'snippet',
        :q => query,
        :maxResults => 5,
        :order => "relevance",
        :type => "video"
      }
    )
    videos = []

    # Add each result to the appropriate list, and then display the lists of
    # matching videos, channels, and playlists.
    search_response.data.items.each do |search_result|
      case search_result.id.kind
        when 'youtube#video'
          videos << search_result
        # when 'youtube#channel'
        #   channels << "#{search_result.snippet.title} (#{search_result.id.channelId})"
        # when 'youtube#playlist'
        #   playlists << "#{search_result.snippet.title} (#{search_result.id.playlistId})"
      end
    end

    if videos.length > 0
      return videos[0]
    else
      return nil
    end
  rescue Google::APIClient::TransmissionError => e
    puts e.result.body
  end
end

def getYoutubeId(artist, album_name, song)
  query = "\"#" + (artist.gsub(/\p{^Alnum}/, '')) + "\" " + song
  puts query
  result = seachYoutube(query)
  if result == nil or result.snippet.channelTitle != ""
    query = artist + " " + song + " lyrics"
    puts query
    result = seachYoutube(query)
    if result == nil
      return nil
    else
      return result.id.videoId
    end
  end
  result.id.videoId
end

def getAlbumArt(album, artist)
  query = album + " " + artist
  result = seachYoutube(query)
  if result != nil
    return result.id.videoId
  else
    return nil
  end
end

def processArtistName(artist)
  arr = artist.split(",")
  if arr[1] == " THE"
    return "THE #{arr[0]}"
  elsif arr.length  == 2
    return "#{arr[1]} #{arr[0]}"
  else
    return artist
  end
end

# def main
#   file = File.read('music.json')
#   File.open('huge_library.txt', 'w') do |new_file|
#     music = JSON.parse(file)
#     music["artists"].each do |artist, albums|
#       artist = processArtistName(artist)
#       new_file.puts "\n\n8l_CUdj6u7I #{artist}"
#       puts artist
#       albums.each do |album_name, album_obj|
#         album_art_id = getAlbumArt(album_name, artist)
#         if album_art_id == nil
#           album_art_id = "NOART------"
#         end
#         # print "\n#{album_art_id}  #{album_name}"
#         new_file.puts "\n" + album_art_id + " " + album_name + ""
#         album_obj["songs"].each do |song|
#           song_id = getYoutubeId(artist, album_name, song)
#           if song_id == nil
#             song_id = "CantFind---"
#           end
#           new_file.puts "#{song_id} #{song}"
#         end
#       end
#     end
#   end
# end
#
#
# def startInMiddle(starting_artist)
#   file = File.read('music.json')
#   File.open('/Users/alexlerman/oath-structure/huge_library.txt', 'a') do |new_file|
#     music = JSON.parse(file)
#     music_keys = music["artists"].keys
#     start_index = music_keys.find_index(starting_artist)
#     puts start_index
#     puts music_keys.length
#     new_music = {}
#     arr = (start_index..music_keys.length).to_a
#     arr.map {|n| new_music[music_keys[n]] = music["artists"][music_keys[n]]}
#     # puts new_music.inspect
#     new_music.each do |artist, albums|
#       artist = processArtistName(artist)
#       new_file.puts "\n\n8l_CUdj6u7I #{artist}"
#       puts artist
#       albums.each do |album_name, album_obj|
#         album_art_id = getAlbumArt(album_name, artist)
#         if album_art_id == nil
#           album_art_id = "NOART------"
#         end
#         # print "\n#{album_art_id}  #{album_name}"
#         new_file.puts "\n" + album_art_id + " " + album_name + ""
#         album_obj["songs"].each do |song|
#           song_id = getYoutubeId(artist, album_name, song)
#           if song_id == nil
#             song_id = "CantFind---"
#           end
#           new_file.puts "#{song_id} #{song}"
#         end
#       end
#     end
#   end
# end

def findPlace(artist)
  file = File.read('music.json')
  music = JSON.parse(file)
  music_keys = music["artists"].keys
  start_index = music_keys.find_index(artist)
  puts start_index
  puts music_keys.length

end

# startInMiddle("SWANS")
findPlace("EMERY")
# puts getYoutubeId("MICHAEL BUBLE", "album_name", "Quando Quando Quando")
# main
