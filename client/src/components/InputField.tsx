import { useField, FieldHookConfig } from 'formik';
import cn from 'classnames';

type InputFieldProps = FieldHookConfig<string> & {};

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  ...props
}) => {
  const [field, { touched, error }] = useField(props);
  return (
    <div className='mb-3'>
      <input
        type={type}
        {...field}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : ''}
        className={cn(
          'w-full p-3 border border-gray-300 rounded outline-none focus:bg-white hover:bg-white bg-gray-50',
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
