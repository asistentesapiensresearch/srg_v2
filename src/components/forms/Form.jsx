import { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Preloader from './Preloader';

const FormBuilder = ({
  schema,
  onSubmit,
  loading = false,
  submitButton = null,       // 👈 Componente custom opcional
  submitButtonProps = {},    // 👈 Props para el botón por defecto
  submitButtonText = "Enviar",
  inputClassContainer = undefined,
  children,
}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const initial = {};
    Object.keys(schema).forEach((key) => {
      // si el schema trae value, úsalo; si no, conserva el existente
      initial[key] = schema[key].value ?? values[key] ?? "";
    });
    setValues(initial);
  }, [schema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (schema[name]?.validation) {
      const result = schema[name].validation(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result === true ? '' : result
      }));
    }

    if (touched[name] && schema[name]?.validation) {
      const result = schema[name].validation(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result === true ? '' : result
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {};

    for (const field in schema) {
      if (schema[field].required && !values[field]) {
        newErrors[field] = 'Campo requerido';
        isValid = false;
      } else if (schema[field].validation) {
        const result = schema[field].validation(values[field] || '');
        if (result !== true) {
          newErrors[field] = result;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);

    if (isValid) {
      onSubmit(values);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (schema[name]?.validation) {
      const result = schema[name].validation(value);
      setErrors((prev) => ({
        ...prev,
        [name]: result === true ? '' : result
      }));
    } else if (schema[name]?.required && !value) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Campo requerido'
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(schema).map((key) => {
        const field = schema[key];
        if (field.type == 'select') {
          return (
            <Select
              key={key}
              name={key}
              value={values[key] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors[key]}
              {...field}
            />
          )
        } else {
          return (
            <Input
              key={key}
              name={key}
              value={values[key] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors[key]}
              inputClassContainer={inputClassContainer}
              {...field}
            />
          );
        }
      })}

      {children}

      {submitButton ? (submitButton) : (
        <Button {...submitButtonProps}>
          {loading ? <Preloader /> : submitButtonText}
        </Button>
      )}
    </form>
  );
};

export default FormBuilder;
