// Makeup Application JavaScript with Face Detection

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const applyMakeupBtn = document.getElementById('apply-makeup');
    const previewImg = document.getElementById('preview-img');
    const makeupCanvas = document.getElementById('makeup-canvas');
    const landmarksCanvas = document.getElementById('face-landmarks');
    const makeupStyleSelect = document.getElementById('makeup-style');
    
    // Makeup configurations
    const makeupConfig = {
        lipstick: {
            color: 'red',
            style: 'matte',
            intensity: 0.7
        },
        eyeshadow: {
            color: 'purple',
            style: 'natural',
            intensity: 0.5
        },
        eyeliner: {
            enabled: false,
            style: 'thin',
            color: '#000000'
        },
        mascara: {
            enabled: false,
            style: 'natural'
        },
        foundation: {
            enabled: true,
            shade: 'medium',
            coverage: 0.5
        },
        blush: {
            enabled: true,
            color: 'pink',
            intensity: 0.4
        },
        contour: {
            enabled: false,
            intensity: 'subtle'
        },
        brows: {
            enabled: true,
            style: 'natural',
            color: 'brown',
            intensity: 0.6
        }
    };
    
    // Face detection state
    let faceDetectionReady = false;
    let faceDetectionModels = ['tinyFaceDetector', 'faceLandmark68Net'];
    let detectedFaces = [];
    
    // Initialize face-api.js
    initFaceDetection();
    
    // Initialize makeup tabs
    initMakeupTabs();
    
    // Initialize color swatches
    initColorSwatches();
    
    // Initialize makeup controls
    initMakeupControls();
    
    // Add realistic class to makeup canvas
    if (makeupCanvas) {
        makeupCanvas.classList.add('makeup-realistic');
    }
    
    // Load face detection models
    async function initFaceDetection() {
        try {
            // Check if face-api.js script is available
            if (typeof faceapi !== 'undefined') {
                // Models path
                const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                
                // Load models
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
                ]);
                
                faceDetectionReady = true;
                console.log('Face detection models loaded');
            } else {
                // If face-api.js is not available, load it dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js';
                script.onload = async () => {
                    const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                    
                    await Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
                    ]);
                    
                    faceDetectionReady = true;
                    console.log('Face detection models loaded dynamically');
                };
                document.head.appendChild(script);
            }
        } catch (error) {
            console.error('Error loading face detection models:', error);
        }
    }
    
    // Initialize makeup tabs
    function initMakeupTabs() {
        const tabs = document.querySelectorAll('.makeup-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active', 'border-pink-500', 'text-pink-500'));
                
                // Add active class to clicked tab
                tab.classList.add('active', 'border-b-2', 'border-pink-500', 'text-pink-500');
                
                // Hide all tab contents
                tabContents.forEach(content => content.classList.add('hidden'));
                
                // Show selected tab content
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.remove('hidden');
            });
        });
    }
    
    // Initialize color swatches
    function initColorSwatches() {
        // Color swatches for all makeup types
        const colorSwatches = document.querySelectorAll('.color-swatch');
        
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                const type = this.getAttribute('data-type');
                
                // Remove selection from siblings
                const siblings = Array.from(this.parentElement.querySelectorAll(`.color-swatch[data-type="${type}"]`));
                siblings.forEach(sibling => sibling.classList.remove('selected'));
                
                // Add selected class to this swatch
                this.classList.add('selected');
                
                // Update makeup configuration
                switch (type) {
                    case 'lipstick':
                        makeupConfig.lipstick.color = color;
                        break;
                    case 'eyeshadow':
                        makeupConfig.eyeshadow.color = color;
                        break;
                    case 'blush':
                        makeupConfig.blush.color = color;
                        break;
                    case 'brow':
                        makeupConfig.brows.color = color;
                        break;
                }
            });
        });
        
        // Set initial selections
        selectDefaultSwatches();
    }
    
    // Select default color swatches
    function selectDefaultSwatches() {
        // Select default lipstick
        const defaultLipstick = document.querySelector(`.color-swatch[data-type="lipstick"][data-color="red"]`);
        if (defaultLipstick) defaultLipstick.classList.add('selected');
        
        // Select default eyeshadow
        const defaultEyeshadow = document.querySelector(`.color-swatch[data-type="eyeshadow"][data-color="purple"]`);
        if (defaultEyeshadow) defaultEyeshadow.classList.add('selected');
        
        // Select default blush
        const defaultBlush = document.querySelector(`.color-swatch[data-type="blush"][data-color="pink"]`);
        if (defaultBlush) defaultBlush.classList.add('selected');
        
        // Select default brow color
        const defaultBrow = document.querySelector(`.color-swatch[data-type="brow"][data-color="brown"]`);
        if (defaultBrow) defaultBrow.classList.add('selected');
    }
    
    // Initialize makeup controls
    function initMakeupControls() {
        // Lipstick style
        const lipstickStyle = document.getElementById('lipstick-style');
        if (lipstickStyle) {
            lipstickStyle.addEventListener('change', (e) => {
                makeupConfig.lipstick.style = e.target.value;
            });
        }
        
        // Lipstick intensity
        const lipstickIntensity = document.getElementById('lipstick-intensity');
        if (lipstickIntensity) {
            lipstickIntensity.addEventListener('input', (e) => {
                makeupConfig.lipstick.intensity = parseFloat(e.target.value);
            });
        }
        
        // Eyeshadow style
        const eyeshadowStyle = document.getElementById('eyeshadow-style');
        if (eyeshadowStyle) {
            eyeshadowStyle.addEventListener('change', (e) => {
                makeupConfig.eyeshadow.style = e.target.value;
            });
        }
        
        // Eyeliner toggle
        const eyelinerToggle = document.getElementById('eyeliner-toggle');
        if (eyelinerToggle) {
            eyelinerToggle.addEventListener('change', (e) => {
                makeupConfig.eyeliner.enabled = e.target.checked;
            });
        }
        
        // Eyeliner style
        const eyelinerStyle = document.getElementById('eyeliner-style');
        if (eyelinerStyle) {
            eyelinerStyle.addEventListener('change', (e) => {
                makeupConfig.eyeliner.style = e.target.value;
            });
        }
        
        // Mascara toggle
        const mascaraToggle = document.getElementById('mascara-toggle');
        if (mascaraToggle) {
            mascaraToggle.addEventListener('change', (e) => {
                makeupConfig.mascara.enabled = e.target.checked;
            });
        }
        
        // Lash style
        const lashStyle = document.getElementById('lash-style');
        if (lashStyle) {
            lashStyle.addEventListener('change', (e) => {
                makeupConfig.mascara.style = e.target.value;
            });
        }
        
        // Foundation toggle
        const foundationToggle = document.getElementById('foundation-toggle');
        if (foundationToggle) {
            foundationToggle.addEventListener('change', (e) => {
                makeupConfig.foundation.enabled = e.target.checked;
            });
        }
        
        // Foundation shade
        const foundationShade = document.getElementById('foundation-shade');
        if (foundationShade) {
            foundationShade.addEventListener('change', (e) => {
                makeupConfig.foundation.shade = e.target.value;
            });
        }
        
        // Foundation coverage
        const foundationCoverage = document.getElementById('foundation-coverage');
        if (foundationCoverage) {
            foundationCoverage.addEventListener('input', (e) => {
                makeupConfig.foundation.coverage = parseFloat(e.target.value);
            });
        }
        
        // Blush toggle
        const blushToggle = document.getElementById('blush-toggle');
        if (blushToggle) {
            blushToggle.addEventListener('change', (e) => {
                makeupConfig.blush.enabled = e.target.checked;
            });
        }
        
        // Blush intensity
        const blushIntensity = document.getElementById('blush-intensity');
        if (blushIntensity) {
            blushIntensity.addEventListener('input', (e) => {
                makeupConfig.blush.intensity = parseFloat(e.target.value);
            });
        }
        
        // Contour toggle
        const contourToggle = document.getElementById('contour-toggle');
        if (contourToggle) {
            contourToggle.addEventListener('change', (e) => {
                makeupConfig.contour.enabled = e.target.checked;
            });
        }
        
        // Contour intensity
        const contourIntensity = document.getElementById('contour-intensity');
        if (contourIntensity) {
            contourIntensity.addEventListener('change', (e) => {
                makeupConfig.contour.intensity = e.target.value;
            });
        }
        
        // Brows toggle
        const browsToggle = document.getElementById('brows-toggle');
        if (browsToggle) {
            browsToggle.addEventListener('change', (e) => {
                makeupConfig.brows.enabled = e.target.checked;
            });
        }
        
        // Brow style
        const browStyle = document.getElementById('brow-style');
        if (browStyle) {
            browStyle.addEventListener('change', (e) => {
                makeupConfig.brows.style = e.target.value;
            });
        }
        
        // Brow intensity
        const browIntensity = document.getElementById('brow-intensity');
        if (browIntensity) {
            browIntensity.addEventListener('input', (e) => {
                makeupConfig.brows.intensity = parseFloat(e.target.value);
            });
        }
    }
    
    // Apply makeup button click handler
    if (applyMakeupBtn && previewImg && makeupCanvas) {
        applyMakeupBtn.addEventListener('click', function() {
            // Show loading state
            applyMakeupBtn.disabled = true;
            applyMakeupBtn.innerHTML = '<div class="loader w-6 h-6 mr-2 inline-block"></div> Applying...';
            
            // Get selected makeup style
            const makeupStyle = makeupStyleSelect ? makeupStyleSelect.value : 'natural';
            
            // Apply makeup with face detection
            applyMakeupWithFaceDetection(previewImg, makeupStyle)
                .then(() => {
                    // Reset button state
                    applyMakeupBtn.disabled = false;
                    applyMakeupBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> Apply Makeup';
                    
                    // Enable save and reset buttons
                    document.getElementById('save-image').disabled = false;
                    document.getElementById('reset-image').disabled = false;
                })
                .catch(function(error) {
                    console.error('Error applying makeup:', error);
                    
                    // Fallback to simple makeup application if face detection fails
                    simulateMakeupApplication();
                    
                    // Reset button state
                    applyMakeupBtn.disabled = false;
                    applyMakeupBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> Apply Makeup';
                });
        });
    }
    
    // Reset button click handler
    const resetButton = document.getElementById('reset-image');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Clear the makeup canvas
            const ctx = makeupCanvas.getContext('2d');
            ctx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
            makeupCanvas.style.opacity = '0';
            
            // Clear the landmarks canvas
            const landmarksCtx = landmarksCanvas.getContext('2d');
            landmarksCtx.clearRect(0, 0, landmarksCanvas.width, landmarksCanvas.height);
            
            // Disable save and reset buttons
            document.getElementById('save-image').disabled = true;
            document.getElementById('reset-image').disabled = true;
        });
    }
    
    // Save button click handler
    const saveButton = document.getElementById('save-image');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Create a temporary canvas to combine the original image and makeup
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = previewImg.naturalWidth;
            tempCanvas.height = previewImg.naturalHeight;
            
            const ctx = tempCanvas.getContext('2d');
            
            // Draw the original image
            ctx.drawImage(previewImg, 0, 0);
            
            // Draw the makeup on top
            ctx.drawImage(makeupCanvas, 0, 0);
            
            // Convert canvas to data URL
            const dataUrl = tempCanvas.toDataURL('image/png');
            
            // Create a link element
            const link = document.createElement('a');
            link.download = 'makeup-look.png';
            link.href = dataUrl;
            
            // Simulate click to download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    // Apply makeup with face detection
    async function applyMakeupWithFaceDetection(imageElement, style) {
        if (!faceDetectionReady) {
            console.log('Face detection not ready, using fallback method');
            return simulateMakeupApplication();
        }
        
        try {
            // Prepare canvases
            makeupCanvas.width = imageElement.naturalWidth;
            makeupCanvas.height = imageElement.naturalHeight;
            landmarksCanvas.width = imageElement.naturalWidth;
            landmarksCanvas.height = imageElement.naturalHeight;
            
            // Clear canvases
            const makeupCtx = makeupCanvas.getContext('2d');
            const landmarksCtx = landmarksCanvas.getContext('2d');
            makeupCtx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
            landmarksCtx.clearRect(0, 0, landmarksCanvas.width, landmarksCanvas.height);
            
            // Detect faces with landmarks
            const detection = await faceapi.detectSingleFace(
                imageElement, 
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks();
            
            if (detection) {
                // Store detected face for reference
                detectedFaces = [detection];
                
                // Draw facial landmarks for development but keep them invisible in production
                drawFaceLandmarks(landmarksCtx, detection);
                
                // Apply each makeup component with improved realism
                if (makeupConfig.foundation.enabled) {
                    applyFoundation(makeupCtx, detection, style);
                }
                
                if (makeupConfig.contour.enabled) {
                    applyContour(makeupCtx, detection, style);
                }
                
                if (makeupConfig.blush.enabled) {
                    applyBlush(makeupCtx, detection, style);
                }
                
                if (makeupConfig.eyeshadow.color) {
                    applyEyeshadow(makeupCtx, detection, style);
                }
                
                if (makeupConfig.eyeliner.enabled) {
                    applyEyeliner(makeupCtx, detection, style);
                }
                
                if (makeupConfig.mascara.enabled) {
                    applyMascara(makeupCtx, detection, style);
                }
                
                if (makeupConfig.brows.enabled) {
                    applyBrows(makeupCtx, detection, style);
                }
                
                if (makeupConfig.lipstick.color) {
                    applyLipstick(makeupCtx, detection, style);
                }
                
                // Show the makeup layer with improved blending
                makeupCanvas.style.opacity = '1.0'; // Full opacity for maximum visibility
                
                return true;
            } else {
                console.log('No face detected, using fallback method');
                return simulateMakeupApplication();
            }
        } catch (error) {
            console.error('Error in face detection:', error);
            return simulateMakeupApplication();
        }
    }
    
    // Simulate makeup application for demo purposes
    function simulateMakeupApplication() {
        if (!makeupCanvas || !previewImg) return;
        
        // Set canvas dimensions
        makeupCanvas.width = previewImg.naturalWidth || previewImg.width;
        makeupCanvas.height = previewImg.naturalHeight || previewImg.height;
        
        const ctx = makeupCanvas.getContext('2d');
        ctx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
        
        // Create a new image to process
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            // Draw image to canvas first to access pixel data
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0);
            
            // Get makeup style and colors
            const style = makeupStyleSelect ? makeupStyleSelect.value : 'natural';
            
            ctx.save();
            
            // Apply foundation if enabled
            if (makeupConfig.foundation.enabled) {
                // Apply foundation with increased intensity
                ctx.globalAlpha = makeupConfig.foundation.coverage * 0.5; // Increased for more visibility
                ctx.fillStyle = getFoundationColor(makeupConfig.foundation.shade);
                ctx.filter = 'blur(15px)';
                ctx.fillRect(
                    makeupCanvas.width * 0.25, 
                    makeupCanvas.height * 0.25, 
                    makeupCanvas.width * 0.5, 
                    makeupCanvas.height * 0.5
                );
            }
            
            // Apply blush if enabled
            if (makeupConfig.blush.enabled) {
                // Apply blush to cheeks with increased intensity
                ctx.globalAlpha = makeupConfig.blush.intensity * 0.9; // Increased for more visibility
                ctx.fillStyle = getBlushColor(makeupConfig.blush.color);
                ctx.filter = 'blur(20px)';
                
                // Left cheek
                ctx.beginPath();
                ctx.ellipse(
                    makeupCanvas.width * 0.25, 
                    makeupCanvas.height * 0.55, 
                    makeupCanvas.width * 0.11, 
                    makeupCanvas.width * 0.09, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Right cheek
                ctx.beginPath();
                ctx.ellipse(
                    makeupCanvas.width * 0.75, 
                    makeupCanvas.height * 0.55, 
                    makeupCanvas.width * 0.11, 
                    makeupCanvas.width * 0.09, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
            
            // Apply eyeshadow with increased intensity
            ctx.globalAlpha = makeupConfig.eyeshadow.intensity || 1.0; // Full intensity for maximum visibility
            ctx.fillStyle = getEyeColor(makeupConfig.eyeshadow.color, style);
            ctx.filter = 'blur(10px)';
            
            // Left eye
            ctx.beginPath();
            ctx.ellipse(
                makeupCanvas.width * 0.35, 
                makeupCanvas.height * 0.4, 
                makeupCanvas.width * 0.09, 
                makeupCanvas.width * 0.06, 
                0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Right eye
            ctx.beginPath();
            ctx.ellipse(
                makeupCanvas.width * 0.65, 
                makeupCanvas.height * 0.4, 
                makeupCanvas.width * 0.09, 
                makeupCanvas.width * 0.06, 
                0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Apply lipstick with increased intensity
            ctx.globalAlpha = makeupConfig.lipstick.intensity || 1.0; // Full intensity for maximum visibility
            ctx.fillStyle = getLipColor(makeupConfig.lipstick.color, style);
            
            // Adjust blur based on lipstick style
            const lipstickBlur = {
                matte: 4,
                glossy: 6,
                satin: 5,
                sheer: 8,
                ombre: 5
            };
            
            ctx.filter = `blur(${lipstickBlur[makeupConfig.lipstick.style] || 5}px)`;
            
            // Draw lips
            ctx.beginPath();
            ctx.ellipse(
                makeupCanvas.width * 0.5, 
                makeupCanvas.height * 0.75, 
                makeupCanvas.width * 0.11, 
                makeupCanvas.width * 0.055, 
                0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Add glossy highlight if style is glossy
            if (makeupConfig.lipstick.style === 'glossy') {
                ctx.globalAlpha = 0.6; // Increased from 0.4
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.filter = 'blur(4px)';
                
                ctx.beginPath();
                ctx.ellipse(
                    makeupCanvas.width * 0.5, 
                    makeupCanvas.height * 0.74, 
                    makeupCanvas.width * 0.05, 
                    makeupCanvas.width * 0.015, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
            
            ctx.restore();
            
            // Show the makeup layer with improved blending
            makeupCanvas.style.opacity = '1.0'; // Full opacity for maximum visibility
            
            // Enable save and reset buttons
            document.getElementById('save-image').disabled = false;
            document.getElementById('reset-image').disabled = false;
        };
        
        // Set image source to trigger onload
        img.src = previewImg.src;
    }
    
    // Get foundation color based on shade with improved opacity for realism
    const foundationColors = {
        fair: 'rgba(255, 233, 224, ' + makeupConfig.foundation.coverage * 0.5 + ')',
        light: 'rgba(255, 225, 205, ' + makeupConfig.foundation.coverage * 0.5 + ')',
        medium: 'rgba(255, 215, 185, ' + makeupConfig.foundation.coverage * 0.5 + ')',
        tan: 'rgba(240, 195, 160, ' + makeupConfig.foundation.coverage * 0.5 + ')',
        deep: 'rgba(210, 170, 140, ' + makeupConfig.foundation.coverage * 0.5 + ')'
    };
    
    // Get blush color based on shade
    function getBlushColor(color) {
        const colors = {
            'light-pink': 'rgba(255, 200, 200, 0.9)',
            'pink': 'rgba(255, 150, 170, 0.9)',
            'rose': 'rgba(230, 120, 150, 0.9)',
            'peach': 'rgba(255, 180, 150, 0.9)'
        };
        
        return colors[color] || colors.pink;
    }
    
    // Get brow color based on shade
    function getBrowColor(color) {
        const colors = {
            'blonde': 'rgba(205, 170, 120, 0.7)',
            'auburn': 'rgba(140, 80, 40, 0.7)',
            'brown': 'rgba(110, 70, 40, 0.7)',
            'dark-brown': 'rgba(70, 50, 30, 0.7)',
            'black': 'rgba(40, 35, 30, 0.7)'
        };
        
        return colors[color] || colors.brown;
    }
    
    // Get lipstick color based on selected color and style
    function getLipColor(color, style) {
        const colors = {
            'red': {
                natural: 'rgba(204, 51, 51, 0.5)',
                glamour: 'rgba(204, 0, 0, 0.7)',
                smokey: 'rgba(153, 0, 0, 0.6)',
                party: 'rgba(255, 0, 51, 0.8)',
                vintage: 'rgba(153, 0, 51, 0.7)',
                editorial: 'rgba(255, 30, 30, 0.8)',
                summer: 'rgba(255, 80, 80, 0.6)',
                kpop: 'rgba(255, 0, 80, 0.7)'
            },
            'red-dark': {
                natural: 'rgba(180, 30, 30, 0.5)',
                glamour: 'rgba(180, 0, 0, 0.7)',
                smokey: 'rgba(140, 0, 0, 0.6)',
                party: 'rgba(190, 0, 0, 0.8)',
                vintage: 'rgba(140, 0, 30, 0.7)',
                editorial: 'rgba(190, 0, 0, 0.8)',
                summer: 'rgba(180, 40, 40, 0.6)',
                kpop: 'rgba(180, 0, 50, 0.7)'
            },
            'pink': {
                natural: 'rgba(255, 153, 204, 0.5)',
                glamour: 'rgba(255, 102, 204, 0.7)',
                smokey: 'rgba(204, 102, 153, 0.6)',
                party: 'rgba(255, 51, 153, 0.8)',
                vintage: 'rgba(255, 102, 153, 0.7)',
                editorial: 'rgba(255, 0, 204, 0.8)',
                summer: 'rgba(255, 153, 180, 0.6)',
                kpop: 'rgba(255, 102, 204, 0.7)'
            },
            'pink-dark': {
                natural: 'rgba(220, 100, 170, 0.5)',
                glamour: 'rgba(220, 60, 150, 0.7)',
                smokey: 'rgba(180, 80, 130, 0.6)',
                party: 'rgba(220, 40, 130, 0.8)',
                vintage: 'rgba(190, 80, 130, 0.7)',
                editorial: 'rgba(220, 0, 150, 0.8)',
                summer: 'rgba(220, 100, 150, 0.6)',
                kpop: 'rgba(220, 50, 150, 0.7)'
            },
            'purple': {
                natural: 'rgba(204, 153, 204, 0.5)',
                glamour: 'rgba(153, 51, 153, 0.7)',
                smokey: 'rgba(102, 0, 102, 0.6)',
                party: 'rgba(204, 0, 204, 0.8)',
                vintage: 'rgba(153, 51, 204, 0.7)',
                editorial: 'rgba(180, 0, 230, 0.8)',
                summer: 'rgba(180, 120, 200, 0.6)',
                kpop: 'rgba(180, 70, 230, 0.7)'
            },
            'coral': {
                natural: 'rgba(255, 153, 102, 0.5)',
                glamour: 'rgba(255, 102, 51, 0.7)',
                smokey: 'rgba(204, 102, 51, 0.6)',
                party: 'rgba(255, 102, 0, 0.8)',
                vintage: 'rgba(255, 153, 51, 0.7)',
                editorial: 'rgba(255, 100, 50, 0.8)',
                summer: 'rgba(255, 140, 100, 0.6)',
                kpop: 'rgba(255, 120, 80, 0.7)'
            },
            'orange': {
                natural: 'rgba(255, 180, 110, 0.5)',
                glamour: 'rgba(255, 120, 50, 0.7)',
                smokey: 'rgba(220, 100, 50, 0.6)',
                party: 'rgba(255, 110, 30, 0.8)',
                vintage: 'rgba(230, 140, 60, 0.7)',
                editorial: 'rgba(255, 100, 30, 0.8)',
                summer: 'rgba(255, 150, 90, 0.6)',
                kpop: 'rgba(255, 130, 70, 0.7)'
            },
            'brown': {
                natural: 'rgba(170, 120, 90, 0.5)',
                glamour: 'rgba(150, 90, 50, 0.7)',
                smokey: 'rgba(130, 80, 40, 0.6)',
                party: 'rgba(150, 90, 40, 0.7)',
                vintage: 'rgba(204, 153, 102, 0.6)',
                editorial: 'rgba(160, 100, 50, 0.8)',
                summer: 'rgba(190, 150, 110, 0.6)',
                kpop: 'rgba(180, 130, 90, 0.7)'
            }
        };
        
        return colors[color]?.[style] || colors.red.natural;
    }
    
    // Get eyeshadow color based on selected color and style
    function getEyeColor(color, style) {
        const colors = {
            'purple': {
                natural: 'rgba(204, 153, 204, 0.5)',
                glamour: 'rgba(153, 102, 204, 0.7)',
                smokey: 'rgba(102, 0, 153, 0.6)',
                party: 'rgba(153, 51, 255, 0.7)',
                vintage: 'rgba(204, 153, 255, 0.6)',
                editorial: 'rgba(180, 80, 230, 0.8)',
                summer: 'rgba(200, 160, 240, 0.6)',
                kpop: 'rgba(190, 120, 255, 0.7)'
            },
            'purple-dark': {
                natural: 'rgba(150, 100, 180, 0.5)',
                glamour: 'rgba(120, 60, 160, 0.7)',
                smokey: 'rgba(90, 40, 130, 0.6)',
                party: 'rgba(120, 30, 180, 0.7)',
                vintage: 'rgba(140, 80, 190, 0.6)',
                editorial: 'rgba(130, 50, 180, 0.8)',
                summer: 'rgba(150, 90, 200, 0.6)',
                kpop: 'rgba(140, 60, 190, 0.7)'
            },
            'blue': {
                natural: 'rgba(153, 204, 255, 0.5)',
                glamour: 'rgba(102, 153, 255, 0.7)',
                smokey: 'rgba(51, 102, 204, 0.6)',
                party: 'rgba(0, 102, 255, 0.7)',
                vintage: 'rgba(153, 204, 255, 0.6)',
                editorial: 'rgba(0, 150, 255, 0.8)',
                summer: 'rgba(120, 200, 255, 0.6)',
                kpop: 'rgba(100, 180, 255, 0.7)'
            },
            'pink': {
                natural: 'rgba(255, 204, 229, 0.5)',
                glamour: 'rgba(255, 153, 204, 0.7)',
                smokey: 'rgba(204, 102, 153, 0.6)',
                party: 'rgba(255, 102, 178, 0.7)',
                vintage: 'rgba(255, 178, 204, 0.6)',
                editorial: 'rgba(255, 120, 200, 0.8)',
                summer: 'rgba(255, 180, 220, 0.6)',
                kpop: 'rgba(255, 150, 220, 0.7)'
            },
            'brown': {
                natural: 'rgba(204, 153, 102, 0.5)',
                glamour: 'rgba(153, 102, 51, 0.7)',
                smokey: 'rgba(102, 51, 0, 0.6)',
                party: 'rgba(153, 102, 51, 0.7)',
                vintage: 'rgba(204, 153, 102, 0.6)',
                editorial: 'rgba(160, 100, 50, 0.8)',
                summer: 'rgba(190, 150, 110, 0.6)',
                kpop: 'rgba(180, 130, 90, 0.7)'
            },
            'gray': {
                natural: 'rgba(204, 204, 204, 0.5)',
                glamour: 'rgba(153, 153, 153, 0.7)',
                smokey: 'rgba(102, 102, 102, 0.6)',
                party: 'rgba(128, 128, 128, 0.7)',
                vintage: 'rgba(192, 192, 192, 0.6)',
                editorial: 'rgba(120, 120, 120, 0.8)',
                summer: 'rgba(180, 180, 180, 0.6)',
                kpop: 'rgba(150, 150, 150, 0.7)'
            },
            'green': {
                natural: 'rgba(153, 204, 153, 0.5)',
                glamour: 'rgba(102, 204, 102, 0.7)',
                smokey: 'rgba(51, 153, 51, 0.6)',
                party: 'rgba(0, 153, 0, 0.7)',
                vintage: 'rgba(153, 204, 153, 0.6)',
                editorial: 'rgba(0, 180, 120, 0.8)',
                summer: 'rgba(120, 220, 170, 0.6)',
                kpop: 'rgba(100, 210, 150, 0.7)'
            },
            'gold': {
                natural: 'rgba(255, 215, 0, 0.5)',
                glamour: 'rgba(255, 215, 0, 0.7)',
                smokey: 'rgba(218, 165, 32, 0.6)',
                party: 'rgba(255, 215, 0, 0.7)',
                vintage: 'rgba(255, 223, 0, 0.6)',
                editorial: 'rgba(255, 215, 0, 0.8)',
                summer: 'rgba(255, 223, 120, 0.6)',
                kpop: 'rgba(255, 220, 80, 0.7)'
            }
        };
        
        return colors[color]?.[style] || colors.purple.natural;
    }
    
    // Draw face landmarks for debugging
    function drawFaceLandmarks(ctx, detection) {
        // Draw all landmarks
        for (let i = 0; i < detection.landmarks.positions.length; i++) {
            const point = detection.landmarks.positions[i];
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'; // Change from 0.7 to 0.1 opacity to make dots nearly invisible
            ctx.fill();
        }
        
        // Hide the landmarks canvas completely by default
        landmarksCanvas.style.opacity = '0'; // Change from 0.5 to 0 to hide dots completely
    }
    
    // Apply foundation
    function applyFoundation(ctx, detection, style) {
        const face = detection.detection.box;
        const landmarks = detection.landmarks.positions;
        
        // Get foundation color based on shade with improved opacity for realism
        const foundationColors = {
            fair: 'rgba(255, 233, 224, ' + makeupConfig.foundation.coverage * 0.5 + ')',
            light: 'rgba(255, 225, 205, ' + makeupConfig.foundation.coverage * 0.5 + ')',
            medium: 'rgba(255, 215, 185, ' + makeupConfig.foundation.coverage * 0.5 + ')',
            tan: 'rgba(240, 195, 160, ' + makeupConfig.foundation.coverage * 0.5 + ')',
            deep: 'rgba(210, 170, 140, ' + makeupConfig.foundation.coverage * 0.5 + ')'
        };
        
        const color = foundationColors[makeupConfig.foundation.shade] || foundationColors.medium;
        
        ctx.save();
        
        // Create a face path using jawline landmarks
        ctx.beginPath();
        // Start at the first jawline point (usually the left ear)
        ctx.moveTo(landmarks[0].x, landmarks[0].y);
        
        // Draw along the jawline (points 0-16)
        for (let i = 1; i <= 16; i++) {
            ctx.lineTo(landmarks[i].x, landmarks[i].y);
        }
        
        // Connect to forehead
        // This is approximated as there are no forehead landmarks
        // Connect from right temple to left temple in an arc
        ctx.lineTo(landmarks[16].x, landmarks[16].y - face.height * 0.7);
        ctx.lineTo(landmarks[0].x, landmarks[0].y - face.height * 0.7);
        ctx.closePath();
        
        // Fill with foundation color using improved blending
        ctx.fillStyle = color;
        ctx.filter = 'blur(15px)'; // Increased blur for better skin blending
        ctx.fill();
        
        ctx.restore();
    }
    
    // Apply contour
    function applyContour(ctx, detection, style) {
        const face = detection.detection.box;
        const landmarks = detection.landmarks.positions;
        const jawline = landmarks.slice(0, 17); // Jawline points
        
        ctx.save();
        
        // Contour intensity mapping
        const intensityMap = {
            subtle: 0.2,
            medium: 0.35,
            defined: 0.5,
            dramatic: 0.65
        };
        
        const intensity = intensityMap[makeupConfig.contour.intensity] || 0.35;
        
        // Apply contour to jawline
        ctx.beginPath();
        ctx.moveTo(jawline[0].x, jawline[0].y);
        
        // Create a path that follows just inside the jawline
        for (let i = 1; i < jawline.length; i++) {
            ctx.lineTo(jawline[i].x, jawline[i].y);
        }
        
        // Apply shadow contour color
        ctx.strokeStyle = `rgba(120, 90, 70, ${intensity})`;
        ctx.lineWidth = face.width * 0.03;
        ctx.filter = 'blur(15px)';
        ctx.stroke();
        
        // Add cheekbone highlights
        const leftCheekX = (landmarks[1].x + landmarks[2].x) / 2;
        const rightCheekX = (landmarks[15].x + landmarks[14].x) / 2;
        const cheekY = (landmarks[30].y + landmarks[31].y) / 2;
        
        // Left cheekbone highlight
        ctx.beginPath();
        ctx.ellipse(
            leftCheekX, 
            cheekY, 
            face.width * 0.06, 
            face.height * 0.04, 
            0, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 240, 220, ${intensity * 0.8})`;
        ctx.filter = 'blur(12px)';
        ctx.fill();
        
        // Right cheekbone highlight
        ctx.beginPath();
        ctx.ellipse(
            rightCheekX, 
            cheekY, 
            face.width * 0.06, 
            face.height * 0.04, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Nose contour
        const noseTop = landmarks[27];
        const noseBottom = landmarks[33];
        const noseLeft = landmarks[31];
        const noseRight = landmarks[35];
        
        ctx.beginPath();
        // Left side of nose
        ctx.moveTo(noseLeft.x - 2, noseLeft.y - (noseTop.y - noseBottom.y) * 0.7);
        ctx.lineTo(noseLeft.x - 4, noseLeft.y);
        
        // Right side of nose
        ctx.moveTo(noseRight.x + 2, noseRight.y - (noseTop.y - noseBottom.y) * 0.7);
        ctx.lineTo(noseRight.x + 4, noseRight.y);
        
        ctx.strokeStyle = `rgba(120, 90, 70, ${intensity * 0.7})`;
        ctx.lineWidth = 3;
        ctx.filter = 'blur(4px)';
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Apply blush
    function applyBlush(ctx, detection, style) {
        const face = detection.detection.box;
        const landmarks = detection.landmarks.positions;
        
        // Get blush color
        const blushColors = {
            'light-pink': `rgba(255, 200, 200, ${makeupConfig.blush.intensity * 0.6})`,
            'pink': `rgba(255, 150, 170, ${makeupConfig.blush.intensity * 0.6})`,
            'rose': `rgba(230, 120, 150, ${makeupConfig.blush.intensity * 0.6})`,
            'peach': `rgba(255, 180, 150, ${makeupConfig.blush.intensity * 0.6})`
        };
        
        const color = blushColors[makeupConfig.blush.color] || blushColors.pink;
        
        // Adjust blush position based on style
        let leftBlushX, rightBlushX, blushY, blushWidth, blushHeight;
        
        switch (style) {
            case 'natural':
            case 'summer':
                // Natural blush on apples of cheeks
                leftBlushX = (landmarks[1].x + landmarks[2].x) / 2;
                rightBlushX = (landmarks[15].x + landmarks[14].x) / 2;
                blushY = (landmarks[40].y + landmarks[47].y) / 2;
                blushWidth = face.width * 0.13;
                blushHeight = face.height * 0.13;
                break;
                
            case 'glamour':
            case 'party':
                // Higher more angled blush
                leftBlushX = (landmarks[1].x + landmarks[2].x) / 2;
                rightBlushX = (landmarks[15].x + landmarks[14].x) / 2;
                blushY = landmarks[30].y;
                blushWidth = face.width * 0.17;
                blushHeight = face.height * 0.11;
                break;
                
            case 'editorial':
            case 'kpop':
                // Higher round blush popular in K-beauty
                leftBlushX = landmarks[2].x + face.width * 0.05;
                rightBlushX = landmarks[14].x - face.width * 0.05;
                blushY = landmarks[29].y;
                blushWidth = face.width * 0.12;
                blushHeight = face.height * 0.08;
                break;
                
            default:
                // Default placement
                leftBlushX = (landmarks[1].x + landmarks[2].x) / 2;
                rightBlushX = (landmarks[15].x + landmarks[14].x) / 2;
                blushY = (landmarks[40].y + landmarks[47].y) / 2;
                blushWidth = face.width * 0.15;
                blushHeight = face.height * 0.11;
        }
        
        ctx.save();
        
        // Left cheek blush
        ctx.beginPath();
        ctx.ellipse(
            leftBlushX, 
            blushY, 
            blushWidth, 
            blushHeight, 
            style === 'glamour' ? -Math.PI / 8 : 0, 
            0, Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.filter = 'blur(20px)';
        ctx.fill();
        
        // Right cheek blush
        ctx.beginPath();
        ctx.ellipse(
            rightBlushX, 
            blushY, 
            blushWidth, 
            blushHeight, 
            style === 'glamour' ? Math.PI / 8 : 0, 
            0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
    }
    
    // Apply eyeshadow
    function applyEyeshadow(ctx, detection, style) {
        const face = detection.detection.box;
        const landmarks = detection.landmarks.positions;
        
        // Get eye landmarks
        const leftEye = landmarks.slice(36, 42);
        const rightEye = landmarks.slice(42, 48);
        
        // Get eyeshadow color and style
        const eyeshadowColor = getEyeColor(makeupConfig.eyeshadow.color, style);
        const eyeshadowIntensity = makeupConfig.eyeshadow.intensity || 0.5;
        
        // Calculate eye centers
        const leftEyeCenter = { 
            x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
            x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
        };
        
        // Calculate eye size
        const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
        const rightEyeWidth = Math.max(...rightEye.map(p => p.x)) - Math.min(...rightEye.map(p => p.x));
        
        ctx.save();
        
        // Apply eyeshadow based on style
        switch (makeupConfig.eyeshadow.style) {
            case 'smokey':
                // Smokey eye - darker, more intense, extends outward
                applySmokyEyeshadow(ctx, leftEye, rightEye, eyeshadowColor, eyeshadowIntensity);
                break;
                
            case 'cat':
                // Cat eye - elongated shape extending outward
                applyCatEyeshadow(ctx, leftEye, rightEye, eyeshadowColor, eyeshadowIntensity);
                break;
                
            case 'cut-crease':
                // Cut crease - defined line in the crease
                applyCutCreaseEyeshadow(ctx, leftEye, rightEye, eyeshadowColor, eyeshadowIntensity);
                break;
                
            case 'halo':
                // Halo eye - lighter in the center, darker on edges
                applyHaloEyeshadow(ctx, leftEye, rightEye, eyeshadowColor, eyeshadowIntensity);
                break;
                
            case 'natural':
            default:
                // Natural eyeshadow - soft wash of color
                applyNaturalEyeshadow(ctx, leftEye, rightEye, eyeshadowColor, eyeshadowIntensity);
                break;
        }
        
        ctx.restore();
    }
    
    // Apply natural eyeshadow
    function applyNaturalEyeshadow(ctx, leftEye, rightEye, color, intensity) {
        // Calculate eye dimensions
        const leftEyeCenter = { 
            x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
            x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
        };
        
        // Calculate eye size
        const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
        const rightEyeWidth = Math.max(...rightEye.map(p => p.x)) - Math.min(...rightEye.map(p => p.x));
        
        // Apply eyeshadow
        ctx.globalAlpha = intensity * 0.7;
        ctx.filter = 'blur(10px)';
        
        // Left eye
        ctx.beginPath();
        ctx.ellipse(
            leftEyeCenter.x, 
            leftEyeCenter.y - leftEyeWidth * 0.15, 
            leftEyeWidth * 0.9, 
            leftEyeWidth * 0.6, 
            0, 0, Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.ellipse(
            rightEyeCenter.x, 
            rightEyeCenter.y - rightEyeWidth * 0.15, 
            rightEyeWidth * 0.9, 
            rightEyeWidth * 0.6, 
            0, 0, Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // Apply smoky eyeshadow
    function applySmokyEyeshadow(ctx, leftEye, rightEye, color, intensity) {
        // Calculate eye dimensions
        const leftEyeCenter = { 
            x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
            x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
        };
        
        // Calculate eye size
        const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
        const rightEyeWidth = Math.max(...rightEye.map(p => p.x)) - Math.min(...rightEye.map(p => p.x));
        
        // Calculate outer corner points for wing extension
        const leftOuterCorner = leftEye[0];
        const rightOuterCorner = rightEye[3];
        
        // Apply base eyeshadow
        ctx.globalAlpha = intensity * 0.9;
        ctx.filter = 'blur(8px)';
        
        // Left eye - extend outward for smoky effect
        ctx.beginPath();
        ctx.moveTo(leftEye[1].x, leftEye[1].y - leftEyeWidth * 0.3); // Upper lid
        ctx.quadraticCurveTo(
            leftEyeCenter.x, 
            leftEye[1].y - leftEyeWidth * 0.7,
            leftEye[0].x - leftEyeWidth * 0.5, // Extended outer corner
            leftEye[0].y
        );
        ctx.lineTo(leftEye[3].x, leftEye[3].y); // Outer lower lid point
        ctx.quadraticCurveTo(
            leftEyeCenter.x,
            leftEye[3].y + leftEyeWidth * 0.2,
            leftEye[2].x, leftEye[2].y // Inner lower lid
        );
        ctx.closePath();
        
        // Create gradient for smoky effect
        const leftGradient = ctx.createRadialGradient(
            leftEyeCenter.x, leftEyeCenter.y,
            0,
            leftEyeCenter.x, leftEyeCenter.y,
            leftEyeWidth * 1.2
        );
        leftGradient.addColorStop(0, color);
        leftGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        
        ctx.fillStyle = leftGradient;
        ctx.fill();
        
        // Right eye - extend outward for smoky effect
        ctx.beginPath();
        ctx.moveTo(rightEye[1].x, rightEye[1].y - rightEyeWidth * 0.3); // Upper lid
        ctx.quadraticCurveTo(
            rightEyeCenter.x, 
            rightEye[1].y - rightEyeWidth * 0.7,
            rightEye[0].x + rightEyeWidth * 0.5, // Extended outer corner
            rightEye[0].y
        );
        ctx.lineTo(rightEye[3].x, rightEye[3].y); // Outer lower lid point
        ctx.quadraticCurveTo(
            rightEyeCenter.x,
            rightEye[3].y + rightEyeWidth * 0.2,
            rightEye[2].x, rightEye[2].y // Inner lower lid
        );
        ctx.closePath();
        
        // Create gradient for smoky effect
        const rightGradient = ctx.createRadialGradient(
            rightEyeCenter.x, rightEyeCenter.y,
            0,
            rightEyeCenter.x, rightEyeCenter.y,
            rightEyeWidth * 1.2
        );
        rightGradient.addColorStop(0, color);
        rightGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        
        ctx.fillStyle = rightGradient;
        ctx.fill();
    }
    
    // Apply cat eye eyeshadow
    function applyCatEyeshadow(ctx, leftEye, rightEye, color, intensity) {
        // Calculate eye dimensions
        const leftEyeCenter = { 
            x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
            x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
        };
        
        // Calculate eye size
        const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
        const rightEyeWidth = Math.max(...rightEye.map(p => p.x)) - Math.min(...rightEye.map(p => p.x));
        
        // Apply base eyeshadow with winged effect
        ctx.globalAlpha = intensity * 0.8;
        ctx.filter = 'blur(5px)';
        
        // Left eye - cat eye shape
        ctx.beginPath();
        ctx.moveTo(leftEye[1].x, leftEye[1].y); // Inner upper lid
        ctx.quadraticCurveTo(
            leftEyeCenter.x, 
            leftEye[1].y - leftEyeWidth * 0.5,
            leftEye[0].x - leftEyeWidth * 0.7, // Extended outer corner
            leftEye[0].y - leftEyeWidth * 0.3 // Lifted winged effect
        );
        ctx.lineTo(leftEye[0].x, leftEye[0].y); // Outer corner
        ctx.lineTo(leftEye[3].x, leftEye[3].y); // Lower outer point
        ctx.quadraticCurveTo(
            leftEyeCenter.x,
            leftEyeCenter.y + leftEyeWidth * 0.1,
            leftEye[4].x, leftEye[4].y // Lower inner point
        );
        ctx.closePath();
        
        // Create gradient for cat eye effect
        const leftGradient = ctx.createLinearGradient(
            leftEye[1].x, leftEye[1].y, // Inner point
            leftEye[0].x - leftEyeWidth * 0.7, leftEye[0].y - leftEyeWidth * 0.3 // Outer extended point
        );
        leftGradient.addColorStop(0, color.replace(/[\d.]+\)$/, '0.4)')); // More transparent at inner corner
        leftGradient.addColorStop(1, color); // Full color at outer corner
        
        ctx.fillStyle = leftGradient;
        ctx.fill();
        
        // Right eye - cat eye shape
        ctx.beginPath();
        ctx.moveTo(rightEye[1].x, rightEye[1].y); // Inner upper lid
        ctx.quadraticCurveTo(
            rightEyeCenter.x, 
            rightEye[1].y - rightEyeWidth * 0.5,
            rightEye[0].x + rightEyeWidth * 0.7, // Extended outer corner
            rightEye[0].y - rightEyeWidth * 0.3 // Lifted winged effect
        );
        ctx.lineTo(rightEye[0].x, rightEye[0].y); // Outer corner
        ctx.lineTo(rightEye[3].x, rightEye[3].y); // Lower outer point
        ctx.quadraticCurveTo(
            rightEyeCenter.x,
            rightEyeCenter.y + rightEyeWidth * 0.1,
            rightEye[4].x, rightEye[4].y // Lower inner point
        );
        ctx.closePath();
        
        // Create gradient for cat eye effect
        const rightGradient = ctx.createLinearGradient(
            rightEye[1].x, rightEye[1].y, // Inner point
            rightEye[0].x + rightEyeWidth * 0.7, rightEye[0].y - rightEyeWidth * 0.3 // Outer extended point
        );
        rightGradient.addColorStop(0, color.replace(/[\d.]+\)$/, '0.4)')); // More transparent at inner corner
        rightGradient.addColorStop(1, color); // Full color at outer corner
        
        ctx.fillStyle = rightGradient;
        ctx.fill();
    }
    
    // Apply halo eyeshadow
    function applyHaloEyeshadow(ctx, leftEye, rightEye, color, intensity) {
        // Calculate eye dimensions
        const leftEyeCenter = { 
            x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
            y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
            x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
            y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
        };
        
        // Calculate eye size
        const leftEyeWidth = Math.max(...leftEye.map(p => p.x)) - Math.min(...leftEye.map(p => p.x));
        const rightEyeWidth = Math.max(...rightEye.map(p => p.x)) - Math.min(...rightEye.map(p => p.x));
        
        // Extract color components for creating lighter center
        let colorValues = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        let r, g, b, a;
        
        if (colorValues) {
            r = parseInt(colorValues[1]);
            g = parseInt(colorValues[2]);
            b = parseInt(colorValues[3]);
            a = colorValues[4] ? parseFloat(colorValues[4]) : 1;
            
            // Create lighter center color
            const lighterColor = `rgba(255, 250, 240, ${a * 0.9})`;
            
            // Apply halo eyeshadow - darker outer/inner corners, light center
            ctx.globalAlpha = intensity * 0.8;
            ctx.filter = 'blur(6px)';
            
            // Left eye
            // Outer dark section
            ctx.beginPath();
            ctx.ellipse(
                leftEye[0].x, leftEyeCenter.y - leftEyeWidth * 0.1,
                leftEyeWidth * 0.4, leftEyeWidth * 0.5,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = color;
            ctx.fill();
            
            // Inner dark section
            ctx.beginPath();
            ctx.ellipse(
                leftEye[2].x, leftEyeCenter.y - leftEyeWidth * 0.1,
                leftEyeWidth * 0.4, leftEyeWidth * 0.5,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = color;
            ctx.fill();
            
            // Center light section (the halo)
            ctx.beginPath();
            ctx.ellipse(
                leftEyeCenter.x, leftEyeCenter.y - leftEyeWidth * 0.1,
                leftEyeWidth * 0.3, leftEyeWidth * 0.4,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = lighterColor;
            ctx.filter = 'blur(3px)';
            ctx.fill();
            
            // Right eye
            // Reset blur for dark sections
            ctx.filter = 'blur(6px)';
            
            // Outer dark section
            ctx.beginPath();
            ctx.ellipse(
                rightEye[0].x, rightEyeCenter.y - rightEyeWidth * 0.1,
                rightEyeWidth * 0.4, rightEyeWidth * 0.5,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = color;
            ctx.fill();
            
            // Inner dark section
            ctx.beginPath();
            ctx.ellipse(
                rightEye[2].x, rightEyeCenter.y - rightEyeWidth * 0.1,
                rightEyeWidth * 0.4, rightEyeWidth * 0.5,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = color;
            ctx.fill();
            
            // Center light section (the halo)
            ctx.beginPath();
            ctx.ellipse(
                rightEyeCenter.x, rightEyeCenter.y - rightEyeWidth * 0.1,
                rightEyeWidth * 0.3, rightEyeWidth * 0.4,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = lighterColor;
            ctx.filter = 'blur(3px)';
            ctx.fill();
        } else {
            // Fallback if color parsing fails
            applyNaturalEyeshadow(ctx, leftEye, rightEye, color, intensity);
        }
    }
    
    // Apply cut crease eyeshadow
    function applyCutCreaseEyeshadow(ctx, leftEye, rightEye, color, intensity) {
        // Implement cut crease style in a future update
        // For now, fall back to smoky eye style
        applySmokyEyeshadow(ctx, leftEye, rightEye, color, intensity);
    }
    
    // Apply eyeliner
    function applyEyeliner(ctx, detection, style) {
        // Implement eyeliner in a future update
    }
    
    // Apply mascara
    function applyMascara(ctx, detection, style) {
        // Implement mascara in a future update
    }
    
    // Apply brows
    function applyBrows(ctx, detection, style) {
        // Implement brows in a future update
    }
    
    // Apply lipstick
    function applyLipstick(ctx, detection, style) {
        const landmarks = detection.landmarks.positions;
        
        // Get lips landmarks (points 48-67)
        const lips = landmarks.slice(48, 68);
        const outerLips = lips.slice(0, 12); // Points 48-59
        const innerLips = lips.slice(12); // Points 60-67
        
        // Get lipstick color and style
        const lipColor = getLipColor(makeupConfig.lipstick.color, style);
        const lipIntensity = makeupConfig.lipstick.intensity || 0.7;
        
        ctx.save();
        
        // Apply lipstick based on style with improved realism
        switch (makeupConfig.lipstick.style) {
            case 'glossy':
                applyGlossyLipstick(ctx, outerLips, innerLips, lipColor, lipIntensity);
                break;
                
            case 'matte':
                applyMatteLipstick(ctx, outerLips, innerLips, lipColor, lipIntensity);
                break;
                
            case 'sheer':
                applySheerLipstick(ctx, outerLips, innerLips, lipColor, lipIntensity);
                break;
                
            case 'ombre':
                applyOmbreLipstick(ctx, outerLips, innerLips, lipColor, lipIntensity);
                break;
                
            case 'satin':
            default:
                applySatinLipstick(ctx, outerLips, innerLips, lipColor, lipIntensity);
                break;
        }
        
        ctx.restore();
    }
    
    // Apply matte lipstick
    function applyMatteLipstick(ctx, outerLips, innerLips, color, intensity) {
        ctx.globalAlpha = intensity * 1.0; // Increased to full intensity
        
        // Draw outer lip shape
        ctx.beginPath();
        ctx.moveTo(outerLips[0].x, outerLips[0].y);
        
        // Connect all points of outer lips with smoother curves
        ctx.lineTo(outerLips[1].x, outerLips[1].y);
        for (let i = 2; i < outerLips.length; i++) {
            // Use quadratic curves for smoother lip outline
            const prevPoint = outerLips[i-1];
            const currPoint = outerLips[i];
            const cpX = (prevPoint.x + currPoint.x) / 2;
            const cpY = (prevPoint.y + currPoint.y) / 2;
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
        }
        
        // Close the path with a curve back to the start
        const lastPoint = outerLips[outerLips.length-1];
        const firstPoint = outerLips[0];
        const cpX = (lastPoint.x + firstPoint.x) / 2;
        const cpY = (lastPoint.y + firstPoint.y) / 2;
        ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, cpX, cpY);
        ctx.quadraticCurveTo(cpX, cpY, firstPoint.x, firstPoint.y);
        
        // Fill with matte color with very slight blur for skin texture
        ctx.fillStyle = color;
        ctx.filter = 'blur(2px)';
        ctx.fill();
        
        // Add subtle shadows at lip corners for dimension
        ctx.globalAlpha = intensity * 0.3;
        ctx.filter = 'blur(3px)';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        
        // Left corner shadow
        ctx.beginPath();
        ctx.arc(outerLips[0].x, outerLips[0].y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Right corner shadow
        ctx.beginPath();
        ctx.arc(outerLips[6].x, outerLips[6].y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Apply glossy lipstick
    function applyGlossyLipstick(ctx, outerLips, innerLips, color, intensity) {
        ctx.globalAlpha = intensity * 0.9; // Increased from 0.8 for more visibility
        
        // Draw outer lip shape with smoother curves
        ctx.beginPath();
        ctx.moveTo(outerLips[0].x, outerLips[0].y);
        
        // Connect points with curves for smoother lips
        ctx.lineTo(outerLips[1].x, outerLips[1].y);
        for (let i = 2; i < outerLips.length; i++) {
            const prevPoint = outerLips[i-1];
            const currPoint = outerLips[i];
            const cpX = (prevPoint.x + currPoint.x) / 2;
            const cpY = (prevPoint.y + currPoint.y) / 2;
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
        }
        
        // Close the path smoothly
        const lastPoint = outerLips[outerLips.length-1];
        const firstPoint = outerLips[0];
        const cpX = (lastPoint.x + firstPoint.x) / 2;
        const cpY = (lastPoint.y + firstPoint.y) / 2;
        ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, cpX, cpY);
        ctx.quadraticCurveTo(cpX, cpY, firstPoint.x, firstPoint.y);
        
        // Create lip center coordinates for highlight
        const lipCenterX = outerLips.reduce((sum, p) => sum + p.x, 0) / outerLips.length;
        const lipCenterY = outerLips.reduce((sum, p) => sum + p.y, 0) / outerLips.length;
        
        // Width of lips for gradient
        const lipWidth = Math.max(...outerLips.map(p => p.x)) - Math.min(...outerLips.map(p => p.x));
        
        // Create radial gradient for glossy effect
        const glossGradient = ctx.createRadialGradient(
            lipCenterX, lipCenterY, 0,
            lipCenterX, lipCenterY, lipWidth * 0.7
        );
        
        // Parse color to get base RGB
        let colorValues = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        let r, g, b, a;
        
        if (colorValues) {
            r = parseInt(colorValues[1]);
            g = parseInt(colorValues[2]);
            b = parseInt(colorValues[3]);
            a = colorValues[4] ? parseFloat(colorValues[4]) : 1;
            
            // Add shine effect with gradient - more subtle for realism
            const lighterColor = `rgba(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)}, ${a * 0.9})`;
            const darkerColor = `rgba(${Math.max(r - 20, 0)}, ${Math.max(g - 20, 0)}, ${Math.max(b - 20, 0)}, ${a})`;
            
            glossGradient.addColorStop(0, lighterColor);
            glossGradient.addColorStop(0.4, color);
            glossGradient.addColorStop(1, darkerColor);
        } else {
            // Fallback if color parsing fails
            glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glossGradient.addColorStop(0.4, color);
            glossGradient.addColorStop(1, color);
        }
        
        ctx.fillStyle = glossGradient;
        ctx.filter = 'blur(3px)'; // Slightly increased blur for lip texture
        ctx.fill();
        
        // Add realistic shine highlights
        ctx.globalAlpha = intensity * 0.5; // Increased from 0.35 for more visible shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.filter = 'blur(4px)';
        
        // Draw main highlight in center of lips
        ctx.beginPath();
        ctx.ellipse(
            lipCenterX, lipCenterY * 0.99, // Slightly above center
            lipWidth * 0.12, // Width of highlight
            lipWidth * 0.04, // Height of highlight
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add a smaller secondary highlight for realism
        ctx.globalAlpha = intensity * 0.25; // Increased from 0.15
        ctx.beginPath();
        ctx.ellipse(
            lipCenterX, lipCenterY * 0.96, // Higher than main highlight
            lipWidth * 0.06, // Smaller than main highlight
            lipWidth * 0.02,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add subtle shadows at lip corners for dimension
        ctx.globalAlpha = intensity * 0.25;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        
        // Left corner shadow
        ctx.beginPath();
        ctx.arc(outerLips[0].x, outerLips[0].y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Right corner shadow
        ctx.beginPath();
        ctx.arc(outerLips[6].x, outerLips[6].y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Apply sheer lipstick
    function applySheerLipstick(ctx, outerLips, innerLips, color, intensity) {
        // Sheer lipstick has lower opacity
        ctx.globalAlpha = intensity * 0.5;
        
        // Draw outer lip shape
        ctx.beginPath();
        ctx.moveTo(outerLips[0].x, outerLips[0].y);
        
        // Connect all points of outer lips
        for (let i = 1; i < outerLips.length; i++) {
            ctx.lineTo(outerLips[i].x, outerLips[i].y);
        }
        
        // Close the path
        ctx.closePath();
        
        // Fill with semi-transparent color
        ctx.fillStyle = color;
        ctx.filter = 'blur(3px)';
        ctx.fill();
    }
    
    // Apply ombre lipstick
    function applyOmbreLipstick(ctx, outerLips, innerLips, color, intensity) {
        ctx.globalAlpha = intensity * 0.9;
        
        // Draw outer lip shape
        ctx.beginPath();
        ctx.moveTo(outerLips[0].x, outerLips[0].y);
        
        // Connect all points of outer lips
        for (let i = 1; i < outerLips.length; i++) {
            ctx.lineTo(outerLips[i].x, outerLips[i].y);
        }
        
        // Close the path
        ctx.closePath();
        
        // Create lip center coordinates for gradient
        const lipCenterX = outerLips.reduce((sum, p) => sum + p.x, 0) / outerLips.length;
        const lipCenterY = outerLips.reduce((sum, p) => sum + p.y, 0) / outerLips.length;
        
        // Calculate lip dimensions
        const lipTop = Math.min(...outerLips.map(p => p.y));
        const lipBottom = Math.max(...outerLips.map(p => p.y));
        const lipLeft = Math.min(...outerLips.map(p => p.x));
        const lipRight = Math.max(...outerLips.map(p => p.x));
        
        // Parse color to get base RGB
        let colorValues = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        let r, g, b, a;
        
        if (colorValues) {
            r = parseInt(colorValues[1]);
            g = parseInt(colorValues[2]);
            b = parseInt(colorValues[3]);
            a = colorValues[4] ? parseFloat(colorValues[4]) : 1;
            
            // Create darker color for outer edges
            const darkerColor = `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, ${a})`;
            
            // Create linear gradient for ombre effect - darker on edges
            const ombreGradient = ctx.createRadialGradient(
                lipCenterX, lipCenterY, 0,
                lipCenterX, lipCenterY, (lipRight - lipLeft) * 0.7
            );
            
            ombreGradient.addColorStop(0, color);
            ombreGradient.addColorStop(1, darkerColor);
            
            ctx.fillStyle = ombreGradient;
        } else {
            // Fallback if color parsing fails
            ctx.fillStyle = color;
        }
        
        ctx.filter = 'blur(2px)';
        ctx.fill();
    }
    
    // Apply satin lipstick
    function applySatinLipstick(ctx, outerLips, innerLips, color, intensity) {
        // Satin is between matte and glossy
        ctx.globalAlpha = intensity * 0.8;
        
        // Draw outer lip shape
        ctx.beginPath();
        ctx.moveTo(outerLips[0].x, outerLips[0].y);
        
        // Connect all points of outer lips
        for (let i = 1; i < outerLips.length; i++) {
            ctx.lineTo(outerLips[i].x, outerLips[i].y);
        }
        
        // Close the path
        ctx.closePath();
        
        // Fill with color
        ctx.fillStyle = color;
        ctx.filter = 'blur(2px)';
        ctx.fill();
        
        // Add subtle shine
        ctx.globalAlpha = intensity * 0.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        // Calculate lip center
        const lipCenterX = outerLips.reduce((sum, p) => sum + p.x, 0) / outerLips.length;
        const lipCenterY = outerLips.reduce((sum, p) => sum + p.y, 0) / outerLips.length;
        const lipWidth = Math.max(...outerLips.map(p => p.x)) - Math.min(...outerLips.map(p => p.x));
        
        // Draw highlight in center of lips
        ctx.beginPath();
        ctx.ellipse(
            lipCenterX, lipCenterY * 0.98,
            lipWidth * 0.1,
            lipWidth * 0.03,
            0, 0, Math.PI * 2
        );
        ctx.filter = 'blur(5px)';
        ctx.fill();
    }
    
    // Upload Image Handler
    const uploadInput = document.getElementById('upload-input');
    if (uploadInput) {
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Create a new image to get natural dimensions
                    const img = new Image();
                    img.onload = function() {
                        // Update preview image
                        previewImg.src = img.src;
                        
                        // Reset makeup canvas
                        const ctx = makeupCanvas.getContext('2d');
                        ctx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
                        makeupCanvas.style.opacity = '0';
                        
                        // Disable buttons until makeup is applied
                        document.getElementById('save-image').disabled = true;
                        document.getElementById('reset-image').disabled = true;
                    };
                    
                    img.src = event.target.result;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Webcam toggle handler
    const webcamToggle = document.getElementById('webcam-toggle');
    const webcamContainer = document.getElementById('webcam-container');
    const uploadContainer = document.getElementById('upload-container');
    const webcam = document.getElementById('webcam');
    const captureBtn = document.getElementById('capture-btn');
    
    let stream = null;
    
    if (webcamToggle && webcamContainer && uploadContainer && webcam && captureBtn) {
        // Make sure webcam has these attributes directly in the HTML
        webcam.setAttribute('autoplay', '');
        webcam.setAttribute('playsinline', '');
        webcam.setAttribute('muted', '');
        webcam.style.transform = 'scaleX(-1)'; // Mirror effect for selfie view
        
        // Clean up the UI by removing old elements and creating new ones
        function setupCameraInterface() {
            // Remove existing buttons if they exist
            const existingDirectButton = document.getElementById('direct-camera-btn');
            if (existingDirectButton) {
                existingDirectButton.remove();
            }
            
            // Remove any standalone buttons
            const existingStandaloneButton = document.getElementById('standalone-photo-btn');
            if (existingStandaloneButton) {
                existingStandaloneButton.remove();
            }
            
            // Find the appropriate container to add the buttons
            const uploadInputContainer = document.querySelector('#upload-input').parentNode;
            if (uploadInputContainer) {
                // Store reference to upload input before clearing
                const originalInput = document.getElementById('upload-input');
                
                // Clear existing content
                uploadInputContainer.innerHTML = '';
                
                // Create container with proper styling
                const outerContainer = document.createElement('div');
                outerContainer.className = 'flex flex-row items-center justify-center gap-4 my-4';
                
                // Create the Upload Photo button 
                const uploadButton = document.createElement('button');
                uploadButton.id = 'upload-photo-btn';
                uploadButton.className = 'bg-pink-500 text-white py-3 px-6 rounded-full flex items-center justify-center cursor-pointer';
                uploadButton.innerHTML = '<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg> Upload Photo';
                uploadButton.type = 'button';
                
                // Create the Take Photo Now button
                const takePhotoButton = document.createElement('button');
                takePhotoButton.id = 'take-photo-now-btn';
                takePhotoButton.className = 'bg-blue-500 text-white py-3 px-6 rounded-full flex items-center justify-center cursor-pointer';
                takePhotoButton.innerHTML = '<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Take Photo Now';
                takePhotoButton.type = 'button';
                
                // Create new file input
                const newUploadInput = document.createElement('input');
                newUploadInput.type = 'file';
                newUploadInput.id = 'upload-input';
                newUploadInput.accept = 'image/*';
                newUploadInput.className = 'hidden';
                
                // Add the event listener to file input
                newUploadInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    
                    if (file) {
                        const reader = new FileReader();
                        
                        reader.onload = function(event) {
                            // Create a new image to get natural dimensions
                            const img = new Image();
                            img.onload = function() {
                                // Update preview image
                                const previewImg = document.getElementById('preview-img');
                                if (previewImg) {
                                    previewImg.src = img.src;
                                    
                                    // Reset makeup canvas
                                    const makeupCanvas = document.getElementById('makeup-canvas');
                                    if (makeupCanvas) {
                                        const ctx = makeupCanvas.getContext('2d');
                                        ctx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
                                        makeupCanvas.style.opacity = '0';
                                    }
                                    
                                    // Reset face landmarks canvas
                                    const landmarksCanvas = document.getElementById('face-landmarks');
                                    if (landmarksCanvas) {
                                        const lctx = landmarksCanvas.getContext('2d');
                                        lctx.clearRect(0, 0, landmarksCanvas.width, landmarksCanvas.height);
                                    }
                                    
                                    // Disable buttons until makeup is applied
                                    const saveBtn = document.getElementById('save-image');
                                    const resetBtn = document.getElementById('reset-image');
                                    if (saveBtn) saveBtn.disabled = true;
                                    if (resetBtn) resetBtn.disabled = true;
                                    
                                    // Show the preview container and hide webcam
                                    const webcamContainer = document.getElementById('webcam-container');
                                    const uploadContainer = document.getElementById('upload-container');
                                    if (webcamContainer) webcamContainer.classList.add('hidden');
                                    if (uploadContainer) uploadContainer.classList.remove('hidden');
                                    
                                    console.log('Image loaded successfully via upload');
                                }
                            };
                            
                            img.src = event.target.result;
                        };
                        
                        reader.readAsDataURL(file);
                    }
                });
                
                // Set up the upload button to trigger the file input (completely separate from the take photo button)
                uploadButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const inputElement = document.getElementById('upload-input');
                    if (inputElement) {
                        inputElement.click();
                    } else {
                        console.error('Upload input element not found');
                    }
                });
                
                // Set up the camera button to start the webcam (completely separate from the upload button)
                takePhotoButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Make sure we have the required elements
                    const webcamContainer = document.getElementById('webcam-container');
                    const uploadContainer = document.getElementById('upload-container');
                    
                    if (webcamContainer && uploadContainer) {
                        // Show webcam container, hide upload container
                        webcamContainer.classList.remove('hidden');
                        uploadContainer.classList.add('hidden');
                        
                        // Start webcam
                        startWebcam();
                    } else {
                        console.error('Required containers not found');
                    }
                });
                
                // Add buttons to the container
                outerContainer.appendChild(uploadButton);
                outerContainer.appendChild(takePhotoButton);
                
                // Add file input and container to the page
                uploadInputContainer.appendChild(newUploadInput);
                uploadInputContainer.appendChild(outerContainer);
            }
            
            // Update the capture button to match the design
            if (captureBtn) {
                captureBtn.innerHTML = '<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Capture Photo';
                captureBtn.className = 'bg-blue-500 text-white py-3 px-6 rounded-full flex items-center justify-center my-2';
            }
            
            // Hide the webcam toggle button if it exists
            if (webcamToggle) {
                webcamToggle.style.display = 'none';
            }
        }
        
        // Create the new UI when the page loads
        setupCameraInterface();
        
        function startWebcam() {
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loader';
            loadingIndicator.id = 'webcam-loader';
            webcamContainer.prepend(loadingIndicator);
            
            // Clear any previous error messages
            const errorMessage = document.getElementById('webcam-error-message');
            if (errorMessage) errorMessage.remove();
            
            // Add camera instructions if they don't exist
            if (!document.getElementById('camera-instructions')) {
                const instructions = document.createElement('div');
                instructions.id = 'camera-instructions';
                instructions.className = 'text-center text-gray-700 mb-3 bg-gray-100 rounded-lg p-3 shadow-sm';
                instructions.innerHTML = `
                    <p class="font-medium">Camera Preview</p>
                    <p class="text-sm">Position your face in the center of the frame</p>
                `;
                webcamContainer.prepend(instructions);
            }
            
            // Ensure webcam is visible
            webcamContainer.classList.remove('hidden');
            uploadContainer.classList.add('hidden');
            
            // Hide the standalone button when camera is active
            const standaloneBtn = document.getElementById('standalone-photo-btn');
            if (standaloneBtn) {
                standaloneBtn.style.display = 'none';
            }
            
            // Use constraints focused on front camera with standard resolution
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            })
            .then(function(mediaStream) {
                // Remove loading indicator
                const loader = document.getElementById('webcam-loader');
                if (loader) loader.remove();
                
                // Store stream globally
                stream = mediaStream;
                
                // Ensure old streams are stopped
                if (webcam.srcObject) {
                    const tracks = webcam.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
                
                // Set new stream and make webcam visible
                webcam.srcObject = mediaStream;
                webcam.style.display = 'block';
                webcam.style.opacity = '1';
                
                // Add a stylish frame around the webcam
                webcam.classList.add('rounded-lg', 'shadow-lg', 'border-4', 'border-pink-300');
                
                // Force webcam to play - this is critical
                webcam.play()
                    .then(() => {
                        console.log('Webcam playing successfully');
                        captureBtn.disabled = false;
                    })
                    .catch(e => {
                        console.error('Error playing webcam:', e);
                        handleWebcamError({name: 'PlaybackError'});
                    });
                
                // After successful connection, add a clear success message
                const successMessage = document.createElement('div');
                successMessage.id = 'webcam-success-message';
                successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg my-2 shadow-md animate-fadeIn';
                successMessage.innerHTML = 'Camera connected! Click <strong>Capture Photo</strong> when ready.';
                webcamContainer.insertBefore(successMessage, captureBtn.parentNode);
                
                // Add animation keyframes if they don't exist
                if (!document.getElementById('camera-animations')) {
                    const style = document.createElement('style');
                    style.id = 'camera-animations';
                    style.textContent = `
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .animate-fadeIn {
                            animation: fadeIn 0.5s ease-out forwards;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    const msg = document.getElementById('webcam-success-message');
                    if (msg) {
                        msg.style.opacity = '0';
                        msg.style.transform = 'translateY(-10px)';
                        msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        setTimeout(() => {
                            if (msg.parentNode) {
                                msg.parentNode.removeChild(msg);
                            }
                        }, 500);
                    }
                }, 3000);
            })
            .catch(function(error) {
                console.error('Error accessing webcam:', error);
                
                // Remove loading indicator
                const loader = document.getElementById('webcam-loader');
                if (loader) loader.remove();
                
                handleWebcamError(error);
            });
        }
        
        // Initialize webcam when the toggle button is clicked
        webcamToggle.addEventListener('click', function() {
            if (webcamContainer.classList.contains('hidden')) {
                startWebcam();
            } else {
                // Hide webcam
                webcamContainer.classList.add('hidden');
                uploadContainer.classList.remove('hidden');
                
                // Show the standalone button again
                const standaloneBtn = document.getElementById('standalone-photo-btn');
                if (standaloneBtn) {
                    standaloneBtn.style.display = 'flex';
                }
                
                // Stop webcam
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    stream = null;
                }
            }
        });
    }
}); 