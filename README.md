# Netron

Netron - это мощный Node.js модуль для тестирования компьютерных сетей, который сочетает в себе удобство Jest с функциональностью Postman. Модуль позволяет легко создавать и выполнять тесты сетевых запросов с богатым набором возможностей.

## Особенности

- 🚀 Поддержка всех основных HTTP методов (GET, POST, PUT, DELETE, PATCH)
- 📊 Отслеживание истории запросов с метриками производительности
- 🔄 Перехватчики запросов и ответов
- 🔒 Встроенная поддержка аутентификации
- 🌐 Настройка прокси и редиректов
- ⏱️ Настраиваемые таймауты
- 🧪 Полная интеграция с Jest
- 📝 Подробное логирование и отладка

## Установка

```bash
npm install netron
```

## Использование

### Базовое использование

```javascript
const NetworkTester = require('netron');

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

### Настройка заголовков и аутентификации

```javascript
tester.setDefaultHeaders({
  'Authorization': 'Bearer token123',
  'Content-Type': 'application/json'
});

tester.setAuth({
  username: 'user',
  password: 'pass'
});
```

### Использование перехватчиков

```javascript
// Перехватчик запросов
tester.addRequestInterceptor(config => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

// Перехватчик ответов
tester.addResponseInterceptor(response => {
  console.log(`Request to ${response.config.url} took ${response.duration}ms`);
  return response;
});
```

### Отслеживание истории запросов

```javascript
// Получение истории запросов
const history = tester.getRequestHistory();
console.log(history);

// Очистка истории
tester.clearRequestHistory();
```

### Настройка прокси и таймаутов

```javascript
tester.setProxy({
  host: 'proxy.example.com',
  port: 8080
});

tester.setTimeout(5000); // 5 секунд
tester.setMaxRedirects(3);
```

## API

### Основные методы

- `get(url, config)`
- `post(url, data, config)`
- `put(url, data, config)`
- `delete(url, config)`
- `patch(url, data, config)`

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

## Примеры тестов

### Тестирование REST API

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

### Тестирование производительности

```javascript
test('API performance', async () => {
  const startTime = Date.now();
  
  await tester.get('/users');
  
  const history = tester.getRequestHistory();
  const requestDuration = history[0].duration;
  
  expect(requestDuration).toBeLessThan(1000); // Менее 1 секунды
});
```

## Лицензия

MIT 