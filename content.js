// 存储最新的数据
let latestStats = null;

// 立即执行数据获取
function getVideoStats() {
    try {
        const stats = {
            title: document.querySelector('h1.video-title')?.textContent?.trim() || '-',
            play: document.querySelector('.view-text')?.textContent?.trim() || '-',
            like: document.querySelector('.video-like-info')?.textContent?.trim() || '-',
            coin: document.querySelector('.video-coin-info')?.textContent?.trim() || '-',
            favorite: document.querySelector('.video-fav-info')?.textContent?.trim() || '-'
        };

        // 发送数据到popup
        chrome.runtime.sendMessage({ type: 'VIDEO_STATS', data: stats });
        console.log('发送数据:', stats);
    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_STATS') {
        getVideoStats();
    } else if (message.action === "togglePlay") {
        const video = document.querySelector('video');
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    } else if (message.action === "like") {
        const likeButton = document.querySelector('.video-like');
        if (likeButton) {
            likeButton.click();
        }
    }
});

// 页面加载完成后获取数据
document.addEventListener('DOMContentLoaded', getVideoStats);