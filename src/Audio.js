
// Audio utility file

// Get <audio> and <source> DOM
function getAudioDom( id ) {

    return {
        audio: document.getElementById( id ),
        src: document.getElementById( id + "Src" ),
    };

}

let music = getAudioDom( "music" );
let effect = getAudioDom( "effect" );

// Load specified audio file
function loadAudio( audio, src) {

    audio.src.src = src;    
    audio.audio.load();

}

module.exports = {
    loadAudio,
    music,
    effect,
};
