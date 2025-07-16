import { format, subDays, isAfter } from 'date-fns';

const STORAGE_KEY = 'seo_rank_history';

export class RankHistoryService {
  static getRankHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading rank history:', error);
      return [];
    }
  }

  static saveRankCheck(data) {
    try {
      const history = this.getRankHistory();
      const newEntry = {
        id: Date.now().toString(),
        keyword: data.keyword,
        domain: data.domain,
        position: data.position,
        url: data.url,
        searchEngine: data.searchEngine || 'google',
        timestamp: new Date().toISOString(),
        found: data.found
      };

      history.push(newEntry);
      
      // Keep only last 1000 entries to prevent storage overflow
      if (history.length > 1000) {
        history.splice(0, history.length - 1000);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return newEntry;
    } catch (error) {
      console.error('Error saving rank check:', error);
      return null;
    }
  }

  static getHistoryForKeyword(keyword, domain, days = 30) {
    const history = this.getRankHistory();
    const cutoffDate = subDays(new Date(), days);
    
    return history
      .filter(entry => 
        entry.keyword.toLowerCase() === keyword.toLowerCase() &&
        entry.domain.toLowerCase() === domain.toLowerCase() &&
        isAfter(new Date(entry.timestamp), cutoffDate)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  static getUniqueKeywords() {
    const history = this.getRankHistory();
    const unique = new Map();
    
    history.forEach(entry => {
      const key = `${entry.keyword}|${entry.domain}`;
      if (!unique.has(key)) {
        unique.set(key, {
          keyword: entry.keyword,
          domain: entry.domain,
          lastChecked: entry.timestamp,
          lastPosition: entry.position,
          searchEngine: entry.searchEngine
        });
      } else {
        const existing = unique.get(key);
        if (new Date(entry.timestamp) > new Date(existing.lastChecked)) {
          existing.lastChecked = entry.timestamp;
          existing.lastPosition = entry.position;
        }
      }
    });

    return Array.from(unique.values()).sort((a, b) => 
      new Date(b.lastChecked) - new Date(a.lastChecked)
    );
  }

  static deleteHistory(keyword, domain) {
    try {
      const history = this.getRankHistory();
      const filtered = history.filter(entry => 
        !(entry.keyword.toLowerCase() === keyword.toLowerCase() &&
          entry.domain.toLowerCase() === domain.toLowerCase())
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting history:', error);
      return false;
    }
  }

  static exportHistory() {
    const history = this.getRankHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `rank_history_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  static importHistory(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        const existing = this.getRankHistory();
        const combined = [...existing, ...imported];
        
        // Remove duplicates based on keyword, domain, and timestamp
        const unique = combined.filter((entry, index, self) =>
          index === self.findIndex(e => 
            e.keyword === entry.keyword &&
            e.domain === entry.domain &&
            e.timestamp === entry.timestamp
          )
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing history:', error);
      return false;
    }
  }
}