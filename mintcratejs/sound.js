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
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(audioContext, audioBuffer) {
    this.#audioContext = audioContext;
    this.#audioBuffer = audioBuffer;
    
    this.#currentPlaybackTime = 0;
  }
  
  play(volume = 1, pitch = 1) {
    // Stop audio in case it's already playing
    this.stop();
    
    // Create new source node for playing the audio
    this.#sourceNode = this.#audioContext.createBufferSource();
    this.#sourceNode.buffer = this.#audioBuffer;
    
    // Set volume
    this.#gainNode = this.#audioContext.createGain();
    this.setVolume(volume);
    
    // Set pitch
    this.setPitch(pitch);
    
    // Set looping properties
    // TODO: This
    // this.#sourceNode.loop
    
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
    volume = MintMath.clamp(volume, 0, 1);
    
    if (this.#gainNode) {
      this.#gainNode.gain.value = volume;
    }
  }
  
  setPitch(pitch) {
    // TODO: Test these values
    pitch = MintMath.clamp(pitch, 0.1, 30);
    
    if (this.#sourceNode) {
      this.#sourceNode.playbackRate.value = pitch;
    }
  }
  
  update() {
    
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