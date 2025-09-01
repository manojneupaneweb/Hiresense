  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user/getuser', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // If token is invalid, clear stored data
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };