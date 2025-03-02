import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/admin-api/users');
        setUsers(response.data.payload);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleDelete(userId) {
    try {
      await axios.put(`'/admin-api/users/${userId}/delete`);
      setUsers(users.map(user => user.id === userId ? { ...user, isDeleted: true } : user));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleRestore(userId) {
    try {
      await axios.put(`/admin-api/users/${userId}/restore`);
      setUsers(users.map(user => user.id === userId ? { ...user, isDeleted: false } : user));
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={user.isDeleted ? 'table-danger' : ''}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isDeleted ? 'Deleted' : 'Active'}</td>
                <td>
                  {!user.isDeleted ? (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                  ) : (
                    <button className="btn btn-success btn-sm" onClick={() => handleRestore(user.id)}>Restore</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
