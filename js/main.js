// Main JavaScript File for Glam Up

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    console.log("DOM loaded, initializing components...");
    
    // Ensure all scripts are loaded
    checkScriptsLoaded();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('open');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Close mobile menu if it's open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
            }
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll reveal animation
    window.addEventListener('scroll', revealOnScroll);
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }
    
    // Create sparkle effect for hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        for (let i = 0; i < 20; i++) {
            createSparkle(heroSection);
        }
    }
    
    function createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 5;
        
        // Set styles
        sparkle.style.left = `${posX}%`;
        sparkle.style.top = `${posY}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;
        
        container.appendChild(sparkle);
    }
    
    // Select all color swatches
    const colorSwatches = document.querySelectorAll('[data-color]');
    colorSwatches.forEach(swatch => {
        swatch.classList.add('color-swatch');
        swatch.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Add selected class to clicked swatch
            this.classList.add('selected');
        });
    });
    
    // Handle webcam toggle
    const webcamToggle = document.getElementById('webcam-toggle');
    const webcamContainer = document.getElementById('webcam-container');
    const uploadContainer = document.getElementById('upload-container');
    const webcamElement = document.getElementById('webcam');
    const captureBtn = document.getElementById('capture-btn');
    let stream = null;
    
    if (webcamToggle && webcamContainer && uploadContainer) {
        webcamToggle.addEventListener('click', function() {
            if (webcamContainer.classList.contains('hidden')) {
                // Show webcam
                webcamContainer.classList.remove('hidden');
                uploadContainer.classList.add('hidden');
                
                // Request webcam access
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(mediaStream) {
                        stream = mediaStream;
                        webcamElement.srcObject = mediaStream;
                    })
                    .catch(function(error) {
                        console.error('Error accessing webcam:', error);
                        alert('Unable to access webcam. Please make sure you have given permission.');
                        
                        // Show upload container again
                        webcamContainer.classList.add('hidden');
                        uploadContainer.classList.remove('hidden');
                    });
            } else {
                // Hide webcam
                webcamContainer.classList.add('hidden');
                uploadContainer.classList.remove('hidden');
                
                // Stop webcam stream
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        });
    }
    
    if (captureBtn && webcamElement && uploadContainer && webcamContainer) {
        captureBtn.addEventListener('click', function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = webcamElement.videoWidth;
            canvas.height = webcamElement.videoHeight;
            
            // Draw video frame to canvas
            context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
            
            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
            
            // Update preview image
            const previewImg = document.getElementById('preview-img');
            if (previewImg) {
                previewImg.src = dataURL;
            }
            
            // Show upload container
            webcamContainer.classList.add('hidden');
            uploadContainer.classList.remove('hidden');
            
            // Stop webcam stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });
    }
    
    // File upload handling
    const uploadInput = document.getElementById('upload-input');
    const previewImg = document.getElementById('preview-img');
    
    if (uploadInput && previewImg) {
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    previewImg.src = event.target.result;
                    
                    // Enable Save and Reset buttons
                    document.getElementById('save-image').disabled = false;
                    document.getElementById('reset-image').disabled = false;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Reset image button
    const resetImageBtn = document.getElementById('reset-image');
    if (resetImageBtn && previewImg) {
        resetImageBtn.addEventListener('click', function() {
            // Reset makeup canvas
            const makeupCanvas = document.getElementById('makeup-canvas');
            if (makeupCanvas) {
                const ctx = makeupCanvas.getContext('2d');
                ctx.clearRect(0, 0, makeupCanvas.width, makeupCanvas.height);
                makeupCanvas.style.opacity = 0;
            }
            
            // Reset styling/UI
            resetImageBtn.disabled = true;
            document.getElementById('save-image').disabled = true;
        });
    }
    
    // Save image button
    const saveImageBtn = document.getElementById('save-image');
    if (saveImageBtn && previewImg) {
        saveImageBtn.addEventListener('click', function() {
            const makeupCanvas = document.getElementById('makeup-canvas');
            if (!makeupCanvas || makeupCanvas.style.opacity === '0') {
                alert('Please apply makeup first before saving.');
                return;
            }
            
            const downloadCanvas = document.createElement('canvas');
            const ctx = downloadCanvas.getContext('2d');
            
            // Set canvas size
            downloadCanvas.width = previewImg.naturalWidth;
            downloadCanvas.height = previewImg.naturalHeight;
            
            // Draw original image
            ctx.drawImage(previewImg, 0, 0, downloadCanvas.width, downloadCanvas.height);
            
            // Draw makeup layer
            ctx.drawImage(makeupCanvas, 0, 0, downloadCanvas.width, downloadCanvas.height);
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'glam-up-makeup.png';
            link.href = downloadCanvas.toDataURL('image/png');
            link.click();
        });
    }
    
    // Check if chatbot script is loaded
    function checkScriptsLoaded() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbot = document.getElementById('chatbot');
        
        if (chatbotToggle && chatbot) {
            console.log("Chatbot elements found in DOM");
            
            // Initialize chatbot (backup initialization in case chatbot.js fails)
            if (typeof initChatbot === 'function') {
                console.log("Using chatbot.js initialization");
            } else {
                console.log("Fallback initialization for chatbot");
                // Hide chatbot initially
                chatbot.style.transform = 'translateY(100%)';
                chatbot.style.opacity = '0';
                
                // Setup toggle
                chatbotToggle.addEventListener('click', function() {
                    console.log("Toggle clicked (from main.js)");
                    if (chatbot.style.transform === 'translateY(100%)') {
                        chatbot.style.transform = 'translateY(0)';
                        chatbot.style.opacity = '1';
                    } else {
                        chatbot.style.transform = 'translateY(100%)';
                        chatbot.style.opacity = '0';
                    }
                });
                
                // Setup close button
                const closeBtn = document.getElementById('close-chatbot');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        chatbot.style.transform = 'translateY(100%)';
                        chatbot.style.opacity = '0';
                    });
                }
            }
        } else {
            console.error("Chatbot elements not found!");
        }
    }
    
    // Chatbot simple functionality (just for UI demo)
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatInput && sendButton && chatMessages) {
        const sendMessage = function() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessageHTML = `
                    <div class="flex justify-end mb-4">
                        <div class="chat-bubble-user">
                            <p class="text-white">${message}</p>
                        </div>
                    </div>
                `;
                chatMessages.innerHTML += userMessageHTML;
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate bot response after short delay
                setTimeout(() => {
                    const botResponses = [
                        "I recommend trying our 'Glamour' makeup style with the red lipstick for a bold look!",
                        "The winged eyeliner option will really make your eyes pop! Give it a try.",
                        "For your skin tone, a peachy blush would look gorgeous. You can select it in the face tab.",
                        "Try the 'Natural' style for an everyday look that enhances your features subtly.",
                        "The K-Pop inspired look is trending right now! It features soft eyeshadow and glossy lips.",
                        "Foundation tip: Always blend down your neck for a seamless finish!",
                        "Have you tried the matte lipstick option yet? It's perfect for long-lasting color.",
                        "For special occasions, the 'Party Ready' style adds just the right amount of sparkle and glow!"
                    ];
                    
                    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                    
                    // Add bot response
                    const botMessageHTML = `
                        <div class="flex mb-4">
                            <div class="chat-bubble-bot">
                                <p class="text-gray-800">${randomResponse}</p>
                            </div>
                        </div>
                    `;
                    chatMessages.innerHTML += botMessageHTML;
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        };
        
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Handle makeup tab functionality
    const makeupTabs = document.querySelectorAll('.makeup-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (makeupTabs.length && tabContents.length) {
        makeupTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                makeupTabs.forEach(t => {
                    t.classList.remove('active', 'border-b-2', 'border-pink-500', 'text-pink-500');
                });
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                // Add active class to clicked tab
                this.classList.add('active', 'border-b-2', 'border-pink-500', 'text-pink-500');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.remove('hidden');
                }
            });
        });
    }
    
    // Add interactive sparkle effect to the try-on section
    const tryOnSection = document.getElementById('try-on');
    
    if (tryOnSection) {
        // Create sparkles periodically
        setInterval(() => {
            createSparkle(tryOnSection);
        }, 300);
    }
}); 