<h1 align="center" style="font-size: 40px">wis.js</h1>


  <p align="center">
    <img src="https://raw.githubusercontent.com/jsem-nerad/wis.js/refs/heads/main/images/icon.png" style="width: 40%; height: auto;">
    <br />
    Web Image Scaling in JavaScript
    <br />
    <br />
    <a href="https://github.com/jsem-nerad/wis.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    ·
    <a href="https://github.com/jsem-nerad/wis.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </p>
</div>


This was originally just a funny project for my class and friends, but I thought I could upload it to GitHub, so there it is.

## Backstory
I came up with this when I took a picture of my friend staring at a poster. I thought I could put my custom image there instead of the poster, so I did it in GIMP. But then I thought: what if anyone could easily put their custom image there using a web app? So here it is.

## About the code
There are 4 predefined points on the base image that are the corners of the poster and using JavaScript with perspective-transform library, it scales the custom picture to those 4 points.

## Using as a template
To use this in your code, you will need the wis.js file. Then, put those things into your html file:


```html
<button id="saveButton" class="save-button">
    <span class="button-text">Save Result</span>
</button>
```


```html
<input type="file" id="imageUpload" accept="image/*">
<p class="file-name" id="fileName">No file chosen</p>
```


```html
<div class="canvas-container" id="canvasContainer">
    <canvas id="resultCanvas"></canvas>
    <div class="loading-spinner" id="loadingSpinner">
        <div class="spinner"></div>
    </div>
</div>
```

