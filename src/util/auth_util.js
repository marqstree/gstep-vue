import { setCacheValueByKey, getCacheValueByKey, removeCacheByKey } from "./cache_util.js";

//登陆token的键名
export const TOKEN_KEY = process.env.APP_TOKEN_KEY;
export const TOKEN_PREFIX = process.env.APP_TOKEN_PREFIX;

export function getToken() {
    return TOKEN_PREFIX + getCacheValueByKey(TOKEN_KEY)
}

export function setToken(token) {
    setCacheValueByKey(TOKEN_KEY, token)
}

export function removeToken() {
    removeCacheByKey(TOKEN_KEY)
}