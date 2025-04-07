import { useRouter } from 'next/router';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/statistics');
  }, []);

  return null;
};

export default NotFoundPage;