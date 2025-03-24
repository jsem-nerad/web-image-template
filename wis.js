document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const imageUpload = document.getElementById('imageUpload');
    const resultCanvas = document.getElementById('resultCanvas');
    const ctx = resultCanvas.getContext('2d');
    const saveButton = document.getElementById('saveButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const fileName = document.getElementById('fileName');
    const aboutLink = document.getElementById('aboutLink');
    const aboutModal = document.getElementById('aboutModal');
    const closeModal = document.getElementById('closeModal');
    
    // Hide loading spinner initially
    loadingSpinner.style.display = 'none';
    
    // Background image path
    const backgroundImagePath = 'images/scene-with-poster.jpg';
    // Default poster image path
    const defaultPosterImagePath = 'images/default-poster.jpg';
    
    // Define the four corners of the poster in the background image

    const posterCorners = {
        topLeft: [1332, 565],
        topRight: [2500, 522],
        bottomRight: [2500, 1470],
        bottomLeft: [1317, 1410]
    };
    
    // Load perspective-transform.js
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://cdn.jsdelivr.net/npm/perspective-transform@1.1.3/dist/perspective-transform.min.js';
    document.head.appendChild(scriptElement);
    
    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    
    // Wait for the library to load
    scriptElement.onload = function() {
        // Now we can proceed with loading images
        loadImages();
    };
    
    // Update file name display when a file is selected
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            fileName.textContent = e.target.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
    
    // Modal functionality
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        aboutModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        aboutModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
    function loadImages() {
        // Load the background image
        const backgroundImage = new Image();
        backgroundImage.crossOrigin = "Anonymous";
        
        // Load the default poster image
        const defaultPosterImage = new Image();
        defaultPosterImage.crossOrigin = "Anonymous";
        
        // Wait for both images to load
        let backgroundLoaded = false;
        let defaultPosterLoaded = false;
        
        backgroundImage.onload = function() {
            // Set canvas size to match the background image
            resultCanvas.width = backgroundImage.width;
            resultCanvas.height = backgroundImage.height;
            
            backgroundLoaded = true;
            // Draw initial scene if both images are loaded
            if (defaultPosterLoaded) {
                drawInitialScene();
                loadingSpinner.style.display = 'none';
            }
        };
        
        defaultPosterImage.onload = function() {
            defaultPosterLoaded = true;
            // Draw initial scene if both images are loaded
            if (backgroundLoaded) {
                drawInitialScene();
                loadingSpinner.style.display = 'none';
            }
        };
        
        // Set image sources to start loading
        backgroundImage.src = backgroundImagePath;
        defaultPosterImage.src = defaultPosterImagePath;
        
        // Function to draw the initial scene with default poster
        function drawInitialScene() {
            // Draw the background image
            ctx.drawImage(backgroundImage, 0, 0);
            
            // Apply the perspective transform and draw the default poster image
            drawPerspectiveImage(defaultPosterImage, posterCorners);
        }
        
        // Handle image upload
        imageUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                // Show loading spinner
                loadingSpinner.style.display = 'flex';
                
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const uploadedImage = new Image();
                    uploadedImage.crossOrigin = "Anonymous";
                    
                    uploadedImage.onload = function() {
                        // Redraw the background
                        ctx.drawImage(backgroundImage, 0, 0);
                        
                        // Apply the perspective transform and draw the uploaded image
                        drawPerspectiveImage(uploadedImage, posterCorners);
                        
                        // Hide loading spinner
                        loadingSpinner.style.display = 'none';
                    };
                    
                    uploadedImage.src = event.target.result;
                };
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        // Function to draw an image with perspective transformation
        function drawPerspectiveImage(image, corners) {
            // Create a temporary canvas for the image to be transformed
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Set the temp canvas size to be large enough for the transformed image
            tempCanvas.width = resultCanvas.width;
            tempCanvas.height = resultCanvas.height;
            
            // Define the source points (the original image corners)
            const srcPoints = [
                0, 0,                    // top-left
                image.width, 0,          // top-right
                image.width, image.height, // bottom-right
                0, image.height          // bottom-left
            ];
            
            // Define the destination points (the poster corners)
            const dstPoints = [
                corners.topLeft[0], corners.topLeft[1],
                corners.topRight[0], corners.topRight[1],
                corners.bottomRight[0], corners.bottomRight[1],
                corners.bottomLeft[0], corners.bottomLeft[1]
            ];
            
            // Create the perspective transform using the library
            const perspectiveTransform = PerspT(srcPoints, dstPoints);
            
            // Create a new ImageData object for the transformed image
            const transformedImageData = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);
            
            // Draw the original image to a temporary canvas to get its pixel data
            const srcCanvas = document.createElement('canvas');
            srcCanvas.width = image.width;
            srcCanvas.height = image.height;
            const srcCtx = srcCanvas.getContext('2d');
            srcCtx.drawImage(image, 0, 0);
            const srcImageData = srcCtx.getImageData(0, 0, image.width, image.height);
            
            // Define the bounding box of the destination quadrilateral
            const minX = Math.max(0, Math.min(corners.topLeft[0], corners.topRight[0], corners.bottomRight[0], corners.bottomLeft[0]));
            const maxX = Math.min(tempCanvas.width, Math.max(corners.topLeft[0], corners.topRight[0], corners.bottomRight[0], corners.bottomLeft[0]));
            const minY = Math.max(0, Math.min(corners.topLeft[1], corners.topRight[1], corners.bottomRight[1], corners.bottomLeft[1]));
            const maxY = Math.min(tempCanvas.height, Math.max(corners.topLeft[1], corners.topRight[1], corners.bottomRight[1], corners.bottomLeft[1]));
            
            // For each pixel in the destination bounding box
            for (let y = minY; y <= maxY; y++) {
                for (let x = minX; x <= maxX; x++) {
                    // Check if the point is inside the quadrilateral
                    if (isPointInQuad(x, y, corners)) {
                        // Apply inverse transformation to find the source pixel
                        const srcPoint = perspectiveTransform.transformInverse(x, y);
                        const srcX = Math.round(srcPoint[0]);
                        const srcY = Math.round(srcPoint[1]);
                        
                        // Only copy pixels that are strictly within the bounds of the source image
                        // This prevents the "snake" wrapping effect
                        if (srcX >= 0 && srcX < image.width && srcY >= 0 && srcY < image.height) {
                            // Get the pixel from the source image
                            const srcIndex = (srcY * image.width + srcX) * 4;
                            const dstIndex = (y * tempCanvas.width + x) * 4;
                            
                            // Copy the pixel to the transformed image
                            transformedImageData.data[dstIndex] = srcImageData.data[srcIndex];         // R
                            transformedImageData.data[dstIndex + 1] = srcImageData.data[srcIndex + 1]; // G
                            transformedImageData.data[dstIndex + 2] = srcImageData.data[srcIndex + 2]; // B
                            transformedImageData.data[dstIndex + 3] = srcImageData.data[srcIndex + 3]; // A
                        }
                        // If source pixel is outside bounds, leave it transparent (default is 0,0,0,0)
                    }
                }
            }
            
            // Put the transformed image data onto the temporary canvas
            tempCtx.putImageData(transformedImageData, 0, 0);
            
            // Draw the transformed image onto the main canvas
            ctx.drawImage(tempCanvas, 0, 0);
        }
        
        // Function to check if a point is inside a quadrilateral
        function isPointInQuad(x, y, corners) {
            const points = [
                corners.topLeft,
                corners.topRight,
                corners.bottomRight,
                corners.bottomLeft
            ];
            
            let inside = false;
            for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                const xi = points[i][0], yi = points[i][1];
                const xj = points[j][0], yj = points[j][1];
                
                const intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
        }
        
        // Save the final image
        saveButton.addEventListener('click', function() {
            // Show loading spinner
            loadingSpinner.style.display = 'flex';
            
            setTimeout(() => {
                const link = document.createElement('a');
                link.download = 'custom-poster.png';
                link.href = resultCanvas.toDataURL('image/png');
                link.click();
                
                // Hide loading spinner
                loadingSpinner.style.display = 'none';
            }, 100);
        });
        
        // Handle error cases
        backgroundImage.onerror = function() {
            console.error("Error loading background image");
            alert("Could not load the background image. Please check the file path.");
            loadingSpinner.style.display = 'none';
        };
        
        defaultPosterImage.onerror = function() {
            console.error("Error loading default poster image");
            alert("Could not load the default poster image. Using blank poster instead.");
            defaultPosterLoaded = true;
            if (backgroundLoaded) {
                // Draw just the background if default poster fails to load
                ctx.drawImage(backgroundImage, 0, 0);
                loadingSpinner.style.display = 'none';
            }
        };
    }
});








