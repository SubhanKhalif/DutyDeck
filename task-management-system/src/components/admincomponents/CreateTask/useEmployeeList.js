import { useEffect, useState } from 'react';
import API from '../../../api';

const useEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get('/users/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err.message);
        setError('Failed to load employee list.');
      }
    };
    fetchEmployees();
  }, []);

  return { employees, error };
};

export default useEmployeeList;
