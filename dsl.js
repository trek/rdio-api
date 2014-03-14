/*
  I borrowed this methodology from https://github.com/nixme/rdio-ruby, but adapted it
  to javascript, obviously. The data is:

  rdionMethodName: [ authenticationRequired?, ['required', 'keys'], ['optional', 'keys']]

  It generate the methods added to the Rdio prototype
*/
exports = {
  // Core
  get:                            [false, ['keys'], ['extras', 'options']],
  getObjectFromShortCode:         [false, ['short_code'], ['extras']],
  getObjectFromUrl:               [false, ['url'], ['extras']],

  // Catalog
  getAlbumsByUPC:                 [false, ['upc'], ['extras']],
  getAlbumsForArtist:             [false, ['artist'], ['featuring', 'extras', 'start', 'count']],
  getTracksByISRC:                [false, ['isrc'], ['extras']],
  getTracksForArtist:             [false, ['artist'], ['appears_on', 'extras', 'start', 'count']],
  search:                         [false, ['query', 'types'], ['never_or', 'extras', 'start', 'count']],
  searchSuggestions:              [false, ['query'], ['extras']],

  // Collection
  addToCollection:                [true,  ['keys'], []],
  getAlbumsForArtistInCollection: [false, ['artist'], ['user', 'extras']],
  getAlbumsInCollection:          [false, [], ['user', 'start', 'count', 'sort', 'query', 'extras']],
  getArtistsInCollection:         [false, [], ['user', 'start', 'count', 'sort', 'query', 'extras']],
  getTracksForAlbumInCollection:  [false, ['album'], ['user', 'extras']],
  getTracksForArtistInCollection: [false, ['artist'], ['user', 'extras']],
  getTracksInCollection:          [false, [], ['user', 'start', 'count', 'sort', 'query', 'extras']],
  removeFromCollection:           [true,  ['keys'], []],
  setAvailableOffline:            [true,  ['keys', 'offline'], []],

  // Playlists
  addToPlaylist:                  [true,  ['playlist', 'tracks'], []],
  createPlaylist:                 [true,  ['name', 'description', 'tracks'], ['extras']],
  deletePlaylist:                 [true,  ['playlist'], []],
  getPlaylists:                   [true,  [], ['extras']],
  removeFromPlaylist:             [true,  ['playlist', 'index', 'count', 'tracks'], []],
  setPlaylistCollaborating:       [true,  ['playlist', 'collaborating'], []],
  setPlaylistCollaborationMode:   [true,  ['playlist', 'mode']],
  setPlaylistFields:              [true,  ['playlist', 'name', 'description'], []],
  setPlaylistOrder:               [true,  ['playlist', 'tracks'], []],

  // Social Network
  addFriend:                      [true,  ['user'], []],
  currentUser:                    [true,  [], ['extras']],
  findUser:                       [false, [], ['email', 'vanityName', 'extras']],
  removeFriend:                   [true,  ['user'], []],
  userFollowers:                  [false, ['user'], ['start', 'count', 'extras']],
  userFollowing:                  [false, ['user'], ['start', 'count', 'extras']],

  // Activity and Statistics
  getHeavyRotation:               [false, [], ['user', 'type', 'friends', 'limit', 'start', 'count', 'extras']],
  getActivityStream:              [false, ['user', 'scope'], ['last_id', 'extras']],
  getNewReleases:                 [false, [], ['time', 'start', 'count', 'extras']],
  getTopCharts:                   [false, ['type'], ['start', 'count', 'extras']],

  // Playback
  getPlaybackToken:               [false, ['domain'], []]
};
