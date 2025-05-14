const path_assets = '/';

document.addEventListener('DOMContentLoaded', () => {


    var sessionId = document.getElementById('member_session').value;
 
   
    const chatContainer = document.querySelector('.chat-container');
    const chatToggle = document.querySelector('.chat-toggle');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const closeBtn = document.querySelector('.close-btn');
    const resizeBtn = document.querySelector('.resize-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const faqItems = document.querySelectorAll('.faq-item');
    const firstMessageTime = document.getElementById('firstMessageTime');
    let chatApiUrl = 'https://n8n.dxn2u.com/webhook/dxnweb-chatbot';
    let country = '';
    let data_ready = true;
   
    //fetch geolocation
    let geolocation = fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        country = data.country_name;
        console.log(country);
        data_ready = true;
        chatToggle.style.display = 'block';
    });
   
    function chatFeedback(id,type){
        let chatFeedbackUrl = 'https://n8n.dxn2u.com/webhook/chatbot-feedback';
        fetch(chatFeedbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': 'e899c380915ef6b12178659b6bf292c0'
            },
            body: JSON.stringify({ id: id,type: type})  
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
    }

    function createIconContainer(content, id) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'icon-container';

        // Create and configure copy icon
        const copyIcon = createIcon('fa-copy', () => {
            navigator.clipboard.writeText(content);
        });

        // Create and configure like icon
        const likeIcon = createIcon('fa-thumbs-up', () => {
            chatFeedback(id,'like');
            console.log('like', id);
        });
        likeIcon.setAttribute('data-id', id);

        // Create and configure dislike icon
        const dislikeIcon = createIcon('fa-thumbs-down', () => {
            chatFeedback(id,'dislike');
            console.log('dislike', id);
        });
        dislikeIcon.setAttribute('data-id', id);

        // Append icons to container
        iconContainer.appendChild(likeIcon);
        iconContainer.appendChild(dislikeIcon);
        iconContainer.appendChild(copyIcon);

        return iconContainer;
    }

    function createIcon(iconClass, clickHandler) {
        const icon = document.createElement('i');
        icon.className = `fas ${iconClass}`;
        icon.style.marginRight = '10px';
        icon.style.cursor = 'pointer';
        icon.style.color = 'grey';
        icon.addEventListener('click', clickHandler);
        return icon;
    }

   

   
    // Set the first message time
    firstMessageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle FAQ item clicks
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const message = item.getAttribute('data-message');
            sendMessage(message);
        });
    });

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    // Toggle fullscreen
    resizeBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('fullscreen');
        const icon = resizeBtn.querySelector('i');
        if (chatContainer.classList.contains('fullscreen')) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    });

    // Close chat
    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        // Reset ke ukuran normal saat menutup
        chatContainer.classList.remove('fullscreen');
        const icon = resizeBtn.querySelector('i');
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
    });

    // Send message
function sendMessage(message = null) {
    const content = message || messageInput.value.trim();
    if (content && data_ready) {
        addMessage(content, true);
        messageInput.value = '';

        // Tampilkan chat-loader
        const chatLoader = document.getElementById('chat-loader');
        chatLoader.style.display = 'block';
            //hide .faq-container
            const faqContainer = document.querySelector('.faq-container');
            faqContainer.style.display = 'none';

        // Kirim data ke URL yang ditentukan
        fetch(chatApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': 'e899c380915ef6b12178659b6bf292c0'
            },
            body: JSON.stringify({ message: content, sessionId: sessionId ,country: country})
        })
        .then(response => response.json())
        .then(data => {
            // Sembunyikan chat-loader setelah mendapatkan respons
            chatLoader.style.display = 'none';
            //in data.output, if data.output contain \n, then replace \n with <br>
            let output = data.output.replace(/\n/g, '<br>');
            //add suport markdown
            output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            output = output.replace(/\*(.*?)\*/g, '<em>$1</em>');
            output = output.replace(/\~\~(.*?)\~\~/g, '<del>$1</del>');
            output = output.replace(/\:\"(.*?)\"/g, '<span class="emoji">$1</span>');
            
            
            
            
          
          addMessage(output,false,data.id);
            //show .faq-container
            faqContainer.style.display = 'block';
        })
        .catch((error) => {
            // Sembunyikan chat-loader jika terjadi error
            chatLoader.style.display = 'none';
            console.error('Error:', error);
        });
    } else {
        addMessage('Please wait a moment...');
    }
}

    // Add message to chat
    function addMessage(content, isUser = false,id = 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
      

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = isUser ? path_assets + 'user_avatar.gif' : path_assets + 'robot_avatar.gif';
        avatar.alt = isUser ? 'User Avatar' : 'Bot Avatar';
        messageDiv.appendChild(avatar);

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        //add icon copy to clipboard if user =false
        if(!isUser){
           

            const iconContainer = createIconContainer(content, id);
            //add icon container to message content
            messageContent.appendChild(iconContainer);
        }
        messageDiv.appendChild(messageContent);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timeDiv);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners for sending messages
    sendButton.addEventListener('click', () => sendMessage());
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 