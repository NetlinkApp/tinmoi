import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

import { useRouter } from "next/router";
import { useState } from "react";

const schema = yup.object().shape({
  url: yup
    .string()
    .url("Địa chỉ URL không hợp lệ")
    .required("Địa chỉ URL là bắt buộc"),
});

export default function UrlForm() {
  var [data, setData] = useState("");
  const router = useRouter();

  const handleSubmit = (value: any) => {
    alert(value.url);
    data = value.url;
    if (router?.isFallback) {
      <h1>Data is loading</h1>;
    } else {
      router.push({
        pathname: "my-app",
        query: { data }
      });
    }
  };
  const handleInputChange = (event: any) => {
    setData(event.target.value);
  };
  return (
    <div
      className="d-flex flex-column justify-content-center align-center"
      style={{ height: "100vh" }}
    >
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{ url: "" }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="url">
              <Form.Label>Địa chỉ URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={values.url}
                onChange={handleChange}
                isInvalid={!!errors.url}
              />
              <Form.Control.Feedback type="invalid">
                {errors.url}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
