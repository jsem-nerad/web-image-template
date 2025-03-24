<h1 align="center" style="font-size: 40px">Web Image Scaling in JavaScript</h1>


  <p align="center">
    <img src="https://raw.githubusercontent.com/jsem-nerad/wis.js/refs/heads/main/images/logo.png" style="width: 30%; height: auto;">
    <br />
    A 
    <br />
    <br />
    <a href="https://github.com/jsem-nerad/wis.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    ·
    <a href="https://github.com/jsem-nerad/wis.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </p>
</div>


This was originally just a funny project for my class and friends, but I thought I could upload it to GitHub, so there it is.

## Backstory
I came up with this when I took a picture of my friend staring at a poster, so I thought I could put there my custom image instead of the poster, so I did it in gimp. But then I thought: what if anyone could put there their custom image easily using a web app, so there it is.

## About the code
There are 4 predefined points on the base image, that are the corners of the poster, and using JavaScript with perspective-transform library, it scales the custom picture to those 4 points.

## Using as a template
To use this in your code, you will need the wis.js file. Then, put those things into your html file:

'''xml
<button id="saveButton" class="save-button">
    <span class="button-text">Save Result</span>
</button>
'''
'''xml
<input type="file" id="imageUpload" accept="image/*">
<p class="file-name" id="fileName">No file chosen</p>
'''

'''xml
<div class="canvas-container" id="canvasContainer">
    <canvas id="resultCanvas"></canvas>
    <div class="loading-spinner" id="loadingSpinner">
        <div class="spinner"></div>
    </div>
</div>
'''

