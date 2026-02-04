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
    this.#hyphenate = hyphenate;
  }
  
  getTextContent() {
    return this.#textContent;
  }
  
  setTextContent(textContent) {
    // Convert any input to a string
    textContent = textContent.toString();
    
    // Store unformatted text content
    this.#textContent = textContent;
    
    // Normalize line breaks
    textContent = textContent.replaceAll("\r\n", "\n");
    textContent = textContent.replaceAll("\n\r", "\n");
    textContent = textContent.replaceAll("\r", "\n");
    
    // Alias formatting vars for convenience
    let wordWrap = this.#wordWrap;
    let hyphenate = this.#hyphenate;
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
    let line = "";
    
    let maxParses = 0;
    let i = 0;
    while (i < words.length) {
      let word = words[i];
      
      let lineNum = strLines.length - 1;
      let line = strLines[lineNum];
      let availableChars = maxCharsPerLine - line.length;
      
      // Force a new line if we've hit a line break
      if (word === "\n") {
        strLines.push("");
      // If we won't exceed max chars allowed, then append the word to the line
      } else if (word.length <= availableChars) {
        line += word;
        // Add a space
        if (
          availableChars - word.length >= 1
          && words[i+1] !== "\n"
          && words[i+1]
        ) {
          line += " ";
        }
      // If we are going to exceed max chars allowed, break the word/line
      } else {
        // Break word...
        if (word.length > maxCharsPerLine || !wordWrap) {
          let left  = word.substring(0, availableChars);
          let right = word.substring(availableChars, word.length);
          
          // Handle hyphenation
          if (hyphenate && availableChars >= 2) {
            right = left.slice(-1) + right;
            left = left.slice(0, -1) + "-";
          }
          
          line += left;
          words.splice(i+1, 0, right);
        }
        // ...or Break line
        else {
          strLines.push("");
          continue;
        }
      }
      
      // Story modified line back into array
      strLines[lineNum] = line;
      
      // Create a new line if we've hit the char line limit
      if (
        line.length === maxCharsPerLine
        && typeof words[i+1] !== "undefined"
      ) {
        strLines.push("");
      }
      
      i++;
      
      maxParses++;
      if (maxParses > 9999) {
        console.log('PARSING ERROR!');
        break;
        // TODO: Throw some kind of error
      }
    }
    
    // Store formatted lines
    this.#textLines = strLines;
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