"use client";

import { login, setToken } from "@/app/lib/auth";
import jwtAxios from "@/app/lib/jwtAxios";
import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await jwtAxios.post("/auth/login", values);

      setToken(res.data.data.token);

      message.success(res.data.message);
      login(res.data.data.token, res.data.data.user);

      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.response?.data?.message);
      const errorList = error?.response?.data?.errors || {};
      form.setFields(
        Object.keys(values).map((field) => ({ name: field, errors: [] })),
      );
      const validationErrors = Object.entries(errorList).map(
        ([fieldName, messages]) => ({
          name: fieldName,
          errors: messages as string[],
        }),
      );
      form.setFields(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Login" className="w-full max-w-md shadow-xl rounded-xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Email" name="email">
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Login
        </Button>

        <div className="text-center mt-5">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </div>
      </Form>
    </Card>
  );
}
