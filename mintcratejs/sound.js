// ---------------------------------------------------------------------------
// MintCrate - Sound
// Provides a convenient way to work with sound data
// ---------------------------------------------------------------------------

'use strict';

import { MintMath } from "./mintmath.js";

export class Sound {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #audioContext;
  #audioBuffer;
  
  #sourceNode;
  #gainNode;
  #endCallback;
  
  #currentPlaybackTime;
  #pitch;
  #volume;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(audioContext, audioBuffer) {
    this.#audioContext = audioContext;
    this.#audioBuffer = audioBuffer;
    
    this.#currentPlaybackTime = 0;
    this.#pitch = 1;
    this.#volume = 1;
  }
  
  play() {
    // Stop audio in case it's already playing
    this.stop();
    
    // Create new source node for playing the audio
    this.#sourceNode = this.#audioContext.createBufferSource();
    this.#sourceNode.buffer = this.#audioBuffer;
    
    // Set pitch
    this.#sourceNode.playbackRate.value = this.#pitch;
    
    // Set looping properties
    // this.#sourceNode.loop
    
    // Set volume
    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#volume;
    
    
    // Set up callback to destroy sound when it's done playing
    this.#endCallback = () => { this.#cleanUp(); };
    this.#sourceNode.addEventListener('ended', this.#endCallback);
    
    // Play sound
    this.#sourceNode.connect(this.#gainNode);
    this.#gainNode.connect(this.#audioContext.destination);
    this.#sourceNode.start();
  }
  
  stop() {
    this.#cleanUp();
  }
  
  pause() {
    
  }
  
  resume() {
    
  }
  
  setVolume(volume) {
    // TODO: Test these values
    this.#volume = MintMath.clamp(volume, 0, 1);
  }
  
  setPitch(pitch) {
    // TODO: Test these values
    this.#pitch = MintMath.clamp(pitch, 0.1, 30);;
  }
  
  #cleanUp() {
    if (this.#sourceNode) {
      this.#sourceNode.stop();
      this.#sourceNode.disconnect();
      this.#sourceNode.removeEventListener('ended', this.#endCallback);
    }
    
    if (this.#gainNode) {
      this.#gainNode.gain.value = 0;
      this.#gainNode.disconnect();
    }
    
  }
  
}