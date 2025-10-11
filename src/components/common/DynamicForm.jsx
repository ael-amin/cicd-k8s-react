import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const DynamicForm = ({ config, onSubmit, initialValues = {}, submitLabel = 'Submit' }) => {
  const [formData, setFormData] = React.useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name] || '',
      onChange: handleChange,
      required: field.required,
      ...field.props
    };

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <select
              {...commonProps}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <textarea
              {...commonProps}
              rows={field.rows || 4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
            />
          </div>
        );

      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            {...commonProps}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {config.fields.map(renderField)}
      <Button type="submit" fullWidth>{submitLabel}</Button>
    </form>
  );
};

export default DynamicForm;