# Netron

[![npm version](https://img.shields.io/npm/v/@kidoweb/netron.svg)](https://www.npmjs.com/package/@kidoweb/netron)
[![GitHub license](https://img.shields.io/github/license/kidoweb/Netron)](https://github.com/kidoweb/Netron/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/kidoweb/Netron)](https://github.com/kidoweb/Netron/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/kidoweb/Netron)](https://github.com/kidoweb/Netron/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/kidoweb/Netron)](https://github.com/kidoweb/Netron/pulls)
[![Coverage Status](https://coveralls.io/repos/github/kidoweb/Netron/badge.svg?branch=main)](https://coveralls.io/github/kidoweb/Netron?branch=main)

Netron - это мощный Node.js модуль для тестирования компьютерных сетей, который сочетает в себе удобство Jest с функциональностью Postman. Модуль позволяет легко создавать и выполнять тесты сетевых запросов с богатым набором возможностей.

## 🌟 Особенности

- 🚀 Поддержка всех основных HTTP методов (GET, POST, PUT, DELETE, PATCH)
- 📊 Отслеживание истории запросов с метриками производительности
- 🔄 Перехватчики запросов и ответов
- 🔒 Встроенная поддержка аутентификации
- 🌐 Настройка прокси и редиректов
- ⏱️ Настраиваемые таймауты
- 🧪 Полная интеграция с Jest
- 📝 Подробное логирование и отладка
- 🔌 WebSocket тестирование
- 📈 GraphQL тестирование
- 🚀 Тестирование производительности
- 🛡️ Тестирование безопасности

## 📦 Установка

```bash
npm install @kidoweb/netron
```

## 🚀 Использование

### Базовое использование

```javascript
const NetworkTester = require('@kidoweb/netron');

describe('API Tests', () => {
  let tester;

  beforeEach(() => {
    tester = new NetworkTester();
    tester.setBaseURL('https://api.example.com');
  });

  test('should get user data', async () => {
    const response = await tester.get('/users/1');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('name');
  });
});
```

### WebSocket тестирование

```javascript
test('WebSocket communication', async () => {
  const { id } = await tester.connectWebSocket('wss://echo.websocket.org');
  const message = { type: 'test', data: 'hello' };
  
  await tester.sendWebSocketMessage(id, message);
  await tester.closeWebSocket(id);
});
```

### GraphQL тестирование

```javascript
test('GraphQL query', async () => {
  const clientId = await tester.createGraphQLClient('https://api.example.com/graphql');
  const query = `
    query {
      users {
        id
        name
      }
    }
  `;

  const response = await tester.executeGraphQLQuery(clientId, query);
  expect(response).toBeDefined();
});
```

### Тестирование производительности

```javascript
test('API performance', async () => {
  const result = await tester.runPerformanceTest('https://api.example.com/users', {
    connections: 10,
    duration: 10
  });

  expect(result.requests.average).toBeGreaterThan(0);
  expect(result.latency.average).toBeLessThan(1000);
});
```

### Тестирование безопасности

```javascript
test('Security headers', async () => {
  const headers = await tester.testSecurityHeaders('https://api.example.com');
  expect(headers['X-Frame-Options']).toBeDefined();
  expect(headers['X-XSS-Protection']).toBeDefined();
});

test('Rate limiting', async () => {
  const results = await tester.testRateLimiting('https://api.example.com/users', 10);
  expect(results).toHaveLength(10);
  expect(results[0]).toHaveProperty('status');
});
```

## 📚 API

### HTTP методы

- `get(url, config)`
- `post(url, data, config)`
- `put(url, data, config)`
- `delete(url, config)`
- `patch(url, data, config)`

### WebSocket методы

- `connectWebSocket(url, options)`
- `sendWebSocketMessage(connectionId, message)`
- `closeWebSocket(connectionId)`

### GraphQL методы

- `createGraphQLClient(url, options)`
- `executeGraphQLQuery(clientId, query, variables)`

### Тестирование производительности

- `runPerformanceTest(url, options)`
- `getPerformanceMetrics()`

### Тестирование безопасности

- `testSecurityHeaders(url)`
- `testRateLimiting(url, requests, interval)`

### Конфигурация

- `setBaseURL(baseURL)`
- `setDefaultHeaders(headers)`
- `setTimeout(timeout)`
- `setAuth(auth)`
- `setProxy(proxy)`
- `setMaxRedirects(maxRedirects)`

### Перехватчики

- `addRequestInterceptor(interceptor)`
- `addResponseInterceptor(interceptor)`

### История запросов

- `getRequestHistory()`
- `clearRequestHistory()`

## 📖 Примеры

### Полный пример тестирования REST API

```javascript
describe('REST API Tests', () => {
  let tester;

  beforeEach(() => {
    tester = new NetworkTester();
    tester.setBaseURL('https://api.example.com');
  });

  test('CRUD operations', async () => {
    // Create
    const createResponse = await tester.post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    expect(createResponse.status).toBe(201);
    const userId = createResponse.data.id;

    // Read
    const getResponse = await tester.get(`/users/${userId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.name).toBe('John Doe');

    // Update
    const updateResponse = await tester.put(`/users/${userId}`, {
      name: 'John Updated'
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.name).toBe('John Updated');

    // Delete
    const deleteResponse = await tester.delete(`/users/${userId}`);
    expect(deleteResponse.status).toBe(200);
  });
});
```

### Пример тестирования WebSocket приложения

```javascript
describe('WebSocket Tests', () => {
  let tester;
  let wsConnection;

  beforeEach(async () => {
    tester = new NetworkTester();
    wsConnection = await tester.connectWebSocket('wss://api.example.com/ws');
  });

  afterEach(async () => {
    await tester.closeWebSocket(wsConnection.id);
  });

  test('Real-time communication', async () => {
    const message = {
      type: 'subscribe',
      channel: 'updates'
    };

    await tester.sendWebSocketMessage(wsConnection.id, message);
    // Добавьте проверки ответа
  });
});
```

### Пример тестирования GraphQL API

```javascript
describe('GraphQL Tests', () => {
  let tester;
  let clientId;

  beforeEach(async () => {
    tester = new NetworkTester();
    clientId = await tester.createGraphQLClient('https://api.example.com/graphql');
  });

  test('Complex query', async () => {
    const query = `
      query GetUserWithPosts($userId: ID!) {
        user(id: $userId) {
          id
          name
          posts {
            id
            title
            comments {
              id
              text
            }
          }
        }
      }
    `;

    const variables = { userId: '1' };
    const response = await tester.executeGraphQLQuery(clientId, query, variables);
    
    expect(response.user).toBeDefined();
    expect(response.user.posts).toBeInstanceOf(Array);
  });
});
```

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста, ознакомьтесь с нашими [правилами для контрибьюторов](CONTRIBUTING.md) перед тем, как отправлять pull request.

## 📝 Лицензия

Этот проект лицензирован под MIT - см. файл [LICENSE](LICENSE) для подробностей.

## 👥 Авторы

- **kidoweb** - *Изначальная работа* - [kidoweb](https://github.com/kidoweb)

## 🙏 Благодарности

- [Jest](https://jestjs.io/) - Фреймворк для тестирования
- [Axios](https://axios-http.com/) - HTTP клиент
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - Протокол WebSocket
- [GraphQL](https://graphql.org/) - Язык запросов GraphQL
- [Autocannon](https://github.com/mcollina/autocannon) - Инструмент для тестирования производительности

## 📞 Поддержка

Если у вас есть вопросы или проблемы, пожалуйста, создайте issue в [GitHub репозитории](https://github.com/kidoweb/Netron/issues).

## ❓ Часто задаваемые вопросы (FAQ)

### Q: Как начать использовать Netron?
A: Установите пакет через npm: `npm install @kidoweb/netron` и следуйте примерам в разделе "Использование" выше.

### Q: Поддерживает ли Netron асинхронные тесты?
A: Да, Netron полностью поддерживает асинхронные тесты с использованием async/await.

### Q: Можно ли использовать Netron без Jest?
A: Нет, Netron разработан специально для работы с Jest и использует его матчеры для проверок.

### Q: Как настроить таймауты для запросов?
A: Используйте метод `setTimeout(timeout)`, где timeout указывается в миллисекундах.

### Q: Поддерживает ли Netron WebSocket?
A: Да, Netron имеет встроенную поддержку WebSocket с методами для подключения, отправки сообщений и закрытия соединения.

### Q: Как тестировать GraphQL API?
A: Netron предоставляет специальные методы для работы с GraphQL: `createGraphQLClient` и `executeGraphQLQuery`.

### Q: Какие метрики производительности доступны?
A: Netron отслеживает время ответа, количество запросов, среднюю задержку и другие метрики через `getPerformanceMetrics()`.

### Q: Как добавить пользовательские заголовки?
A: Используйте метод `setDefaultHeaders(headers)` или добавляйте заголовки в конфигурацию отдельных запросов.

### Q: Поддерживает ли Netron прокси?
A: Да, вы можете настроить прокси через метод `setProxy(proxy)`.

### Q: Как очистить историю запросов?
A: Используйте метод `clearRequestHistory()`.

### Q: Какие версии Node.js поддерживаются?
A: Netron поддерживает Node.js версии 12 и выше.

### Q: Как внести свой вклад в проект?
A: См. раздел "Вклад в проект" и файл CONTRIBUTING.md для подробной информации. 