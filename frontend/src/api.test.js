import { describe, expect, it } from 'vitest';
import { api, setTokenGetter } from './api';

describe('API authorization interceptor', () => {
  it('adds the in-memory token to API calls', async () => {
    setTokenGetter(() => 'short-lived-token');
    const config = await api.interceptors.request.handlers[0].fulfilled({
      url: '/documents', baseURL: api.defaults.baseURL, headers: {}
    });
    expect(config.headers.Authorization).toBe('Bearer short-lived-token');
  });

  it('does not attach the token to an unrelated origin', async () => {
    setTokenGetter(() => 'short-lived-token');
    const config = await api.interceptors.request.handlers[0].fulfilled({
      url: 'https://example.invalid/file', baseURL: api.defaults.baseURL, headers: {}
    });
    expect(config.headers.Authorization).toBeUndefined();
  });
});
