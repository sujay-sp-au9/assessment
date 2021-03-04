import React from "react";
import Axios from "axios";
import { Form, Input, Button } from "antd";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function SignUp({ setLogIn }) {
  const onFinish = async (values) => {
    const results = await Axios({
      method: "POST",
      url: "http://localhost:3001/users/signup",
      data: {
        ...values,
      },
      withCredentials: true,
    });
    if (results.data.status === "success") {
      setLogIn(true);
    } else {
      window.alert("Try to log in/ Try again later");
    }
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            min: 8,
            message:
              "Please input your password, which must contain 8 or more characters!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Again"
        name="passwordConfirm"
        rules={[
          {
            required: true,
            min: 8,
            message:
              "Please input your password, which must contain 8 or more characters!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Sign UP
        </Button>
      </Form.Item>
    </Form>
  );
}
