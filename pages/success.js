import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data', {
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API data:', data);
        } else {
          console.error('Failed to fetch API data');
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData();

    // Redirect back to the home page after 5 seconds (or any other desired action)
    const timer = setTimeout(() => {
      router.push('/');
    }, 8000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>Payment Successful</h1>
      {/* You can display a success message or any other content here */}
    </div>
  );
};

export default SuccessPage;
