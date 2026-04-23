import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../api/client';
import { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { toast } from '../utils/toaster';
// 1. USE FETCH (GET)
export function useFetch<T>(url: string, autoFetch: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
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
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);
  return { data, loading, error, refetch: fetchData };
}

// 2. USE POST
export function usePost<T, R = any>(url: string) {
  const [loading, setLoading] = useState(false);

  const execute = async (payload: T, config?: AxiosRequestConfig): Promise<R | null> => {
    setLoading(true);
    try {
      const response = await apiClient.post<R>(url, payload, config);
      toast.success("Success", "Action completed successfully");
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error("Error", axiosError.response?.data?.message || 'Submit failed');
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
      toast.success("Success", "Update completed successfully");
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error("Error", axiosError.response?.data?.message || 'Update failed');

      throw axiosError.response?.data?.message || 'Update failed';
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}



export function useDelete(url: string) {
  const [loading, setLoading] = useState(false);

  const execute = async (id?: string | number) => {
    setLoading(true);
    try {
      // If an ID is provided, append it to the URL, otherwise use the base URL
      const finalUrl = id ? `${url}/${id}` : url;
      const response = await apiClient.delete(finalUrl);
      toast.success("Success", response.data?.message || 'Delete completed successfully');
      return response.data;
    } catch (err: any) {
      console.error("Delete failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}