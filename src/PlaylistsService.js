const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongById(playlistId) {
    const query = {
      text: `SELECT id, name FROM playlists
      WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const playlist = result.rows[0];

    const queryPS = {
      text: `SELECT s.id, s.title, s.performer FROM playlist_songs ps 
      LEFT JOIN songs s on ps.song_id = s.id
      WHERE ps.playlist_id = $1`,
      values: [playlist.id],
    };

    const resultPs = await this._pool.query(queryPS);

    return {
      playlist: {
        ...playlist,
        songs: resultPs.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
