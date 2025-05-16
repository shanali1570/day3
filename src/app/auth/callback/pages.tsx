import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');

      if (idToken && accessToken) {
        // Store tokens securely (e.g., cookie, localStorage - temporary for demo)
        localStorage.setItem('id_token', idToken);
        localStorage.setItem('access_token', accessToken);

        // Redirect to your dashboard or home
        router.push('/dashboard');
      } else {
        console.error('Token not found in URL');
      }
    }
  }, [router]);

  return <p>Processing login...</p>;
};

export default Callback;
