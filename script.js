document.addEventListener('DOMContentLoaded', function() {
  // 標籤篩選功能
  const tagButtons = document.querySelectorAll('.tag-btn');
  const promptCards = document.querySelectorAll('.prompt-card');
  
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按鈕的 selected 類別
      tagButtons.forEach(btn => btn.classList.remove('selected'));
      
      // 為當前按鈕添加 selected 類別
      this.classList.add('selected');
      
      const selectedTag = this.textContent;
      
      // 如果選擇「全部」，則顯示所有卡片
      if (selectedTag === '全部') {
        promptCards.forEach(card => {
          card.style.display = 'flex';
        });
      } else {
        // 否則只顯示匹配標籤的卡片
        promptCards.forEach(card => {
          const cardTag = card.querySelector('.prompt-tag').textContent;
          if (cardTag === selectedTag) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });
  
  // 複製提示詞功能
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 獲取提示詞內容
      const promptText = this.getAttribute('data-prompt');
      
      // 複製到剪貼簿
      navigator.clipboard.writeText(promptText).then(() => {
        // 更改按鈕文字和樣式，表示已複製
        const originalText = this.textContent;
        this.textContent = '已複製！';
        this.classList.add('copied');
        
        // 2秒後恢復原狀
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('複製失敗: ', err);
        alert('複製失敗，請手動複製');
      });
    });
  });
  
  // 顯示/隱藏提示詞內容功能（可選）
  const promptTitles = document.querySelectorAll('.prompt-title');
  
  promptTitles.forEach(title => {
    title.addEventListener('click', function() {
      const card = this.closest('.prompt-card');
      const content = card.querySelector('.prompt-content');
      
      // 切換提示詞內容的顯示/隱藏
      if (content.style.display === 'none') {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
}); 