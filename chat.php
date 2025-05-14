<?php
function _buildShortcut($title, $message) {
    echo '<div class="faq-item" data-message="' . $message . '">';
    echo '<p>' . $title . '</p>';
    echo '</div>';
}
//generate random string
$member_session = md5(uniqid(rand(), true));
//current IP address
$member_ip = $_SERVER['REMOTE_ADDR'];
?>

<input type="hidden" id="member_session" value="<?php echo $member_session; ?>">
<input type="hidden" id="member_ip" value="<?php echo $member_ip; ?>">
<!-- Chatbox UI -->
 <link rel="stylesheet" href="chat-styles.css">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <div class="chat-container">
        <div class="chat-header">
            <div class="chat-title">
                <i class="fas fa-robot"></i>
                <span>DAX - DXN Assistant</span>
            </div>
            <div class="chat-actions">
                <button class="resize-btn"><i class="fas fa-expand-alt"></i></button>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="chat-messages">
            <div class="message bot">
                <img src="robot_avatar.gif" class="avatar" alt="Bot Avatar">
                <div class="message-content">
                    <p>Hi! My name is DAX. How can I assist you today? I can chat in multi language, just type in your language and I will respond in your language.</p>
                </div>
                <div class="message-time" id="firstMessageTime"></div>
            </div>
        </div>
        <div id="chat-loader" style="display: none;"></div>
        <div class="faq-section">

              <div class="faq-container active">
                <?php
               _buildShortcut('Health','Which product has the best benefit for my health?');
               _buildShortcut('Food and Beverage','What is the best product in category food and beverage?');
               _buildShortcut('Personal Care','What is the best product in category personal care?');
               _buildShortcut('Nutrition','What product can help me to improve my nutrition?');
               _buildShortcut('Beauty','What product can help me to improve my beauty?');
               _buildShortcut('Branch', 'Give me the address of dxn branch in my country');    
               _buildShortcut('Business', 'Can you tell me why I should consider joining the DXN business?');
               _buildShortcut('Register', 'How can I register as a DXN Distributor?');
   
                ?>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Ketik pesan Anda..." id="messageInput">
            <button id="sendButton"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
    <button class="chat-toggle" style="display: none;">
        <i class="fas fa-robot"></i>&nbsp;Support Agent
    </button>
    
    <script src="chat-script.js"></script>