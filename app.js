function playSong() {
    let titleEl = document.getElementById("song-title");
    titleEl.textContent = "Playing: 'Lilac Wine' by Jeff Buckley";
}

// All available songs
const ALL_SONGS = [
  { id:1,  name:"Lilac Wine",                     artist:"Jeff Buckley",         emoji:"🍷" },
  { id:2,  name:"So real",                        artist:"Jeff Buckley",         emoji:"✨" },
  { id:3,  name:"Wild horses",                    artist:"The Rolling Stones",   emoji:"🌅" },
  { id:4,  name:"Staying",                        artist:"Lizzy MCAlphine",      emoji:"🌊" },
  { id:5,  name:"Pushing it down and praying",    artist:"Lizzy MCAlphine",      emoji:"💚" },
  { id:6,  name:"Heroes",                         artist:"David Bowie",          emoji:"☀️" },
  { id:7,  name:"Wicked Game",                    artist:"Chris Isaak",          emoji:"🌸" },
  { id:8,  name:"Better than this",               artist:"Lizzy MCAlphine",      emoji:"🦸" },
  { id:9,  name:"Like a tattoo",                  artist:"Sade",                 emoji:"✒️" },
  { id:10, name:"Bless the telephone",            artist:"Labi Siffre",          emoji:"📞" },
];

// Your playlists — each stores an array of song IDs
let playlists = [
  { id:1, name:"Chill Vibes",  color:"#f4a4a4", songs:[1, 3, 7, 10] },
  { id:2, name:"Hype Mix",     color:"#82c97a", songs:[2, 4, 5]      },
  { id:3, name:"Soulful",      color:"#a8c0f0", songs:[]      },
];

// A helper function: look up a song by its id
function getSong(id) {
  return ALL_SONGS.find(s => s.id === id);
}





// Radio state
let activePlaylistId = null;  // which playlist is loaded
let currentSongIndex = 0;     // which song in that playlist
let isPlaying = false;        // is it playing or paused?

// Modal state
let editingPlaylistId = null; // null = creating new, number = editing existing
let draftColor = "#f4a4a4";   // the color chosen so far
let draftSongs = [];          // the songs added so far (array of ids)

function loadCurrentSong() {
    //find the active playlist
    let playlist = playlists.find(p => p.id === activePlaylistId);
    // If no playlist is active or playlist has no songs, show message
    if (!playlist || playlist.songs.length === 0) {
        document.getElementById("now-playing-title").textContent = "No playlist selected or empty playlist";
        document.getElementById("now-playing-artist").textContent = "";
        return;
    }

    // Get the song id at the current index (INDEX = POSITION IN THE PLAYLIST)
    let songId = playlist.songs[currentSongIndex];
    // Look up the song details FROM THE CURRENT ID
    let song = getSong(songId);
    //update diplay
    document.getElementById("now-playing-title").textContent = song.emoji + " " + song.name;
    document.getElementById("now-playing-artist").textContent = song.artist;
    document.getElementById("playlist-name").textContent = playlist.name;
}


// controls

function togglePlay() {
  if (activePlaylistId === null) return; // if no playlist loaded, do nothing

  isPlaying = !isPlaying; // flip true→false or false→true so play toggles to pause and back

  // Update the button text to match state
  let btn = document.getElementById("play-btn");
  btn.textContent = isPlaying ? "⏸ Pause" : "▶ Play";

  // if playing → show Pause
  // if paused → show Play
}

function nextSong() {
  if (activePlaylistId === null) return;

  let playlist = playlists.find(p => p.id === activePlaylistId);

  // Move to next song, wrap around to start if at end
  currentSongIndex = (currentSongIndex + 1) % playlist.songs.length;

  loadCurrentSong();
}

function prevSong() {
  if (activePlaylistId === null) return;

  let playlist = playlists.find(p => p.id === activePlaylistId);

  // Move back, wrap around to end if at start
  currentSongIndex = (currentSongIndex - 1 + playlist.songs.length) % playlist.songs.length;

  loadCurrentSong();
}

function selectPlaylist(id) {
  activePlaylistId = id;
  currentSongIndex = 0; // always start at the first song when loading a playlist
  isPlaying = true;

  document.getElementById("play-btn").textContent = "⏸ Pause"; // update button to match state

  loadCurrentSong();
}

// UI rendering helper for the playlist buttons — creates a button for each playlist and sets up its click handler
function renderPlaylistButtons() {
  let container = document.getElementById("playlist-buttons");

  // Clear existing buttons
  container.innerHTML = "";

  // Create a button for each playlist
  playlists.forEach(function(playlist) {
    let btn = document.createElement("button");
    btn.textContent = playlist.name;
    btn.style.background = playlist.color;
    btn.onclick = function() {
      selectPlaylist(playlist.id);
    };
    container.appendChild(btn);
  });
}

// Call it once when the page loads
renderPlaylistButtons();

