const axios = require('axios');

class NetworkTester {
  constructor() {
    this.axiosInstance = axios.create();
    this.requestHistory = [];
    this.interceptors = [];
  }

  /**
   * Отправляет HTTP GET запрос
   * @param {string} url - URL для запроса
   * @param {Object} config - Конфигурация запроса
   * @returns {Promise} - Ответ от сервера
   */
  async get(url, config = {}) {
    return this.request('GET', url, null, config);
  }

  /**
   * Отправляет HTTP POST запрос
   * @param {string} url - URL для запроса
   * @param {Object} data - Данные для отправки
   * @param {Object} config - Конфигурация запроса
   * @returns {Promise} - Ответ от сервера
   */
  async post(url, data = {}, config = {}) {
    return this.request('POST', url, data, config);
  }

  /**
   * Отправляет HTTP PUT запрос
   * @param {string} url - URL для запроса
   * @param {Object} data - Данные для отправки
   * @param {Object} config - Конфигурация запроса
   * @returns {Promise} - Ответ от сервера
   */
  async put(url, data = {}, config = {}) {
    return this.request('PUT', url, data, config);
  }

  /**
   * Отправляет HTTP DELETE запрос
   * @param {string} url - URL для запроса
   * @param {Object} config - Конфигурация запроса
   * @returns {Promise} - Ответ от сервера
   */
  async delete(url, config = {}) {
    return this.request('DELETE', url, null, config);
  }

  /**
   * Отправляет HTTP PATCH запрос
   * @param {string} url - URL для запроса
   * @param {Object} data - Данные для отправки
   * @param {Object} config - Конфигурация запроса
   * @returns {Promise} - Ответ от сервера
   */
  async patch(url, data = {}, config = {}) {
    return this.request('PATCH', url, data, config);
  }

  /**
   * Универсальный метод для отправки HTTP запросов
   * @private
   */
  async request(method, url, data = null, config = {}) {
    try {
      const startTime = Date.now();
      const response = await this.axiosInstance.request({
        method,
        url,
        data,
        ...config
      });
      
      const endTime = Date.now();
      const requestInfo = {
        method,
        url,
        data,
        config,
        response,
        duration: endTime - startTime,
        timestamp: new Date().toISOString()
      };

      this.requestHistory.push(requestInfo);
      return response;
    } catch (error) {
      const errorInfo = {
        method,
        url,
        data,
        config,
        error: error.response || error,
        timestamp: new Date().toISOString()
      };
      this.requestHistory.push(errorInfo);
      throw error;
    }
  }

  /**
   * Устанавливает заголовки по умолчанию для всех запросов
   * @param {Object} headers - Заголовки
   */
  setDefaultHeaders(headers) {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers
    };
  }

  /**
   * Устанавливает базовый URL для всех запросов
   * @param {string} baseURL - Базовый URL
   */
  setBaseURL(baseURL) {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Устанавливает таймаут для запросов
   * @param {number} timeout - Таймаут в миллисекундах
   */
  setTimeout(timeout) {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * Добавляет перехватчик запросов
   * @param {Function} interceptor - Функция-перехватчик
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.push(interceptor);
    this.axiosInstance.interceptors.request.use(interceptor);
  }

  /**
   * Добавляет перехватчик ответов
   * @param {Function} interceptor - Функция-перехватчик
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.push(interceptor);
    this.axiosInstance.interceptors.response.use(interceptor);
  }

  /**
   * Получает историю запросов
   * @returns {Array} История запросов
   */
  getRequestHistory() {
    return this.requestHistory;
  }

  /**
   * Очищает историю запросов
   */
  clearRequestHistory() {
    this.requestHistory = [];
  }

  /**
   * Устанавливает параметры аутентификации
   * @param {Object} auth - Параметры аутентификации
   */
  setAuth(auth) {
    this.axiosInstance.defaults.auth = auth;
  }

  /**
   * Устанавливает параметры прокси
   * @param {Object} proxy - Параметры прокси
   */
  setProxy(proxy) {
    this.axiosInstance.defaults.proxy = proxy;
  }

  /**
   * Устанавливает максимальное количество редиректов
   * @param {number} maxRedirects - Максимальное количество редиректов
   */
  setMaxRedirects(maxRedirects) {
    this.axiosInstance.defaults.maxRedirects = maxRedirects;
  }
}

module.exports = NetworkTester; 