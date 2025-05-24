document.addEventListener('DOMContentLoaded', function() {
  // 更新版本號為當前日期格式
  function updateVersionNumber() {
    const versionElement = document.getElementById('version-number');
    if (versionElement) {
      // 如果HTML中已經設定了固定版本號，則不自動更新
      if (versionElement.textContent === '1.1.25.0516') {
        // 保留HTML中設定的版本號
        return;
      }
      
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // 取年份後兩位
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份補零
      const day = now.getDate().toString().padStart(2, '0'); // 日期補零
      
      // 格式: 1.1.YY.MMDD
      const versionFormat = `1.1.${year}.${month}${day}`;
      versionElement.textContent = versionFormat;
    }
  }
  
  // 執行更新版本號
  updateVersionNumber();
  
  // 搜尋功能
  const searchInput = document.getElementById('search-input');
  const promptCards = document.querySelectorAll('.prompt-card');
  const tagButtons = document.querySelectorAll('.tag-btn');
  
  // 搜尋功能實現
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const selectedTag = document.querySelector('.tag-btn.selected').textContent.replace(/\d+/g, '').trim();
    
    promptCards.forEach(card => {
      const title = card.querySelector('.prompt-title').textContent.toLowerCase();
      const content = card.querySelector('.prompt-content p').textContent.toLowerCase();
      const tag = card.querySelector('.prompt-tag').textContent;
      const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
      
      // 同時考慮搜尋詞和已選擇的標籤
      if (selectedTag === '全部') {
        card.style.display = matchesSearch ? 'flex' : 'none';
      } else {
        card.style.display = (matchesSearch && tag === selectedTag) ? 'flex' : 'none';
      }
    });
  });
  
  // Pro 功能使用計數器和限制 - 移除計數功能，永遠允許使用
  // const limitModal = document.getElementById('limit-modal'); // Removed
  // const closeModalBtn = document.getElementById('close-modal'); // Removed
  
  // 更新使用次數的函數 - 修改為永遠返回 true // Removed
  // function updateProUsageCount() { // Removed
    // 直接返回 true，允許使用 Pro 功能 // Removed
    // return true; // Removed
  // } // Removed
  
  // 關閉彈窗的事件 // Removed
  // closeModalBtn.addEventListener('click', function() { // Removed
    // limitModal.style.display = 'none'; // Removed
  // }); // Removed
  
  // 確保限制彈窗永遠不會顯示 // Removed
  // if (limitModal) { // Removed
    // limitModal.style.display = 'none'; // Removed
  // } // Removed
  
  // 標籤篩選功能
  
  // 計算各標籤的數量並更新標籤按鈕
  function updateTagCounts() {
    // 建立標籤計數對象
    const tagCounts = {};
    let totalCount = 0;
    
    // 統計每個標籤的卡片數量
    promptCards.forEach(card => {
      const cardTag = card.querySelector('.prompt-tag').textContent;
      if (!tagCounts[cardTag]) {
        tagCounts[cardTag] = 0;
      }
      tagCounts[cardTag]++;
      totalCount++;
    });
    
    // 更新每個標籤按鈕的顯示
    tagButtons.forEach(button => {
      const tagText = button.textContent.trim();
      // 清除已有的計數元素（如果存在）
      const existingCount = button.querySelector('.tag-count');
      if (existingCount) {
        existingCount.remove();
      }
      
      // 添加計數元素
      const countSpan = document.createElement('span');
      countSpan.className = 'tag-count';
      
      if (tagText === '全部') {
        countSpan.textContent = totalCount;
      } else if (tagCounts[tagText]) {
        countSpan.textContent = tagCounts[tagText];
      } else {
        countSpan.textContent = '0';
      }
      
      button.appendChild(countSpan);
    });
  }
  
  // 初始執行一次計數更新
  updateTagCounts();
  
  // 修改標籤點擊事件，使其與搜尋功能協同工作
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按鈕的 selected 類別
      tagButtons.forEach(btn => btn.classList.remove('selected'));
      
      // 為當前按鈕添加 selected 類別
      this.classList.add('selected');
      
      const selectedTag = this.textContent.replace(/\d+/g, '').trim();
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      // 如果選擇「全部」，則顯示所有卡片
      if (selectedTag === '全部') {
        promptCards.forEach(card => {
          const title = card.querySelector('.prompt-title').textContent.toLowerCase();
          const content = card.querySelector('.prompt-content p').textContent.toLowerCase();
          const matchesSearch = searchTerm === '' || title.includes(searchTerm) || content.includes(searchTerm);
          card.style.display = matchesSearch ? 'flex' : 'none';
        });
      } else {
        // 否則只顯示匹配標籤和搜尋詞的卡片
        promptCards.forEach(card => {
          const cardTag = card.querySelector('.prompt-tag').textContent;
          const title = card.querySelector('.prompt-title').textContent.toLowerCase();
          const content = card.querySelector('.prompt-content p').textContent.toLowerCase();
          const matchesSearch = searchTerm === '' || title.includes(searchTerm) || content.includes(searchTerm);
          
          if (cardTag === selectedTag && matchesSearch) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });
  
  // 進階Pro提示詞資料
  const proPrompts = {
    "老客戶回流話術": "角色：你是一位資深美髮沙龍客戶管理專家\n任務：請幫我設計一段私訊話術\n內容：針對 3-6 個月未回店的老客戶，包含：\n- 問候語\n- 關心客戶近況\n- 提及上次服務內容\n- 介紹新服務或產品\n- 提供專屬回流優惠方案\n風格：誠懇、溫暖但不過度熱情，展現專業關懷\n格式：字數控制在 200 字內，分段清晰，最後附帶一句引導預約的話",
    
    "生日月客戶優惠訊息": "角色：你是一位美髮沙龍行銷專員\n任務：設計一則生日月份專屬優惠訊息\n內容：\n- 溫馨的生日祝福\n- 針對護髮或染燙服務的專屬優惠\n- 優惠使用期限與條件\n- 預約提醒\n風格：充滿誠意、溫暖友善、讓客人感受到重視\n格式：100-150 字，附帶一個吸引人的標題",
    
    "網路新客服務流程": "角色：你是美髮行業的客戶服務流程設計專家\n任務：設計一套網路新客從初次諮詢到服務完成的標準流程\n內容：包含以下階段的具體話術和操作指南：\n- 初次諮詢回覆\n- 預約確認流程\n- 首次到店迎接流程\n- 需求確認與建議\n- 服務過程中的互動要點\n- 服務完成後的回饋收集\n- 後續追蹤規劃\n風格：專業、貼心、顧客導向\n格式：分階段呈現，每個階段附帶 1-2 個實用話術範例",
    
    "VIP客戶專屬關懷計劃": "角色：你是高端美髮沙龍的VIP客戶關係管理專家\n任務：設計一套VIP客戶專屬關懷計劃\n內容：針對高消費、高頻率的VIP客戶，包含：\n- VIP客戶分級標準（消費金額、頻率等指標）\n- 每個等級專屬權益與優惠\n- 生日、節慶專屬禮遇設計\n- 專屬預約通道與彈性服務\n- 新服務/產品優先體驗機制\n- 專屬溝通頻率與內容規劃\n- 專屬設計師一對一關係維護策略\n風格：高端、重視、專業、細緻\n格式：300-350字，條理分明，具體可執行",
    
    "客戶分類管理策略": "角色：你是美髮沙龍客戶數據分析與管理專家\n任務：設計一套客戶分類管理策略\n內容：\n- 客戶分類標準（如消費金額、頻率、忠誠度等指標）\n- 建議的客戶分層（如鑽石、金卡、銀卡、潛力客等）\n- 各層級客戶的特點與價值分析\n- 各層級客戶的溝通頻率與方式建議\n- 各層級客戶專屬行銷策略與優惠設計\n- 客戶升級機制與激勵方案\n- 客戶數據收集與分析方法\n風格：數據導向、策略性、實用性高\n格式：分層級清晰呈現，包含實施建議與預期效果",
    
    "節慶祝賀訊息": "角色：你是美髮沙龍的節慶行銷專家\n任務：設計全年度主要節慶的客戶祝賀訊息\n內容：針對以下節慶設計訊息：\n- 農曆新年\n- 情人節\n- 婦女節/母親節\n- 父親節\n- 中秋節\n- 聖誕節/跨年\n每個節慶訊息需包含：\n- 應景的祝福語\n- 巧妙連結美髮或形象相關話題\n- 節慶專屬優惠或活動\n- 預約建議\n風格：溫馨、應景、不做作、品牌調性一致\n格式：每則訊息100-150字，附帶適合的標題",
    
    "客戶預約提醒系統": "角色：你是美髮沙龍的客戶體驗優化專家\n任務：設計客戶預約全流程的提醒訊息系統\n內容：針對以下時間點設計訊息模板：\n- 預約成功確認（含預約詳情、注意事項）\n- 預約前3天提醒\n- 預約前1天提醒\n- 預約當日早上提醒\n- 服務完成後的感謝訊息\n- 服務後7天的關懷追蹤\n- 服務後30天的再次預約建議\n每個模板需包含：\n- 適當的問候語\n- 必要資訊清晰呈現\n- 預約變更/取消指引（如適用）\n風格：專業、簡潔、友善、不打擾\n格式：每則訊息控制在100字內，重點突出",
    
    "客戶髮型紀錄卡設計": "角色：你是美髮沙龍的數位化管理顧問\n任務：設計一份數位化客戶髮型紀錄系統\n內容：設計一套完整的客戶髮型檔案，包含：\n- 基本客戶資料區塊（姓名、聯絡方式、生日等）\n- 髮質分析區塊（髮質類型、頭皮狀況、特殊狀況等）\n- 歷史服務紀錄區塊（日期、服務項目、金額等）\n- 技術配方紀錄區塊（染劑配方、燙髮藥水選用等）\n- 使用產品紀錄區塊（沙龍護理、居家護理推薦等）\n- 設計師專業建議區塊（造型建議、注意事項等）\n- 客戶偏好紀錄區塊（喜好風格、禁忌等）\n- 下次預約建議區塊（建議時間、項目等）\n風格：專業、系統化、易於填寫與查閱\n格式：區塊分明，設計成表格或數位化介面形式",
    
    "推薦新客獎勵計畫": "角色：你是美髮沙龍的客戶拓展策略專家\n任務：設計一套「老客戶推薦新客人」的獎勵計畫\n內容：\n- 計畫名稱與核心賣點\n- 推薦機制設計（如推薦碼、實體推薦卡等）\n- 推薦人獎勵內容（如折扣、積分、免費服務等）\n- 被推薦人優惠內容（首次體驗特惠等）\n- 多層次獎勵機制（如推薦越多獎勵越高）\n- 推薦追蹤與兌換流程\n- 計畫宣傳方式建議\n- 效果評估指標\n風格：激勵性、互惠互利、容易理解\n格式：300字左右，結構清晰，重點突出，附帶簡短宣傳語",
    
    "流失客戶挽回策略": "角色：你是美髮沙龍的客戶維繫與挽回專家\n任務：設計一套流失客戶挽回策略\n內容：針對6個月以上未回店的客戶，包含：\n- 流失客戶分類方法（如消費金額、頻率、流失時間等）\n- 流失原因分析與對應策略\n- 階段性接觸計劃（3個月、6個月、1年以上）\n- 每個階段的訊息內容與語氣建議\n- 專屬回流優惠方案設計（依流失時間與客戶價值）\n- 回流後的強化維繫計劃\n- 二次流失預防機制\n- 效果追蹤與調整方法\n風格：策略性、系統化、重視數據分析\n格式：350字左右，分階段清晰呈現，包含實際訊息範例",
    
    "新客開發加購護髮話術": "角色：你是專業美髮顧問與銷售技巧專家\n任務：設計針對初次來店客戶的護髮加購話術\n內容：\n- 髮質評估導入語\n- 客製化護髮需求分析\n- 解釋護髮對新染燙髮質的重要性\n- 介紹 2-3 種適合的護髮方案\n- 提及首次體驗的專屬優惠\n風格：親切、專業、教育性質為主，避免過度推銷感\n格式：對話形式，包含應對客人可能提出的疑慮，總長不超過 250 字",
    
    "產品銷售": "角色：你是美髮品牌產品專家\n任務：設計一則護髮產品的銷售文案\n內容：\n- 針對特定髮質問題（如乾燥、毛躁、受損等）\n- 產品的主要成分與功效說明\n- 使用方法和預期效果\n- 真實客戶使用心得（案例分享）\n- 現有促銷優惠\n風格：以解決問題為導向，專業但平易近人\n格式：200-250 字，可分段呈現，附帶一個吸引人的標題",
    
    "季節限定服務推廣文案": "角色：你是美髮沙龍的季節性服務規劃專家\n任務：撰寫一則季節限定護髮或染燙服務的推廣文案\n內容：\n- 連結季節特點與髮質需求（如夏季防曬、冬季保濕等）\n- 介紹限定服務的獨特之處\n- 服務效益與持續時間\n- 限定優惠與期限\n- 預約提醒\n風格：時尚、新鮮感、創造稀缺性\n格式：200 字內，包含吸引人的標題和清晰的行動呼籲",
    
    "IG限動互動文案": "角色：你是社群媒體互動內容創作專家\n任務：設計一個 IG 限動互動問答遊戲\n內容：主題為「髮型小知識」，包含：\n- 3-5 個趣味性髮型相關問答\n- 每個問題提供 2-3 個選項\n- 每個問答後附加專業解釋與小技巧\n- 引導粉絲私訊參與或分享心得\n風格：輕鬆活潑、互動性強、富教育意義\n格式：每個問題控制在 1-2 句話，整體設計成可輕鬆快速滑動的系列限動",
    
    "Facebook 互動貼文": "角色：你是美髮趨勢專家兼社群內容策劃師\n任務：製作一篇 Facebook 互動貼文\n內容：主題為「最近流行的三款韓系髮型」，包含：\n- 簡短介紹當下韓系髮型流行趨勢\n- 詳細描述 3 款不同風格的韓系髮型特點\n- 說明各髮型適合的臉型與個性\n- 設計投票互動機制\n- 提供預約建議與優惠資訊\n風格：專業中帶有親切感，具時尚敏銳度\n格式：300-400 字，分段清晰，配合實際張貼時可搭配圖片的提示",
    
    "短影音腳本創作": "角色：你是美髮內容創作者與短影音專家\n任務：撰寫一個適合抖音或IG的短影音腳本\n內容：主題為「快速整理髮型技巧」，包含：\n- 吸引觀眾注意的開場白（5秒內）\n- 2-3 個實用且簡單的髮型整理技巧\n- 每個技巧的操作步驟\n- 適用場合與效果說明\n- 互動呼籲（如：留言分享你最常用的髮型技巧）\n風格：活潑、節奏明快、實用為主\n格式：總時長控制在 30 秒內，分鏡頭呈現，包含畫面與旁白說明",
    
    "私訊回覆": "角色：你是專業美髮顧問\n任務：撰寫一段回覆客人私訊詢問的範例\n內容：針對客人詢問染燙價格和推薦髮型，包含：\n- 專業問候語\n- 價格區間說明（基本+依長度/材料增加的費用）\n- 提出 2-3 個需要進一步了解的問題（如髮質狀況、喜好風格等）\n- 2-3 款適合不同臉型的熱門髮型簡介\n- 預約建議與可約時段提示\n風格：專業、親切、有耐心、重視客製化建議\n格式：200-250 字，分段清晰，表達邏輯流暢",
    
    "售後追蹤回訪話術": "角色：你是美髮沙龍的客戶關係維護專員\n任務：撰寫一段服務後一週的追蹤回訪話術\n內容：\n- 溫馨的開場問候\n- 詢問髮型/護髮效果維持情況\n- 居家護理使用體驗\n- 提供 1-2 個實用的後續護理建議\n- 委婉提醒下次護理時間\n風格：貼心、專業、不過度打擾\n格式：150-200 字，簡潔有禮，容易透過訊息平台發送",
    
    "客戶滿意度調查文案": "角色：你是美髮沙龍的客戶體驗優化專家\n任務：撰寫一則客戶滿意度調查訊息\n內容：\n- 親切的感謝語\n- 2-3 個關於服務體驗的簡短問題\n- 設計師表現評價請求\n- 改進建議徵求\n- 表達重視客戶意見的態度\n風格：溫馨、誠懇、顯示重視\n格式：100-150 字，問題清晰易回答，避免過長使客人失去填寫意願",
    
    "客訴處理": "角色：你是美髮沙龍的危機處理專家\n任務：提供一段處理客訴的回覆話術\n內容：針對服務不滿意的客訴，包含：\n- 真誠的歉意表達\n- 認真傾聽客人不滿的表述\n- 明確的問題確認\n- 具體的解決方案（如：免費修改、折扣優惠、重做服務等）\n- 未來預防措施說明\n- 感謝客人提供改進機會\n風格：誠懇、專業、負責任、解決問題導向\n格式：250 字左右，語氣平和，清楚表達店家的處理誠意",
    
    "美髮設計師個人品牌故事": "角色：你是個人品牌故事文案撰寫專家\n任務：撰寫一篇美髮設計師的個人品牌故事\n內容：包含以下元素：\n- 設計師的職業起源與啟發\n- 專業訓練與重要里程碑\n- 獨特的美髮理念與風格\n- 克服的挑戰與成長歷程\n- 對客戶的承諾與價值觀\n- 未來願景\n風格：真實、有感染力、展現個人特色與熱情\n格式：300-400 字，敘事流暢，富有情感共鳴點",
    
    "沙龍品牌形象介紹文案": "角色：你是美髮沙龍品牌形象顧問\n任務：撰寫一則沙龍品牌形象介紹文案\n內容：\n- 沙龍的創立理念與故事\n- 品牌核心價值與美學理念\n- 獨特的服務特色與優勢\n- 設計師團隊特質\n- 典型客戶體驗描述\n- 品牌願景與承諾\n風格：專業、時尚、溫暖、有質感\n格式：250-300 字，結構完整，能吸引目標客群的注意",
    
    "招聘文案": "角色：你是美髮產業人才招募專家\n任務：撰寫一則招募美髮設計師的文案\n內容：\n- 吸引人的開場與沙龍簡介\n- 職位描述與主要職責\n- 理想候選人特質與技能要求\n- 工作環境與團隊文化介紹\n- 培訓制度與職涯發展路徑\n- 薪資福利與獎勵機制\n- 應徵方式與聯絡資訊\n風格：熱情、鼓舞人心、展現團隊文化與發展潛力\n格式：300-350 字，結構清晰，重點突出",
    
    "美髮專業知識教育文案": "角色：你是美髮護理教育專家\n任務：撰寫一篇教導客戶正確護髮的短篇貼文\n內容：\n- 常見髮質損傷的原因（如熱工具、染燙、環境因素等）\n- 3-4 個日常正確護髮的實用技巧\n- 不同髮質的護理重點差異\n- 專業產品使用建議\n- 錯誤護髮觀念糾正\n風格：教育性、實用、淺顯易懂\n格式：250-300 字，可用小標題或數字列點分隔不同要點",
    
    "美髮師內訓課程簡介文案": "角色：你是美髮教育培訓專家\n任務：設計一則內部美髮師培訓課程的簡介文案\n內容：\n- 課程目標與價值主張\n- 培訓內容綱要（技術、溝通、管理等面向）\n- 學習成果與能力提升預期\n- 實務演練與回饋機制\n- 講師資歷與專長介紹\n- 團隊協作與知識分享元素\n風格：專業、鼓舞人心、重視實用技能與創意啟發\n格式：300 字左右，結構清晰，突出課程特色與價值",
    
    "產品試用活動推廣文案": "角色：你是美髮產品行銷專家\n任務：設計一則髮品試用推廣文案\n內容：\n- 產品特色與主要功效介紹\n- 試用活動參與方式說明\n- 試用體驗的獨特價值\n- 後續加購優惠詳情\n- 真實體驗見證分享\n- 活動期限與限量提示\n風格：熱情邀請、強調體驗價值、適度製造稀缺感\n格式：200-250 字，包含清晰的行動呼籲和參與步驟",
    
    "店內年度感謝活動文案": "角色：你是美髮沙龍活動策劃專家\n任務：撰寫一篇店內年度感謝活動文案\n內容：\n- 真摯的感謝詞與回顧年度亮點\n- 活動日期、時間與形式\n- 特別優惠詳情（如折扣、贈品、限定服務等）\n- VIP客戶專屬禮遇\n- 活動當天特色與亮點\n- 預約與參與方式\n風格：誠懇感謝、慶祝氛圍、重視客戶關係\n格式：250-300 字，重點突出，包含吸引人的標題與行動呼籲",
    
    "主題沙龍活動宣傳文案": "角色：你是美髮主題活動創意總監\n任務：規劃一個「夏日輕盈護髮派對」的活動文案\n內容：\n- 夏季髮質問題與護理需求介紹\n- 活動時間、地點與參與方式\n- 活動亮點與特色體驗（如髮質診斷、客製化護理等）\n- 專業髮型師現場示範與諮詢\n- 參與者專屬優惠與禮品\n- 報名方式與截止日期\n風格：充滿夏日活力、愉悅輕鬆、專業中帶有趣味性\n格式：300 字左右，條理分明，視覺描述生動",
    
    "髮型趨勢分析與分享文": "角色：你是時尚髮型趨勢分析師\n任務：撰寫一篇介紹最新流行髮型風格的短文\n內容：\n- 當下 2-3 種主流髮型趨勢介紹\n- 各髮型的特點與設計重點\n- 適合的臉型、髮質與個人風格分析\n- 日常維護與造型建議\n- 名人/網紅示範案例參考\n風格：專業、時尚敏銳、實用建議為導向\n格式：300-350 字，可分段或以小標題區分不同髮型，易於閱讀",
    
    "當季髮色流行推薦文案": "角色：你是時尚美髮色彩專家\n任務：設計一則推薦當季流行髮色的貼文\n內容：\n- 當季 3-4 種流行髮色介紹\n- 各髮色與不同膚色的搭配建議\n- 個人氣質與髮色選擇指南\n- 髮色維護與保養技巧\n- 預約染髮前的注意事項\n- 特別優惠與預約資訊\n風格：時尚專業、個人化建議、視覺描述豐富\n格式：250-300 字，結構清晰，易於理解不同色系特點",
    
    "IG 快問快答活動設計": "角色：你是美髮社群互動專家\n任務：設計一個「這個髮型適合你嗎？」的限時快問快答活動\n內容：\n- 引人注目的活動介紹與參與方式\n- 3-5 個關於臉型、髮質、生活習慣的診斷問題\n- 根據答案提供的髮型推薦邏輯\n- 互動回覆模板與引導私訊的話術\n- 參與者可獲得的專屬優惠\n風格：互動性強、個人化、專業中帶有趣味\n格式：問題簡短明確，回答選項清晰，整體流程順暢，適合限時動態呈現"
  };
  
  // 複製提示詞功能
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 獲取提示詞內容
      const card = this.closest('.prompt-card');
      let promptText = this.getAttribute('data-prompt');
      
      // 如果卡片處於Pro模式，使用進階提示詞
      if (card.classList.contains('pro-active')) {
        const cardTitle = card.querySelector('.prompt-title').textContent;
        if (proPrompts[cardTitle]) {
          promptText = proPrompts[cardTitle];
        }
      }
      
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
  
  // 修改 Pro 按鈕的點擊事件處理
  function setupProRibbons() {
    // 為每個卡片添加Pro Ribbon
    document.querySelectorAll('.prompt-card').forEach(card => {
      const cardTitle = card.querySelector('.prompt-title').textContent;
      if (proPrompts[cardTitle]) {
        const ribbon = document.createElement('div');
        ribbon.className = 'ribbon-pro';
        ribbon.textContent = '進階版提示詞';
        
        // 在卡片內添加ribbon
        card.appendChild(ribbon);
        
        // 添加點擊事件
        ribbon.addEventListener('click', function() {
          const contentElement = card.querySelector('.prompt-content');
          const copyBtn = card.querySelector('.copy-btn');
          
          // 檢查是否已經在 Pro 模式
          if (card.classList.contains('pro-active')) {
            // 已經在 Pro 模式，直接切換回基本模式
            card.classList.remove('pro-active');
            contentElement.classList.remove('pro');
            contentElement.querySelector('p').textContent = copyBtn.getAttribute('data-prompt');
          } else {
            // Directly activate Pro mode without checking usage count
            card.classList.add('pro-active');
            contentElement.classList.add('pro');
            // 將原始提示詞轉換為結構化HTML
            const promptText = proPrompts[cardTitle];
            let formattedHTML = '';
            
            // 處理提示詞格式化
            const lines = promptText.split('\n');
            let inList = false; // To track if we are currently inside a list
            
            lines.forEach(line => {
              const trimmedLine = line.trim();
              if (trimmedLine.includes('角色：') || trimmedLine.includes('任務：') || trimmedLine.includes('內容：') || 
                  trimmedLine.includes('風格：') || trimmedLine.includes('格式：')) {
                if (inList) {
                  formattedHTML += '</ul>'; // Close list if active
                  inList = false;
                }
                const [label, ...valueParts] = trimmedLine.split('：');
                const value = valueParts.join('：').trim();
                formattedHTML += `<p class="pro-prompt-line"><span class="pro-prompt-label">${label}：</span><span class="pro-prompt-value">${value || ''}</span></p>`;
              } else if (trimmedLine.startsWith('- ')) {
                if (!inList) {
                  formattedHTML += '<ul class="pro-prompt-list">';
                  inList = true;
                }
                formattedHTML += `<li class="pro-prompt-list-item">${trimmedLine.substring(2).trim()}</li>`;
              } else if (trimmedLine === '') {
                if (inList) {
                  formattedHTML += '</ul>'; // Close list if active
                  inList = false;
                }
                formattedHTML += '<p class="pro-prompt-empty-line"></p>';
              } else {
                if (inList) {
                  formattedHTML += '</ul>'; // Close list if active
                  inList = false;
                }
                formattedHTML += `<p class="pro-prompt-paragraph">${line}</p>`;
              }
            });
            
            // Ensure any open list is closed at the end
            if (inList) {
              formattedHTML += '</ul>';
            }
            
            contentElement.querySelector('p').innerHTML = formattedHTML;
          }
        });
      }
    });
  }
  
  // 執行Pro Ribbon設置
  setupProRibbons();
}); 