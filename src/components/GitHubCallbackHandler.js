import { useEffect } from 'react';

const GitHubCallbackHandler = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    if (code && jwtToken) {
      fetch('http://localhost:8080/api/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log('GitHub connected:', data.message);
          } else {
            console.error('Error connecting GitHub:', data);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  }, []);

  return null;
};

export default GitHubCallbackHandler;
