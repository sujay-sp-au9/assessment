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

export default function LogIn({ setLogIn }) {
  const onFinish = async (values) => {
    const results = await Axios({
      method: "POST",
      url: "http://localhost:3001/users/login",
      data: {
        ...values,
      },
      withCredentials: true,
    });
    if (results.data.status === "success") {
      setLogIn(true);
    } else {
      window.alert("Try to sign up/ Try again later");
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
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Enter a valid email address!",
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

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Log IN
        </Button>
      </Form.Item>
    </Form>
  );
}
