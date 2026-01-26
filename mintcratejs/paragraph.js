// -----------------------------------------------------------------------------
// MintCrate - Paragraph
// An entity which is intended for displaying text lines via bitmap fonts
// -----------------------------------------------------------------------------

'use strict';

import { Entity } from "./entity.js";

export class Paragraph extends Entity {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #glyphWidth;
  #glyphHeight;
  #maxCharsPerLine;
  #lineSpacing;
  #wordWrap;
  #alignment;
  #hyphenate;
  #textContent;
  #textLines;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(
    name,
    instances,
    linearInstanceList,
    drawOrder,
    x,
    y,
    glyphWidth,
    glyphHeight,
    maxCharsPerLine,
    lineSpacing,
    wordWrap,
    alignment,
    hyphenate
  ) {
    super("paragraph", name, instances, linearInstanceList, drawOrder, x, y);
    
    this.#glyphWidth = glyphWidth;
    this.#glyphHeight = glyphHeight;
    this.#maxCharsPerLine = maxCharsPerLine;
    this.#lineSpacing = lineSpacing;
    this.#wordWrap = wordWrap;
    this.#alignment = alignment;
    this.#textContent = "";
    this.#textLines = [];
  }
  
  getTextContent() {
    return this.#textContent;
  }
  
  setTextContent(textContent) {
    // TODO: Redo all this and try to make it more logical
    
    // Convert any input to a string
    textContent = textContent.toString();
    
    // Store unformatted text content
    this.#textContent = textContent;
    
    // Normalize line breaks
    textContent = textContent.replaceAll("\r\n", "\n");
    textContent = textContent.replaceAll("\n\r", "\n");
    textContent = textContent.replaceAll("\r", "\n");
    
    // Prepare to parse text into lines
    let wordWrap = this.#wordWrap;
    let maxCharsPerLine = this.#maxCharsPerLine;
    
    // Split words into array
    let initialSplit = textContent.split(" ");
    
    // Split linebreaks into their own "words" so they'll be parsed, too
    // i.e. "Apple\nBanana Carrot" -> ["Apple", "\n", "Banana", "Carrot"]
    let words = [];
    for (const fullWord of initialSplit) {
      let splitWords = fullWord.split("\n");
      for (let i = 0; i < splitWords.length; i++) {
        let word = splitWords[i];
        words.push(word);
        if (i < splitWords.length - 1) {
          words.push("\n");
        }
      }
    }
    
    // Construct formatted lines
    // Text in Paragraph objects is stored as pre-formatted lines
    // Basically, we're trying to fit as many words as possible into each line
    let strLines = [""];
    
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      
      // Force a new line if we've hit a line break
      if (word === "\n") {
        strLines.push("");
      // If we're not going to exceed max chars allowed, then concat the word
      } else if ((strLines[strLines.length-1] + word).length <= maxCharsPerLine) {
        strLines[strLines.length-1] += word;
      // If we are going to exceed, and either the word is too long or wordwrap
      // is not enabled, then break the word
      } else if (word.length > maxCharsPerLine || !wordWrap) {
        let spaceAvailable = maxCharsPerLine - strLines[strLines.length-1].length;
        let wordLeft       = word.substring(0, spaceAvailable);
        let wordRight      = word.substring(spaceAvailable, word.length);
        
        strLines[strLines.length-1] += wordLeft;
        strLines.push(wordRight);
      } else {
        strLines.push(word);
      }
      
      // Add space after word that was inserted
      if (
        word !== "\n"
        && words[i+1] !== undefined
        && (strLines[strLines.length-1] + words[i+1]).length <= maxCharsPerLine
        && words[i+1] !== "\n"
      ) {
        strLines[strLines.length-1] += " "
      }
      
      // Keep breaking remainder onto new lines
      while ((strLines[strLines.length-1]).length > maxCharsPerLine) {
        let line = strLines[strLines.length-1];
        let lineLeft = line.substring(0, maxCharsPerLine);
        let lineRight = line.substring(maxCharsPerLine, line.length);
        
        strLines[strLines.length-1] = lineLeft;
        
        strLines.push(lineRight);
      }
    }
    
    // Store formatted lines
    this.#textLines = strLines
  }
  
  getGlyphWidth() {
    return this.#glyphWidth;
  }
  
  getGlyphHeight() {
    return this.#glyphHeight;
  }
  
  getTextLines() {
    return this.#textLines;
  }
  
  getMaxCharsPerLine() {
    return this.#maxCharsPerLine;
  }
  
  getLineSpacing() {
    return this.#lineSpacing
  }
  
  getWordWrap() {
    return this.#wordWrap;
  }
  
  getAlignment() {
    return this.#alignment
  }
}