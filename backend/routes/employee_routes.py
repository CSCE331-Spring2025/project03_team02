from flask import Blueprint, jsonify, request
from database import db, Employee
import uuid
import logging

# blueprint for handling employee-related routes
employee_routes_bp = Blueprint('employee_routes', __name__)

'''
GET employees endpoint

This endpoint gets all employees from the database
'''
@employee_routes_bp.route("/getemployees", methods=['GET'])
def get_employees():
    employees = []

    try:
        # fetch all employees from database
        employee_results = Employee.query.all()

        # format employee data for response
        for employee in employee_results:
            employees.append({
                'id': str(employee.id),
                'name': employee.name,
                'is_manager': employee.is_manager
            })
        
        logging.info(f"Retrieved {len(employees)} employees")
        return jsonify({'data': employees})

    except Exception as error:
        logging.error(f"Error retrieving employees: {error}")
        return jsonify({'error': 'Failed to retrieve employees'}), 500

'''
POST employee endpoint

This endpoint creates a new employee in the database
'''
@employee_routes_bp.route('/addemployee', methods=['POST'])
def add_employee():
    data = request.get_json()
    
    # validate request data
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'name' not in data or not data['name'].strip():
        return jsonify({'error': 'Employee name is required'}), 400
    
    try:
        name = data.get('name')
        is_manager = data.get('is_manager', False)
        custom_id = data.get('id')
        
        # handle custom id if provided
        if custom_id:
            try:
                # validate and convert custom id to uuid
                employee_id = uuid.UUID(custom_id)
                
                # check for duplicate id
                existing_employee = Employee.query.get(employee_id)
                if existing_employee:
                    return jsonify({'error': 'An employee with this ID already exists'}), 400
                
                employee = Employee(id=employee_id, name=name, is_manager=is_manager)
            except ValueError:
                return jsonify({'error': 'Invalid UUID format for employee ID'}), 400
        else:
            # create employee with auto-generated id
            employee = Employee(name=name, is_manager=is_manager)
        
        db.session.add(employee)
        db.session.commit()
        
        logging.info(f"Added new employee: {employee.name} (ID: {employee.id})")
        return jsonify({'data': {'id': str(employee.id), 'name': employee.name, 'is_manager': employee.is_manager}}), 201
    
    except Exception as error:
        db.session.rollback()
        logging.error(f"Error adding employee: {error}")
        return jsonify({'error': 'Failed to add employee'}), 500

'''
PUT employee endpoint

This endpoint updates an existing employee in the database
'''
@employee_routes_bp.route('/updateemployee/<id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # find employee by id
        employee = Employee.query.get(id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # track changes for logging
        old_name = employee.name
        old_role = "Manager" if employee.is_manager else "Employee"
        
        # update employee fields
        employee.name = data.get('name', employee.name)
        employee.is_manager = data.get('is_manager', employee.is_manager)
        
        new_role = "Manager" if employee.is_manager else "Employee"
        
        db.session.commit()
        
        logging.info(f"Updated employee ID {id}: {old_name} → {employee.name}, {old_role} → {new_role}")
        return jsonify({'data': {'id': str(employee.id), 'name': employee.name, 'is_manager': employee.is_manager}})
    
    except Exception as error:
        db.session.rollback()
        logging.error(f"Error updating employee {id}: {error}")
        return jsonify({'error': 'Failed to update employee'}), 500

'''
DELETE employee endpoint

This endpoint deletes an employee from the database
'''
@employee_routes_bp.route('/deleteemployee/<id>', methods=['DELETE'])
def delete_employee(id):
    try:
        # find employee by id
        employee = Employee.query.get(id)
        
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # store name for logging before deletion
        employee_name = employee.name
        db.session.delete(employee)
        db.session.commit()
        
        logging.info(f"Deleted employee: {employee_name} (ID: {id})")
        return jsonify({'message': 'Employee deleted successfully'})
    
    except Exception as error:
        db.session.rollback()
        logging.error(f"Error deleting employee {id}: {error}")
        return jsonify({'error': 'Failed to delete employee'}), 500 