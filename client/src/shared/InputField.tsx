import { useField, FieldHookConfig } from 'formik';
import cn from 'classnames';

type InputFieldProps = FieldHookConfig<string> & {
  labelText?: string;
  helperText?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  labelText,
  helperText,
  ...props
}) => {
  const [field, { touched, error }] = useField(props);
  return (
    <div className='mb-6'>
      <label htmlFor={field.name} className='block font-medium'>
        {labelText}
      </label>
      <p className='mb-2 text-xs text-gray-500'>{helperText}</p>
      <input
        id={field.name}
        type={type}
        {...field}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : ''}
        className={cn(
          'w-full p-2 border border-gray-300 rounded outline-none focus:bg-white hover:bg-white bg-gray-50',
          { 'border-red-500': error }
        )}
      />
      <small className={cn({ 'text-red-600 font-medium': error })}>
        {error && touched ? error : ''}
      </small>
    </div>
  );
};

export default InputField;
