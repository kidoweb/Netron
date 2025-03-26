const NetworkTester = require('../index');

describe('NetworkTester', () => {
  let tester;

  beforeEach(() => {
    tester = new NetworkTester();
    tester.setBaseURL('https://jsonplaceholder.typicode.com');
  });

  describe('HTTP Methods', () => {
    test('should make a GET request and validate response', async () => {
      const response = await tester.get('/posts/1');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');
    });

    test('should make a POST request and validate response', async () => {
      const postData = {
        title: 'Test Post',
        body: 'Test Body',
        userId: 1
      };

      const response = await tester.post('/posts', postData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(postData.title);
      expect(response.data.body).toBe(postData.body);
    });

    test('should make a PUT request and validate response', async () => {
      const putData = {
        title: 'Updated Post',
        body: 'Updated Body',
        userId: 1
      };

      const response = await tester.put('/posts/1', putData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(putData.title);
      expect(response.data.body).toBe(putData.body);
    });

    test('should make a DELETE request and validate response', async () => {
      const response = await tester.delete('/posts/1');
      expect(response.status).toBe(200);
    });

    test('should make a PATCH request and validate response', async () => {
      const patchData = {
        title: 'Patched Title'
      };

      const response = await tester.patch('/posts/1', patchData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(patchData.title);
    });
  });

  describe('Configuration', () => {
    test('should handle custom headers', async () => {
      tester.setDefaultHeaders({
        'Custom-Header': 'test-value'
      });

      const response = await tester.get('/posts/1');
      expect(response.status).toBe(200);
    });

    test('should handle request timeout', async () => {
      tester.setTimeout(1); // 1ms timeout

      await expect(tester.get('/posts/1')).rejects.toThrow();
    });

    test('should handle authentication', async () => {
      tester.setAuth({
        username: 'test',
        password: 'test'
      });

      const response = await tester.get('/posts/1');
      expect(response.status).toBe(200);
    });
  });

  describe('Request History', () => {
    test('should track request history', async () => {
      await tester.get('/posts/1');
      const history = tester.getRequestHistory();

      expect(history).toHaveLength(1);
      expect(history[0]).toHaveProperty('method', 'GET');
      expect(history[0]).toHaveProperty('url', '/posts/1');
      expect(history[0]).toHaveProperty('duration');
      expect(history[0]).toHaveProperty('timestamp');
    });

    test('should clear request history', async () => {
      await tester.get('/posts/1');
      tester.clearRequestHistory();
      expect(tester.getRequestHistory()).toHaveLength(0);
    });
  });

  describe('Interceptors', () => {
    test('should handle request interceptors', async () => {
      const interceptor = config => {
        config.headers['X-Custom-Header'] = 'test';
        return config;
      };

      tester.addRequestInterceptor(interceptor);
      const response = await tester.get('/posts/1');
      expect(response.status).toBe(200);
    });

    test('should handle response interceptors', async () => {
      const interceptor = response => {
        response.data.intercepted = true;
        return response;
      };

      tester.addResponseInterceptor(interceptor);
      const response = await tester.get('/posts/1');
      expect(response.data.intercepted).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should track failed requests in history', async () => {
      tester.setTimeout(1); // Force timeout

      try {
        await tester.get('/posts/1');
      } catch (error) {
        // Expected error
      }

      const history = tester.getRequestHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toHaveProperty('error');
    });
  });
}); 