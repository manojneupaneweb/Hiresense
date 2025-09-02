import React, { useEffect } from 'react';
import axios from 'axios';

function VerifyUser() {
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Token not provided');
        return;
      }

      try {
        const res = await axios.get('/api/user/verifyuser', {
          withCredentials: true,
        });
        console.log('Verified user:', res.data);
      } catch (error) {
        console.error('Error verifying user:', error.response?.data?.message || error.message);
      }
    };

    fetchUser();
  }, []);

  return nunll;
}

export default VerifyUser;
