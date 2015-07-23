from numpy import genfromtxt

import pandas as pd
import json
import re

df = pd.read_csv( "/Users/alexlerman/Downloads/azlyrics-gt.csv", delimiter = ",", quotechar='"', skipinitialspace=True)
music_file = open("music.json", 'w')

music_object = {"artists":{}}

# test = ' album: "Scare Force One" (2014) album: "Scare Force One" (2014)  '
def parseAlbumName(text):
    # album_name = re.findall('"([^"]*)"', text)
    album_name = re.findall('\: \"(.+?)\" \(', text)
    # year = re.findall('[(]([^"]*)[)]', text)
    year = re.findall('[(](.+?)[)]', text)

    if year != []:
        year = year[0]
        try:
            int(year)
        except:
            year = 0
    else:
        year = 0
    if len(album_name) == 2:
        album_name = album_name[1]
    elif year != 0 and len(album_name) == 1:
        album_name = album_name[0]
    elif text == " autres chansons: other songs: ":
        album_name = "Single"
    else:
        album_name = None
    if album_name != None:
        print album_name
    return album_name, year

def parseAlbumInfo(info):
    album_info = json.loads(info)
    album = None
    result = {}
    for info in album_info:
        print album
        print info
        new_album, year = parseAlbumName(info["album_info"])
        if new_album == None:
            if album != None:
                result[album]["songs"].append(info["album_info"])
            else:
                album = "Unknown"
                result[album] = {"year": year, "songs": [] }
                result[album]["songs"].append(info["album_info"])
        else:
            album = new_album
            result[new_album] = {"year": year, "songs": [] }
    return result


for index, row in df.iterrows():
    print row["artist"]
    music_object["artists"][row["artist"]] = parseAlbumInfo(row["album_info"])


music_file.write(json.dumps(music_object))
music_file.close()
