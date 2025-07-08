type Props = {
  label:string;
  name:string;
  placeholder:string;
  id?:string;
  error?:string;
  type?:'text' | 'email' | 'password' | 'date';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>)=> void;
  value?: string | number;
}

const InputLabel = ({
  label,
  name,
  placeholder,
  id,
  error,
  type,
  onChange,
  value}
  :Props) => {
  return (
    <div className="row">
      <label 
        htmlFor="email"
        className="col-form-label"
      >
        {label}
      </label>
      <div className="col-md-12">
      <input 
        type={type ?? 'text'}
        name={name}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        onChange = {onChange}
        value={value}
      />
      {
        error && <small className="text-red-500">{error}</small>
      }
      </div>
    </div>
  )
}

export default InputLabel
