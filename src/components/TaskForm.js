import React, { useState } from 'react'; 
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "../App.css"


const TaskForm = () => {
  const [selectedFieldType, setSelectedFieldType] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [insertIndex, setInsertIndex] = useState(0);
  const [gridColumn, setGridColumn] = useState(1);
  const [options, setOptions] = useState(['']); 
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      dynamicFields: [],
    },
  });

  const { fields, insert, remove } = useFieldArray({
    control,
    name: 'dynamicFields',
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const dynamicFields = fields.map((field) => ({
      label: field.label,
      type: field.type,
      gridColumn: field.gridColumn,
      values: field.options,
    }));

    try {
      await axios.post('http://localhost:5000/save', { dynamicFields });
      console.log('Form Data saved:', dynamicFields);
      navigate('/FormDisplay');
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleAddField = () => {
    if (selectedFieldType && fieldLabel) {
      const newField = {
        type: selectedFieldType,
        label: fieldLabel,
        gridColumn: gridColumn,
        options: (selectedFieldType === 'select' || selectedFieldType === 'radio' || selectedFieldType === 'checkbox')
          ? options.filter((option) => option !== '') // Include only non-empty options
          : [],
      };
      insert(insertIndex, newField);
      setSelectedFieldType('');
      setFieldLabel('');
      setGridColumn(1);
      setOptions(['']); // Reset options
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container">
        <div>
          <label>Field Label</label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            placeholder="Enter label for the field"
          />
        </div>

        <div>
          <label>Field Type</label>
          <select
            value={selectedFieldType}
            onChange={(e) => setSelectedFieldType(e.target.value)}
          >
            <option value="">Select Field Type</option>
            <option value="text">Text Input</option>
            <option value="number">Number Input</option>
            <option value="select">Select Dropdown</option>
            <option value="radio">Radio Buttons</option>
            <option value="checkbox">Checkbox</option>
            <option value="file">File Upload</option>
          </select>
        </div>

        {(selectedFieldType === 'select' || selectedFieldType === 'radio' || selectedFieldType === 'checkbox') && (
          <div>
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>
        )}

        <div>
          <label>Insert at Index</label>
          <input
            type="number"
            value={insertIndex}
            onChange={(e) => setInsertIndex(Number(e.target.value))}
            min={0}
            max={fields.length}
          />
        </div>

        <div>
          <label>Grid Column (1-4)</label>
          <input
            type="number"
            value={gridColumn}
            onChange={(e) => setGridColumn(Number(e.target.value))}
            min={1}
            max={4}
          />
        </div>

        <button type="button" onClick={handleAddField}>
          Add Field
        </button>
      </div>

      <div className="form-grid">
        {fields.map((field, index) => (
          <div key={field.id} className={`field-item grid-column-${field.gridColumn}`}>
            <label>{field.label}</label>
            {field.type === 'text' && <input type="text" {...register(`dynamicFields.${index}.value`)} />}
            {field.type === 'number' && <input type="number" {...register(`dynamicFields.${index}.value`)} />}
            {field.type === 'select' && (
              <select {...register(`dynamicFields.${index}.value`)}>
                <option value="">Select an Option</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            )}
            {field.type === 'radio' && field.options.map((option, i) => (
              <div key={i}>
                <input type="radio" value={option} {...register(`dynamicFields.${index}.value`)} /> {option}
              </div>
            ))}
            {field.type === 'checkbox' && field.options.map((option, i) => (
              <div key={i}>
                <input type="checkbox" value={option} {...register(`dynamicFields.${index}.value`)} /> {option}
              </div>
            ))}
            {field.type === 'file' && <input type="file" {...register(`dynamicFields.${index}.value`)} />}
            <button type="button" onClick={() => remove(index)}>Remove Field</button>
          </div>
        ))}
      </div>

      <button type="submit">Save</button>
    </form>
  );
};

export default TaskForm;
