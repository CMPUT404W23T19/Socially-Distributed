/**
 * Error message component
 */
const ErrorMessage = ({ error }) => {
    return <span className="p-1 mb-4 text-xs text-[red] error-msg">{error}</span>
  }
  
  export default ErrorMessage