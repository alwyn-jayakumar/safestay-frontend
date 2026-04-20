import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
import { AxiosError } from 'axios';
import type{ AxiosRequestConfig } from 'axios';

// 1. USE FETCH (GET)
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params?: object) => {
    setLoading(true);
    try {
      const response = await apiClient.get<T>(url, { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// 2. USE POST
export function usePost<T, R = any>(url: string) {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: T, config?: AxiosRequestConfig): Promise<R | null> => {
    setLoading(true);
    try {
      const response = await apiClient.post<R>(url, payload, config);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || 'Submit failed';
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}

// 3. USE PUT
export function usePut<T, R = any>(url: string) {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: T, config?: AxiosRequestConfig): Promise<R | null> => {
    setLoading(true);
    try {
      const response = await apiClient.put<R>(url, payload, config);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || 'Update failed';
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}