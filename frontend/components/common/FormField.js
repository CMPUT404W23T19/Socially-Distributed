/**
 * Input component
 */
const FormField = ({ type, name, action, placeholder }) => {
    return (
      <input
        type={type}
        className="block border border-grey-light w-full p-2 rounded mb-0 mt-2"
        name={name}
        onChange={action}
        placeholder={placeholder}
      />
    )
  }
  export default FormField