import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import "../App.css";

// Function to dynamically generate Yup schema based on field types
const generateSchema = (fields) => {
  const shape = {};

  fields.forEach((field, index) => {
    shape[`dynamicFields.${index}.value`] = yup.lazy((value) => {
      switch (field.type) {
        case 'text':
          return yup.string().required(`${field.label} is required`);
        case 'number':
          return yup.number().required(`${field.label} is required`).typeError(`${field.label} must be a number`);
        case 'select':
          return yup.string().required(`Please select a ${field.label}`);
        case 'radio':
          return yup.string().required(`You must select a ${field.label}`);
        case 'checkbox':
          return yup.array().min(1, `Please select at least one option for ${field.label}`);
        case 'file':
          return yup.mixed().required(`Please upload a ${field.label}`);
        default:
          return yup.mixed();
      }
    });
  });

  return yup.object().shape(shape);
};

const FormDisplay = () => {
  const [formData, setFormData] = useState([]);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(generateSchema(formData)), // Dynamically generated schema
    defaultValues: {
      dynamicFields: [], // Default values for dynamic fields
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/formData');
        const dynamicFieldsData = response.data.dynamicFields;
        setFormData(dynamicFieldsData);

        // Set default values for dynamic fields
        dynamicFieldsData.forEach((field, index) => {
          setValue(`dynamicFields.${index}.value`, '');
        });
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = (data) => {
    console.log('Form Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid-container">
      {formData.map((field, index) => (
        <div key={index} className="grid-item">
          <label>{field.label}</label>
          <Controller
            name={`dynamicFields.${index}.value`} // Dynamic name for each field
            control={control}
            render={({ field: inputField }) => {
              switch (field.type) {
                case 'text':
                  return <input type="text" {...inputField} />;
                case 'number':
                  return <input type="number" {...inputField} />;
                case 'select':
                  return (
                    <select {...inputField}>
                      <option value="">Select an option</option>
                      {field.options && field.options.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );
                case 'radio':
                  return field.options && field.options.map((option, i) => (
                    <div key={i}>
                      <input type="radio" value={option} {...inputField} /> {option}
                    </div>
                  ));
                case 'checkbox':
                  return field.options && field.options.map((option, i) => (
                    <div key={i}>
                      <input type="checkbox" value={option} {...inputField} /> {option}
                    </div>
                  ));
                case 'file':
                  return <input type="file" {...inputField} />;
                default:
                  return null;
              }
            }}
          />
          {errors.dynamicFields?.[index]?.value && (
            <p className="error-message">{errors.dynamicFields[index]?.value?.message}</p>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormDisplay;
