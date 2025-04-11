import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import useAppStore from "../utils/useAppStore";

import { IEmployee } from "../utils/interfaces";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    is_manager: false
  });

  const user = useAppStore(state => state.user);

  // Get all employees
  const getEmployees = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getemployees`);
      setEmployees(response.data.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to load employees. Error: ${err.response?.data?.message || err.message}`);
      } else {
        setError("Failed to load employees. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/addemployee`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      getEmployees();
      resetForm();
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to add employee. Error: ${err.response?.data?.message || err.message}`);
      } else {
        setError("Failed to add employee. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async () => {
    if (!currentEmployee) return;

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/updateemployees/${currentEmployee.id}`,
        {
          name: formData.name,
          is_manager: formData.is_manager
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh the employee list after updating
      getEmployees();
      resetForm();
      setIsEditing(false);
      setCurrentEmployee(null);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to update employee. Error: ${err.response?.data?.message || err.message}`);
      } else {
        setError("Failed to update employee. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
  
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteemployee/${id}`);
  
      // Refresh the employee list after deletion
      getEmployees();
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to delete employee. Error: ${err.response?.data?.message || err.message}`);
      } else {
        setError("Failed to delete employee. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const generateUUID = () => {
    const newUUID = uuid()

    setFormData({
      ...formData,
      id: newUUID
    });
  };

  const editEmployee = (employee: IEmployee) => {
    setCurrentEmployee(employee);
    setFormData({
      id: employee.id,
      name: employee.name,
      is_manager: employee.is_manager
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      is_manager: false
    });
    setIsEditing(false);
    setCurrentEmployee(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  if(!user || !user.is_manager) {
    navigate("/signin");
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

      {/* Simple refresh button */}
      <div className="mb-4">
        <button
          onClick={getEmployees}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh Employees
        </button>
      </div>

      {/* Loading and error states */}
      {loading && <p className="mb-4">Loading...</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Add/Edit Employee Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {isEditing ? "Edit Employee" : "Add New Employee"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-900 mb-1">
              Employee ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 ${isEditing ? "bg-gray-100" : "bg-white"
                  }`}
                required={!isEditing}
                disabled={isEditing}
                placeholder="UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={generateUUID}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                >
                  Generate UUID
                </button>
              )}
            </div>
            {!isEditing && (
              <p className="text-xs text-gray-600 mt-1">
                Enter a valid UUID or click "Generate UUID" to create one automatically.
              </p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-600 mt-1">Employee ID cannot be changed when editing</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_manager"
              name="is_manager"
              checked={formData.is_manager}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_manager" className="ml-2 block text-sm font-medium text-gray-900">
              Manager
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white font-medium ${loading
                ? "bg-gray-400"
                : isEditing
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-blue-700 hover:bg-blue-800"
                }`}
              disabled={loading}
            >
              {loading ? "Loading..." : isEditing ? "Update Employee" : "Add Employee"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b text-gray-900">
          Employees List
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.is_manager ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}>
                        {employee.is_manager ? "Manager" : "Employee"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editEmployee(employee)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage; 