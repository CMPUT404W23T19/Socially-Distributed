/**
 * A submit button component
 */
const Button = ({ name }) => {
    return (
      <div className="flex items-center justify-between">
        <button
          className="bg-secondary hover:bg-blue bg-gray-300 text-white font-bold mt-8 w-full mb-4 py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          style={{ margin: 'auto', marginTop: '10px' }}
        >
          {name}
        </button>
      </div>
    )
  }
  export default Button