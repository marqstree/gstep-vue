// 读
export function getCacheValueByKey(key) {
    return localStorage.getItem(key);
}

// 写
export function setCacheValueByKey(key, val) {
    localStorage.setItem(key, val);
}

//删除
export function removeCacheByKey(key) {
    localStorage.removeItem(key);
}

// 清除所有缓存
export function clearCache() {
    localStorage.clear()
}