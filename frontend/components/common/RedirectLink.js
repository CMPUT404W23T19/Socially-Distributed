/**
 * RedirectLink component
 */
const RedirectLink = ({ href, message }) => {
    return (
      <div className="flex items-center justify-between">
        <p className="text-black" style={{ margin: 'auto', marginTop: '10px', marginBottom: '10px' }}>
          {message}
        </p>
      </div>
    )
  }
  export default RedirectLink