// 本地存储工具
const STORAGE_KEY = 'ai_topic_history';

// 保存历史记录
export function saveTopicHistory(topics, type) {
  const history = getTopicHistory();
  const newRecord = {
    id: Date.now(),
    time: new Date().toLocaleString(),
    type,
    count: topics.length,
    topics
  };
  
  history.unshift(newRecord);
  // 只保留最近10条
  if (history.length > 10) history.pop();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newRecord;
}

// 获取历史记录
export function getTopicHistory() {
  const history = localStorage.getItem(STORAGE