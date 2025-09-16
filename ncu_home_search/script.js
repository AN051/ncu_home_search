document.addEventListener('DOMContentLoaded', () => {

    // --- 页面元素获取 ---
    const timeDisplay = document.getElementById("current-time");
    const dateDisplay = document.getElementById("current-date");
    const searchInput = document.getElementById("search-input");
    const searchIconLeft = document.querySelector(".search-icon-left");
    const keywordsContainer = document.getElementById("keywords-container");
    const clearButton = document.getElementById("clear-button");
    const lastSearchButton = document.getElementById("last-search-button");
    const randomKeywordButton = document.getElementById("random-keyword-button");

    // --- 常量与变量定义 ---
    const MAX_HISTORY_LENGTH = 10;
    const RANDOM_KEYWORDS = ["南大家园", "家园工作室", "云家园", "南昌大学", "家园小镇", "机房ha'...", "研发组", "设计组", "小家园"];
    const NO_HISTORY_MESSAGE = '<p style="color: #eee; font-size: 0.9em;">暂无搜索记录</p>';
    
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // --- 时间与日期功能 ---
    function updateTime() {
        const now = new Date();
        // 时间
        timeDisplay.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
        // 日期
        dateDisplay.textContent = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    }

    // --- 搜索核心逻辑 ---
    
    // 执行搜索 (核心函数)
    function performSearch(term) {
        if (!term || term.trim() === '') return;

        console.log("执行搜索: ", term); // 打印到控制台
        // 在新标签页中打开必应搜索
        window.open(`https://www.bing.com/search?q=${encodeURIComponent(term)}`, '_blank');
        
        updateSearchHistory(term.trim());
        searchInput.value = ""; // 清空输入框
    }

    // 更新并保存搜索历史
    function updateSearchHistory(term) {
        // 移除已存在的相同项，避免重复
        const existingIndex = searchHistory.indexOf(term);
        if (existingIndex > -1) {
            searchHistory.splice(existingIndex, 1);
        }
        // 添加到最前面
        searchHistory.unshift(term);

        // 保持历史记录不超过最大长度
        if (searchHistory.length > MAX_HISTORY_LENGTH) {
            searchHistory.pop();
        }

        // 保存到 localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        localStorage.setItem('lastSearchTerm', term); // 保存上次搜索
        
        // 重新渲染显示
        renderHistory();
    }

    // 渲染搜索历史到页面
    function renderHistory() {
        keywordsContainer.innerHTML = ""; // 清空
        if (searchHistory.length === 0) {
            keywordsContainer.innerHTML = NO_HISTORY_MESSAGE;
            clearButton.style.display = 'none';
        } else {
            clearButton.style.display = 'inline-block';
            searchHistory.forEach(keyword => {
                const keywordSpan = document.createElement("span");
                
                // 截断长文本 (加分项)
                let displayText = keyword;
                if (displayText.length > 5) {
                    displayText = displayText.substring(0, 5) + '...';
                }
                keywordSpan.textContent = displayText;
                keywordSpan.title = keyword; // 鼠标悬停时显示完整文本

                keywordSpan.addEventListener("click", () => {
                    performSearch(keyword); // 点击历史记录直接搜索
                });
                keywordsContainer.appendChild(keywordSpan);
            });
        }
    }

    // 获取随机关键词
    function getRandomKeyword() {
        const randomIndex = Math.floor(Math.random() * RANDOM_KEYWORDS.length);
        return RANDOM_KEYWORDS[randomIndex];
    }

    // --- 事件监听 ---

    // 1. 搜索按钮 (左侧图标)
    searchIconLeft.addEventListener("click", () => {
        performSearch(searchInput.value);
    });

    // 2. 输入框回车
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            performSearch(searchInput.value);
        }
    });

    // 3. 上次搜索按钮 (右侧图标)
    lastSearchButton.addEventListener('click', () => {
        const lastSearchTerm = localStorage.getItem('lastSearchTerm') || '';
        searchInput.value = lastSearchTerm;
        searchInput.focus(); // 聚焦输入框，方便用户继续编辑或直接搜索
    });

    // 4. 随机关键词按钮 (右侧图标)
    randomKeywordButton.addEventListener('click', () => {
        searchInput.value = getRandomKeyword();
        searchInput.focus();
    });

    // 5. 清空历史记录按钮
    clearButton.addEventListener("click", () => {
        searchHistory = [];
        localStorage.removeItem('searchHistory');
        localStorage.removeItem('lastSearchTerm');
        renderHistory();
    });

    // --- 初始化 ---
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新一次时间
    renderHistory(); // 页面加载时立即渲染历史记录
});
