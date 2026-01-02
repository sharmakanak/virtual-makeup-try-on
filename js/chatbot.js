// Chatbot JavaScript - Local Version (No API Required)

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded in chatbot.js");

    // Get elements
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbot = document.getElementById('chatbot');
    const closeBtn = document.getElementById('close-chatbot');

    // Conversation history for context
    let conversationHistory = [];

    // Log elements to check if they're found
    console.log("Chatbot elements found:", {
        chatbotToggle: !!chatbotToggle,
        chatbot: !!chatbot,
        closeBtn: !!closeBtn,
        chatMessages: !!chatMessages,
        chatInput: !!chatInput,
        sendMessage: !!sendMessage
    });

    // Ensure the chatbot starts hidden
    if (chatbot) {
        chatbot.style.transform = 'translateY(100%)';
        chatbot.style.opacity = '0';
    }

    // Basic toggle functionality (backup to the inline onclick)
    if (chatbotToggle && chatbot) {
        chatbotToggle.addEventListener('click', function () {
            console.log("Toggle clicked from JS");
            chatbot.style.transform = 'translateY(0)';
            chatbot.style.opacity = '1';
        });
    }

    // Close button (backup to the inline onclick)
    if (closeBtn && chatbot) {
        closeBtn.addEventListener('click', function () {
            console.log("Close clicked from JS");
            chatbot.style.transform = 'translateY(100%)';
            chatbot.style.opacity = '0';
        });
    }

    // Setup send message functionality
    if (sendMessage && chatInput && chatMessages) {
        // Send message on button click
        sendMessage.addEventListener('click', handleSendMessage);

        // Also set direct onclick as backup
        sendMessage.onclick = handleSendMessage;

        // Send message on Enter key
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Function to handle sending a message
    function handleSendMessage() {
        console.log("Send button clicked");
        const message = chatInput.value.trim();

        if (message) {
            // Add user message to chat
            addMessageToChat(message, 'user');

            // Add to conversation history
            conversationHistory.push({ role: "user", text: message });

            // Clear input field
            chatInput.value = '';

            // Show typing indicator
            showTypingIndicator();

            // Simulate thinking time for more natural feel
            setTimeout(() => {
                // Remove typing indicator
                removeTypingIndicator();

                // Get local response
                const response = getLocalResponse(message);
                addMessageToChat(response, 'bot');

                // Add to conversation history
                conversationHistory.push({ role: "assistant", text: response });
            }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
        }
    }

    // Enhanced local response function with comprehensive beauty knowledge
    function getLocalResponse(message) {
        message = message.toLowerCase();

        // Comprehensive knowledge base with detailed responses
        const knowledgeBase = {
            // Makeup tutorials and how-to guides
            lipstick: {
                keywords: ['lipstick', 'lip', 'lips', 'lip color', 'lip shade'],
                responses: [
                    "For the perfect lipstick application: 1) Exfoliate and moisturize your lips first. 2) Use a lip liner to define and prevent feathering. 3) Apply lipstick from the center outward. 4) Blot with tissue and reapply for longer wear. Pro tip: Add a touch of gloss to the center for a fuller look! 💄",
                    "Choosing the right lipstick shade depends on your undertone! Warm undertones look great with coral, peach, and warm reds. Cool undertones suit berry, pink, and blue-based reds. Neutral undertones can rock almost any shade! What's your undertone?",
                    "For long-lasting lipstick: Start with a lip primer, apply your lipstick, blot with tissue, dust with translucent powder, then apply another layer. Finish with setting spray for all-day wear! ✨"
                ]
            },
            foundation: {
                keywords: ['foundation', 'base', 'coverage', 'skin tone', 'complexion'],
                responses: [
                    "Finding the right foundation shade: Always test on your jawline, not your hand! The perfect match should disappear into your skin. Check in natural light and make sure it matches your neck and chest. Your foundation should match your undertone - warm (yellow/golden), cool (pink/red), or neutral. 🌟",
                    "For flawless foundation application: 1) Start with moisturized, primed skin. 2) Use a damp beauty sponge or brush for even coverage. 3) Build coverage gradually - less is more! 4) Set with powder only where needed (T-zone). 5) Finish with setting spray for a natural, long-lasting finish.",
                    "Different skin types need different foundations! Dry skin: Look for hydrating, dewy formulas. Oily skin: Choose matte, oil-free options. Combination: Use different formulas on different zones, or try a satin finish. Always prep with the right primer!"
                ]
            },
            eyeshadow: {
                keywords: ['eyeshadow', 'eye shadow', 'eye makeup', 'eye color', 'eyes'],
                responses: [
                    "Basic eyeshadow technique: 1) Apply a light shade all over the lid as a base. 2) Add a medium shade to the crease for depth. 3) Use a darker shade on the outer corner for dimension. 4) Highlight the inner corner and brow bone. 5) Blend, blend, blend! The key is seamless transitions. ✨",
                    "Color theory for eyes: Blue eyes pop with warm oranges, coppers, and golds. Brown eyes look stunning with purples, greens, and blues. Green eyes shine with burgundy, plum, and rose gold. Hazel eyes can wear almost anything, especially purples and greens!",
                    "For a smokey eye: Start with a dark base on the lid, blend a medium shade into the crease, then use a lighter shade to blend upward. Add black liner and smudge it out. Finish with mascara or false lashes. Remember - the darker the eye, the softer the lip! 🖤"
                ]
            },
            skincare: {
                keywords: ['skincare', 'skin care', 'moisturizer', 'cleanser', 'serum', 'routine', 'acne', 'wrinkle', 'pore'],
                responses: [
                    "A basic skincare routine: Morning - Cleanser, toner, serum (vitamin C), moisturizer, SPF. Evening - Cleanser, toner, treatment (retinol/acids), moisturizer, eye cream. Consistency is key! Give products 4-6 weeks to show results. 🌸",
                    "For acne-prone skin: Look for salicylic acid (BHA) to unclog pores, niacinamide to reduce inflammation, and benzoyl peroxide for active breakouts. Don't over-dry your skin - it'll produce more oil! Keep your routine gentle and consistent.",
                    "Anti-aging essentials: SPF daily (most important!), retinol at night, vitamin C in the morning, hyaluronic acid for hydration, and peptides for firmness. Start retinol slowly (2-3x/week) and build up. Prevention is easier than correction!"
                ]
            },
            contouring: {
                keywords: ['contour', 'highlight', 'bronze', 'sculpt', 'cheekbone'],
                responses: [
                    "Contouring 101: Apply contour in the hollows of your cheeks (suck them in to find the spot), along your hairline, sides of your nose, and jawline. Highlight the high points - tops of cheekbones, bridge of nose, cupid's bow, and center of forehead. Blend thoroughly for a natural look! ✨",
                    "Cream vs powder contour: Cream products give a more natural, dewy finish - great for dry skin. Powder is better for oily skin and easier to blend. For beginners, I recommend starting with powder! You can also mix both - cream first, set with powder.",
                    "The key to natural contour: Use a shade only 1-2 shades darker than your skin tone. Blend in circular motions, not harsh lines. Less is more - you can always add more but it's hard to remove! Make sure to check in natural light."
                ]
            },
            eyeliner: {
                keywords: ['eyeliner', 'liner', 'wing', 'winged', 'cat eye'],
                responses: [
                    "Perfect winged eyeliner: 1) Draw a line from your lower lash line upward at your desired angle. 2) Draw a line from the tip back to your upper lash line. 3) Fill in the triangle. 4) Line your upper lash line connecting to the wing. Use tape as a guide if needed! 🖤",
                    "Eyeliner for your eye shape: Hooded eyes - thin line, wing slightly upward. Downturned eyes - focus liner on outer corner, wing up. Round eyes - extend liner past outer corner. Almond eyes - you can do any style! Close-set eyes - start liner from the middle of the lid.",
                    "Beginner eyeliner tips: Start with a pencil, it's more forgiving! Gel liner with a brush gives you more control than liquid. Rest your elbow on a table for stability. Draw small dashes first, then connect them. Practice makes perfect!"
                ]
            },
            mascara: {
                keywords: ['mascara', 'lashes', 'lash', 'eyelash'],
                responses: [
                    "Mascara application tips: 1) Curl lashes first for maximum lift. 2) Wiggle the wand at the base, then sweep upward. 3) Do 2-3 coats, letting each dry slightly. 4) Use a lash comb to separate if needed. For lower lashes, hold the wand vertically! 👁️",
                    "Choosing mascara: Volumizing formulas have a thick, creamy texture - great for sparse lashes. Lengthening mascaras have a thinner formula with fibers. Curling mascaras have curved wands. Waterproof is great for events but harder to remove. Try a tubing mascara for easy removal!",
                    "Make your mascara last longer: Don't pump the wand - it pushes air in and dries it out! Swirl instead. Store upright. Replace every 3 months to avoid eye infections. If it's getting dry, add a drop of saline solution (not water!)."
                ]
            },
            blush: {
                keywords: ['blush', 'cheek', 'flush', 'rosy'],
                responses: [
                    "Blush placement for your face shape: Oval - apply on the apples of cheeks. Round - apply on cheekbones, blend toward temples. Square - apply in circular motions on apples. Heart - apply below cheekbones. Long - apply horizontally across cheeks. Smile to find the apples! 💗",
                    "Choosing blush colors: Fair skin - soft pinks and peaches. Light-medium - rose and mauve. Medium - berry and warm pink. Tan - deep rose and terracotta. Deep - plum, brick, and deep berry. Cream blushes give a natural, dewy finish while powders last longer!",
                    "Blush application tips: Apply after foundation but before powder for cream blush. For powder, apply after setting. Start light - you can always add more! Blend upward and outward toward your temples. For a natural look, use your fingers to blend cream blush."
                ]
            },
            brows: {
                keywords: ['brow', 'eyebrow', 'eyebrows'],
                responses: [
                    "Perfect brow shape: Your brow should start aligned with the inner corner of your eye, arch at the outer edge of your iris, and end at a 45-degree angle from your nose through the outer corner of your eye. Use a pencil to map these points! ✏️",
                    "Filling in brows: Use light, hair-like strokes, not a solid line. Start from the arch and work outward, then fill in the front more softly. Use a spoolie to blend. Choose a shade that matches your hair color or one shade lighter. Set with clear or tinted brow gel.",
                    "Brow products explained: Pencil - precise, great for beginners. Powder - soft, natural look. Pomade - bold, defined brows. Gel - holds hairs in place. Pen - creates hair-like strokes. For natural brows, try the soap brow technique - just brush up with a spoolie and clear gel!"
                ]
            },
            primer: {
                keywords: ['primer', 'prime', 'base'],
                responses: [
                    "Primer is a game-changer! It creates a smooth base, helps makeup last longer, and can address specific concerns. Silicone-based primers fill in pores and fine lines. Water-based primers are great for sensitive skin. Color-correcting primers neutralize redness, dullness, or sallowness. 🌟",
                    "Choosing the right primer: Oily skin - mattifying primer with oil control. Dry skin - hydrating primer with hyaluronic acid. Large pores - pore-filling primer. Redness - green-tinted primer. Dullness - illuminating primer. Always let primer set for a minute before applying foundation!",
                    "Application tips: Use a pea-sized amount for your whole face. Apply after moisturizer and SPF. Pat it in rather than rubbing. Focus on areas where makeup tends to fade (T-zone, around nose). You can use different primers on different areas based on your needs!"
                ]
            },
            setting: {
                keywords: ['setting spray', 'setting powder', 'set makeup', 'long lasting', 'all day'],
                responses: [
                    "Setting your makeup: Powder sets and mattifies - use a fluffy brush and light hand, focusing on the T-zone. Setting spray locks everything in place and can add dewiness. For maximum longevity, do both! Spray in an X and T pattern across your face. 💨",
                    "Types of setting sprays: Matte finish - controls oil, great for oily skin. Dewy finish - adds glow, perfect for dry skin. Long-wear - locks makeup in place for hours. Hydrating - refreshes and adds moisture. Hold the bottle 8-10 inches away and mist evenly!",
                    "Baking technique for special events: Apply a thick layer of translucent powder under eyes, on forehead, and chin. Let it sit for 5-10 minutes while you do other makeup. Brush off excess. This sets concealer and creates a flawless, crease-free finish! Not for everyday though."
                ]
            }
        };

        // Specific detailed responses for common questions
        const specificQuestions = {
            'how to apply': {
                pattern: /how (to|do i|can i) (apply|put on|use|do)/i,
                response: "I'd love to help you with application techniques! What product are you looking to apply? I can give you step-by-step instructions for foundation, eyeshadow, eyeliner, lipstick, contour, blush, or any other makeup product. Just let me know! 💄"
            },
            'what shade': {
                pattern: /(what|which) (shade|color|tone) (should|would|do)/i,
                response: "Choosing the right shade depends on your skin tone and undertone! Warm undertones (yellow/golden) look great with warm colors. Cool undertones (pink/red) suit cool tones. Neutral can wear both! What product are you looking for - foundation, lipstick, blush, or eyeshadow? I can give specific recommendations! ✨"
            },
            'for beginners': {
                pattern: /(beginner|new to|just start|first time|never used)/i,
                response: "Welcome to the world of makeup! 🌟 For beginners, I recommend starting with: 1) A good moisturizer and primer, 2) Tinted moisturizer or light foundation, 3) Concealer, 4) Neutral eyeshadow palette, 5) Mascara, 6) A natural blush, 7) Tinted lip balm or nude lipstick. Start simple and build your skills gradually!"
            },
            'skin type': {
                pattern: /(oily|dry|combination|sensitive) skin/i,
                response: "Different skin types need different approaches! Oily skin: Use mattifying products, oil-free formulas, and set with powder. Dry skin: Choose hydrating, dewy products and cream formulas. Combination: Mix and match - matte where oily, dewy where dry. Sensitive: Look for fragrance-free, hypoallergenic products. What specific products are you looking for?"
            },
            'make it last': {
                pattern: /(last longer|stay on|won't budge|all day|smudge|fade)/i,
                response: "For long-lasting makeup: 1) Start with clean, moisturized skin, 2) Use primer, 3) Set with powder where needed, 4) Use setting spray, 5) Choose long-wear formulas, 6) Avoid touching your face. For lips, use liner all over before lipstick. For eyes, use eyeshadow primer. These tricks will keep your makeup fresh all day! 💪"
            },
            'natural look': {
                pattern: /(natural|everyday|simple|minimal|no makeup) (look|makeup)/i,
                response: "For a natural 'no-makeup' makeup look: 1) Tinted moisturizer or light foundation, 2) Concealer only where needed, 3) Cream blush on apples of cheeks, 4) Neutral eyeshadow or just mascara, 5) Fill in brows naturally, 6) Nude or MLBB (my lips but better) lipstick, 7) Skip heavy powder. The goal is to enhance, not cover! 🌸"
            },
            'smokey eye': {
                pattern: /smokey|smoky/i,
                response: "Smokey eye tutorial: 1) Apply eyeshadow primer, 2) Pack dark shadow on lid, 3) Blend medium shade into crease, 4) Use lighter shade to blend upward, 5) Line waterline with dark pencil, 6) Smudge liner on upper and lower lash lines, 7) Add mascara or lashes. Remember: blend, blend, blend! Keep the rest of your makeup simple. 🖤"
            },
            'winged liner': {
                pattern: /(wing|winged|cat eye)/i,
                response: "Winged eyeliner made easy: 1) Draw a line from lower lash line upward at desired angle, 2) Draw from the tip back to upper lash line, 3) Fill in the triangle, 4) Line upper lash line. Use tape as a guide! Start with small wings and work your way up. Gel liner gives you more control than liquid for beginners. Practice makes perfect! ✨"
            }
        };

        // Check for specific question patterns first
        for (const [key, data] of Object.entries(specificQuestions)) {
            if (data.pattern.test(message)) {
                return data.response;
            }
        }

        // Check knowledge base for detailed responses
        for (const [topic, data] of Object.entries(knowledgeBase)) {
            for (const keyword of data.keywords) {
                if (message.includes(keyword)) {
                    const randomIndex = Math.floor(Math.random() * data.responses.length);
                    return data.responses[randomIndex];
                }
            }
        }

        // General category responses
        const responses = {
            greeting: [
                "Hello! How can I help with your beauty questions today? 👋",
                "Hi there! Ready to talk makeup, skincare, or whatever else is on your mind! ✨",
                "Hey! I'm your Glam Assistant. What beauty topic shall we explore today? 💄"
            ],
            thanks: [
                "You're welcome! I'm always happy to help with your beauty questions! 💖",
                "Anytime! Feel free to ask about any other makeup or beauty topics you're curious about.",
                "My pleasure! I'm here whenever you need beauty advice or just want to chat. 🌟"
            ],
            goodbye: [
                "Bye for now! Come back anytime you need beauty advice! ✨",
                "Take care! Hope to help with more of your beauty questions soon! 💕",
                "Goodbye! Remember, you're beautiful inside and out! 🌸"
            ],
            help: [
                "I can help with makeup recommendations, application techniques, skincare routines, beauty trends, product advice, and more! What are you interested in? I can give you tips on foundation, eyeshadow, lipstick, contouring, skincare, or any beauty topic! 💄",
                "Looking for beauty advice? I can suggest products, techniques, color matching, or trends. Just ask about any makeup or skincare topic - foundation, eyeshadow, lipstick, skincare routine, or how to create specific looks! ✨",
                "I'm your virtual beauty assistant! Ask me about makeup application, product recommendations, skincare routines, color theory, or how to achieve specific looks. What would you like to know? 🌟"
            ],
            makeup: [
                "Makeup is my specialty! I can help with product recommendations, application techniques, color matching, or creating specific looks. What would you like to know about? Foundation, eyes, lips, contouring, or something else? 💄",
                "The right makeup can enhance your natural beauty! Are you looking for everyday looks, special occasion makeup, or help with a specific product? I'm here to help! ✨",
                "Makeup should be fun and expressive! Tell me what you're working on - I can help with techniques, product choices, or creating complete looks. What's your question? 🎨"
            ],
            products: [
                "I'd love to help you find the right products! What are you looking for? Foundation, concealer, eyeshadow, lipstick, skincare, or tools? Tell me your skin type and concerns, and I can give you recommendations! 🛍️",
                "Finding the right beauty products depends on your skin type, concerns, and preferences. What product category are you interested in? I can help you choose! ✨",
                "There are so many amazing beauty products out there! Let me know what you're looking for - I can suggest options for different budgets, skin types, and preferences. What do you need? 💄"
            ],
            fashion: [
                "Fashion and beauty go hand in hand! While my specialty is makeup and beauty, I can offer some style tips. What's your question? 👗",
                "The best fashion advice is to wear what makes you feel confident! Your makeup can complement your outfit perfectly. What are you planning to wear? ✨"
            ],
            wellness: [
                "Beauty starts from within! Good sleep, hydration, and nutrition all impact your skin and overall glow. What aspect of wellness are you focusing on? 🌸",
                "Taking care of your whole self is so important for that natural radiance! Stress management, sleep, and hydration all affect your skin. What would you like to know? 💆‍♀️"
            ],
            default: [
                "That's interesting! I'd love to chat more about this. Could you tell me a bit more about what you're looking for? I'm especially knowledgeable about makeup, skincare, and beauty topics! 💄",
                "I'm here to help! While my expertise is in beauty and makeup, I'm happy to chat. What specifically would you like to know? ✨",
                "Great question! Could you give me a bit more detail? I can offer the most help with makeup application, product recommendations, skincare routines, and beauty techniques! 🌟"
            ]
        };

        // Determine category with enhanced keywords
        let category = "default";

        if (message.match(/\b(hi|hello|hey|greetings|howdy|morning|afternoon|evening)\b/i)) {
            category = "greeting";
        } else if (message.match(/\b(thanks|thank you|thx|ty|appreciate|grateful)\b/i)) {
            category = "thanks";
        } else if (message.match(/\b(bye|goodbye|see you|farewell|later|take care)\b/i)) {
            category = "goodbye";
        } else if (message.match(/\b(help|assist|support|what can you do|how to use|features)\b/i)) {
            category = "help";
        } else if (message.match(/\b(makeup|cosmetic|beauty|product|recommend)\b/i)) {
            category = "makeup";
        } else if (message.match(/\b(product|brand|buy|purchase|recommend|suggestion)\b/i)) {
            category = "products";
        } else if (message.match(/\b(fashion|style|clothes|outfit|dress|wear)\b/i)) {
            category = "fashion";
        } else if (message.match(/\b(wellness|health|fitness|self-care|stress)\b/i)) {
            category = "wellness";
        }

        // Get a random response from the appropriate category
        const categoryResponses = responses[category];
        const randomIndex = Math.floor(Math.random() * categoryResponses.length);
        return categoryResponses[randomIndex];
    }

    // Add message to chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('flex');

        if (sender === 'user') {
            messageDiv.classList.add('justify-end');
            messageDiv.innerHTML = `
                <div class="chat-bubble-user">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.classList.add('justify-start');
            messageDiv.innerHTML = `
                <div class="chat-bubble-bot">
                    <p>${message}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('flex', 'justify-start', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="chat-bubble-bot flex space-x-1">
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}); 