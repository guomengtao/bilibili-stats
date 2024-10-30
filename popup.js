// 存储获取到的数据
let cachedStats = null;

// 更新显示的数据
function updateStats(stats) {
    if (!stats) return;
    
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key] || '-';
        }
    });
    
    // 更新缓存
    cachedStats = stats;
}

// 请求获取数据
function requestStats() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url && currentTab.url.includes('bilibili.com/video')) {
            // 先显示缓存的数据（如果有的话）
            if (cachedStats) {
                updateStats(cachedStats);
            }
            
            // 请求新数据
            chrome.tabs.sendMessage(currentTab.id, {type: 'GET_STATS'}, response => {
                if (response && response.data) {
                    updateStats(response.data);
                }
            });
        } else {
            document.getElementById('stats').innerHTML = '<p style="color: red;">请在B站视频页面使用此插件</p>';
        }
    });
}

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'VIDEO_STATS') {
        updateStats(message.data);
    }
});

// 页面加载完成后立即请求数据
document.addEventListener('DOMContentLoaded', () => {
    requestStats();
    // 定期刷新数据
    setInterval(requestStats, 2000);
});

// 添加按钮事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 播放/暂停按钮
    document.getElementById('togglePlay').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePlay'});
        });
    });

    // 点赞按钮
    document.getElementById('likeVideo').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'like'});
        });
    });
}); 