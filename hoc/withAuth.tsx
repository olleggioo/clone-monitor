import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { userAPI, deviceAPI } from '@/api';
import { Loader } from '@/components';
import { refreshUser } from '@/helpers';
import { NextPage } from 'next';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms';

const withAuth = (Component: NextPage) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useAtom(userAtom);

    const isRefreshing = useRef(false);
    const refreshTimer = useRef<NodeJS.Timeout | null>(null);
    const roleAccessTimer = useRef<NodeJS.Timeout | null>(null);
    const abortController = useRef<AbortController | null>(null);

    // Функция для обновления токена
    const refresh = async () => {
      if (isRefreshing.current) return;
      isRefreshing.current = true;

      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      const accessToken = localStorage.getItem(`${process.env.API_URL}_accessToken`);
      const refreshToken = localStorage.getItem(`${process.env.API_URL}_refreshToken`);

      if (!accessToken || !refreshToken) {
        console.warn('Токены отсутствуют, перенаправляем на страницу входа');
        router.push('/login');
        return;
      }

      try {
        const res = await userAPI.refreshUser(
          { accessToken, refreshToken },
          { signal: abortController.current.signal },
        );

        setUserInfo(res);
        refreshUser(res);
        setLoading(false);

        if (refreshTimer.current) {
          clearTimeout(refreshTimer.current);
        }
        refreshTimer.current = setTimeout(refresh, 119000);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Запрос на обновление токена был отменён');
        } else {
          console.error('Ошибка обновления токена:', error);
          router.push('/login');
        }
      } finally {
        isRefreshing.current = false;
      }
    };

    // Функция для обновления role-access
    const updateRoleAccess = async () => {
      try {
        const res = await deviceAPI.getRoleAccess({
          relations: {
            role: true,
            access: true,
          },
        });

        localStorage.setItem('roleAccess', JSON.stringify(res));

        const roleId = localStorage.getItem(`${process.env.API_URL}_role`);
        if (roleId) {
          const parsedData = res;
          const rows = parsedData.rows || [];
          const initialCheckboxes = rows.filter((item: any) => item.role.id === roleId);
    
          localStorage.setItem('currentRoleAccess', JSON.stringify(initialCheckboxes));
        }
      } catch (error) {
        console.error('Ошибка обновления role-access:', error);
      } finally {
        if (roleAccessTimer.current) {
          clearTimeout(roleAccessTimer.current);
        }
        roleAccessTimer.current = setTimeout(updateRoleAccess, 119000);
      }
    };

    useEffect(() => {
      refresh();
      updateRoleAccess();

      return () => {
        if (refreshTimer.current) {
          clearTimeout(refreshTimer.current);
        }
        if (roleAccessTimer.current) {
          clearTimeout(roleAccessTimer.current);
        }
        if (abortController.current) {
          abortController.current.abort();
        }
      };
    }, []);

    if (loading) {
      return <Loader />;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
