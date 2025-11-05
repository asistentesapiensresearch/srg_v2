import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
    type = 'text',
    options = [],
    variant = 'default',
    size = 'md',
    placeholder = '',
    label = '',
    helperText = '',
    errorMessage = '',
    icon = null,
    iconPosition = 'left',
    showPasswordToggle = false,
    disabled = false,
    required = false,
    value,
    onChange,
    onFocus,
    onBlur,
    className = '',
    inputClassName = '',
    currency = '',
    maxLength,
    min,
    max,
    step,
    name,
    id,
    autoComplete,
    autoFocus,
    readOnly,
    inputClassContainer,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    // Determinar si hay error
    const hasError = Boolean(errorMessage);
    const currentVariant = hasError ? 'error' : (isFocused ? 'active' : variant);

    // Estilos base del contenedor
    const containerBaseStyles = 'relative flex flex-col w-full';

    // Estilos base del input usando variables CSS personalizadas
    const inputBaseStyles = `
    rounded-lg border transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:cursor-not-allowed disabled:opacity-60
    placeholder:text-[var(--color-text-tertiary)]
    bg-[var(--color-bg-input)] text-[var(--color-text-primary)]
  `;

    // Variantes de estilo usando el sistema de tokens CSS
    const variantStyles = {
        default: `
      border-[var(--color-border-default)]
      hover:border-[var(--color-border-strong)]
      focus:border-[var(--color-primary)] focus:ring-[var(--color-focus-ring)]/20
    `,
        active: `
      border-[var(--color-primary)]
      ring-2 ring-[var(--color-focus-ring)]/20
    `,
        error: `
      border-[var(--color-danger)]
      ring-1 ring-[var(--color-danger)]/20
      focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20
    `,
        disabled: `
      bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border-default)]
      cursor-not-allowed
    `,
        success: `
      border-[var(--color-success)]
      ring-1 ring-[var(--color-success)]/20
      focus:border-[var(--color-success)] focus:ring-[var(--color-success)]/20
    `
    };

    // Tamaños
    const sizeStyles = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg'
    };

    // Estilos para iconos
    const iconStyles = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    // Padding cuando hay iconos
    const paddingWithIcon = {
        left: {
            sm: 'pl-10',
            md: 'pl-12',
            lg: 'pl-14'
        },
        right: {
            sm: 'pr-10',
            md: 'pr-12',
            lg: 'pr-14'
        }
    };

    // Manejar cambios en el valor
    const handleChange = (e) => {
        let newValue = e.target.value;

        // Formateo especial para precios
        if (type === 'price') {
            // Remover caracteres no numéricos excepto punto decimal
            newValue = newValue.replace(/[^0-9.]/g, '');
            // Asegurar solo un punto decimal
            const parts = newValue.split('.');
            if (parts.length > 2) {
                newValue = parts[0] + '.' + parts.slice(1).join('');
            }
            // Limitar decimales a 2
            if (parts[1] && parts[1].length > 2) {
                newValue = parts[0] + '.' + parts[1].substring(0, 2);
            }
        }

        // Formateo para números
        if (type === 'number') {
            newValue = newValue.replace(/[^0-9.-]/g, '');
        }

        // Actualizar valor interno si no es controlado
        if (value === undefined) {
            setInternalValue(newValue);
        }

        // Llamar al onChange externo
        if (onChange) {
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    name: name || e.target.name,
                    value: newValue
                }
            };
            onChange(syntheticEvent);
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Determinar el tipo de input actual
    const currentType = () => {
        if (type === 'password' && showPasswordToggle) {
            return showPassword ? 'text' : 'password';
        }
        if (type === 'price') return 'text';
        return type;
    };

    const renderInput = (opt, radio = false) => {
        let styles = {
            paddingLeft: type === 'price' && currency ? `${currency.length * 0.6 + 1}rem` : undefined
        };
        if(radio){
            styles = {
                ...styles,
                width: '19px',
                height: '19px'
            }
        }

        return (
            <input
                ref={ref}
                id={opt.label}
                name={name}
                type={currentType()}
                value={opt.value || displayValue()}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                readOnly={readOnly}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                min={min}
                max={max}
                step={step}
                className={`${inputClasses} ${!radio && 'w-full'}`}
                style={styles}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                {...props}
            />
        )
    }

    // Clases finales del input
    const inputClasses = `
    ${inputBaseStyles}
    ${variantStyles[disabled ? 'disabled' : currentVariant]}
    ${sizeStyles[size]}
    ${icon && iconPosition === 'left' ? paddingWithIcon.left[size] : ''}
    ${(icon && iconPosition === 'right') || (type === 'password' && showPasswordToggle) ? paddingWithIcon.right[size] : ''}
    ${inputClassName}
  `.trim().replace(/\s+/g, ' ');

    // Valor mostrado - usar valor controlado o interno
    const displayValue = () => {
        if (value !== undefined) return value;
        return internalValue;
    };

    // Actualizar valor interno cuando cambia el valor externo
    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    delete props['validation'];

    return (
        <div className={`${containerBaseStyles} ${className}`}>
            {/* Label */}
            {label && type !== 'radio' && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary  mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className={`relative ${inputClassContainer}`}>
                {/* Icono izquierdo */}
                {icon && iconPosition === 'left' && (
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconStyles[size]} pointer-events-none`}>
                        {icon}
                    </div>
                )}

                {/* Símbolo de moneda para precios */}
                {type === 'price' && currency && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium pointer-events-none">
                        {currency}
                    </div>
                )}

                {type == 'radio' && (
                    options.map((opt) => (
                        <div className='flex justify-between border-b border-solid px-2 items-center border-gray-200' key={opt.value}>
                            <label htmlFor={opt.value} className='w-full cursor-pointer py-2'>{opt.label}</label>
                            {renderInput(opt, true)}
                        </div>
                    ))
                )}

                {/* Input */}
                {(type !== 'radio') && renderInput({ label: id })}

                {/* Icono derecho */}
                {icon && iconPosition === 'right' && !showPasswordToggle && (
                    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconStyles[size]} pointer-events-none`}>
                        {icon}
                    </div>
                )}

                {/* Toggle de contraseña */}
                {type === 'password' && showPasswordToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? (
                            <svg className={iconStyles[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className={iconStyles[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Helper Text */}
            {helperText && !hasError && (
                <p id={`${id}-helper`} className="mt-2 text-sm text-gray-500">
                    {helperText}
                </p>
            )}

            {/* Error Message */}
            {hasError && (
                <p id={`${id}-error`} className="mt-2 text-[12px] text-red-600 flex items-center gap-1" role="alert">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'price']),
    variant: PropTypes.oneOf(['default', 'active', 'error', 'disabled', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    helperText: PropTypes.string,
    errorMessage: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    showPasswordToggle: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    currency: PropTypes.string,
    maxLength: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    id: PropTypes.string,
    autoComplete: PropTypes.string
};

export default Input;