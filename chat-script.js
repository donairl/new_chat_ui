const path_assets = '/chatbox2/';

document.addEventListener('DOMContentLoaded', () => {


    var sessionId = document.getElementById('member_session').value;
    var member_code = document.getElementById('member_code').value;
    var member_name = document.getElementById('member_name').value;
    const chatContainer = document.querySelector('.chat-container');
    const chatToggle = document.querySelector('.chat-toggle');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const closeBtn = document.querySelector('.close-btn');
    const resizeBtn = document.querySelector('.resize-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const faqItems = document.querySelectorAll('.faq-item');
    const firstMessageTime = document.getElementById('firstMessageTime');
    let chatApiUrl = 'https://n8n.dxn2u.com/webhook/eworld-chatbot';
    let member_data = JSON.parse(localStorage.getItem('member_data'));
    let data_ready = false;

    fetch('/s/ajaxgo/infoforai', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const promo_content = data.promo_content;
        //put member_data to flutter.member_data
       // let member_data = JSON.parse(localStorage.getItem('member_data'));
        member_data.join_date = "$join_date";
        member_data.additional_info = "-- List of my Downline distributor has highest sales : " + data.downline_high_sales;
        member_data.additional_info += "-- Top Product in My Network : RG/GL, Spirulina,Lingzhi coffee";
        member_data.additional_info += "-- Current Promotion : " + promo_content;
        //member_data to string
        // let member_data_string = formatJsonAsEscapedString(member_data);
        localStorage.setItem('member_data', JSON.stringify(member_data));
        console.log('member_data', member_data);
        data_ready = true;
        //show chat toggle
        chatToggle.style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

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

        // Kirim data ke URL yang ditentukan
        fetch(chatApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': 'e899c380915ef6b12178659b6bf292c0'
            },
            body: JSON.stringify({ message: content, sessionId: sessionId, member_code: member_code, member_name: member_name, member_data: member_data })
        })
        .then(response => response.json())
        .then(data => {
            // Sembunyikan chat-loader setelah mendapatkan respons
            chatLoader.style.display = 'none';
            //in data.output, if data.output contain \n, then replace \n with <br>
            let output = data.output.replace(/\n/g, '<br>');
            addMessage(output);
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
    function addMessage(content, isUser = false) {
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