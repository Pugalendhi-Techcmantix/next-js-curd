'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
} from 'antd';
import axios from 'axios';
import { ApiResponse, Student, StudentForm } from './types';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm<StudentForm>();

  const fetchStudents = async () => {
    const res = await axios.get<ApiResponse<Student[]>>('/api/students');
    setStudents(res.data.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ ADD / UPDATE
  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingStudent) {
      await axios.put(`/api/students/${editingStudent.id}`, values);
    } else {
      await axios.post('/api/students', values);
    }

    await fetchStudents(); // 🔥 MUST await

    setOpen(false);
    setEditingStudent(null);
    form.resetFields();
  };

  // 🗑 DELETE
  const handleDelete = async (id: number) => {
    await axios.delete(`/api/students/${id}`);
    fetchStudents();
  };

  // ✏ OPEN EDIT
  const handleEdit = async (id: number) => {
    const res = await axios.get<ApiResponse<Student>>(`/api/students/${id}`);

    const student = res.data.data; // ✅ double data

    setEditingStudent(student);
    setOpen(true);

    form.setFieldsValue({
      name: student.name,
      email: student.email,
      age: student.age,
      number: student.number,
    });
  };

  // ➕ OPEN CREATE
  const handleAdd = () => {
    setEditingStudent(null);
    setOpen(true);
    form.resetFields();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Number', dataIndex: 'number' },
    {
      title: 'Action',
      render: (_: any, record: Student) => (
        <Space>
          <Button onClick={() => handleEdit(record.id)}>Edit</Button>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Card Container */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🎓 Student Management
          </h2>

          <Button type="primary" onClick={handleAdd}>
            + Add Student
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border">
          <Table
            dataSource={students}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            {editingStudent ? '✏ Edit Student' : '➕ Add Student'}
          </span>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingStudent(null);
        }}
        onOk={handleSubmit}
        okText={editingStudent ? 'Update' : 'Create'}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="Enter age" />
          </Form.Item>

          <Form.Item
            name="number"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
