import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
const { TextArea } = Input;
const NewPostWindow = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        NewPost
      </Button>
      <Modal
        open={open}
        title="NewPost"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
          <Button
            key="link"
            href="https://google.com"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Search on Google
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <Input placeholder="Title" />
        <Input placeholder="Basic usage" />
        <Input placeholder="Location" />
        <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
      </Modal>
    </>
  );
};
export default NewPostWindow;