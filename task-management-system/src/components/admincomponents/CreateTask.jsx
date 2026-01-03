import React, { useState } from 'react';
import useEmployeeList from '../admincomponents/CreateTask/useEmployeeList';
import TaskForm from '../admincomponents/CreateTask/TaskForm';
import AssignPopup from '../admincomponents/CreateTask/AssignPopup';
import API from '../../api';

const CreateTask = () => {
  const { employees, error: fetchError } = useEmployeeList();
  const [orgFilter, setOrgFilter] = useState('');
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignTo, setAssignTo] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !date || !deadline || assignTo.length === 0 || !category || !description) {
      setError('All fields are required.');
      return;
    }

    const payload = {
      title, date, deadline, category, description,
      assignTo, status: 'Pending'
    };

    try {
      const res = await API.post('/tasks', payload);
      setSuccess(res.data.message || 'Task created successfully!');
      setTitle(''); setDate(''); setDeadline('');
      setAssignTo([]); setCategory(''); setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Task</h2>
        <p className="text-gray-600 mb-6">Assign tasks to employees with deadline and description.</p>

        {fetchError && <div className="text-red-600">{fetchError}</div>}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <TaskForm
            title={title} setTitle={setTitle}
            date={date} setDate={setDate}
            deadline={deadline} setDeadline={setDeadline}
            category={category} setCategory={setCategory}
            description={description} setDescription={setDescription}
            assignTo={assignTo} setShowAssignPopup={setShowAssignPopup}
            onSubmit={handleSubmit}
            error={error}
            success={success}
          />
        </div>
      </div>

      <AssignPopup
        show={showAssignPopup}
        onClose={() => setShowAssignPopup(false)}
        employees={employees}
        assignTo={assignTo}
        setAssignTo={setAssignTo}
        orgFilter={orgFilter}
        setOrgFilter={setOrgFilter}
      />
    </div>
  );
};

export default CreateTask;
