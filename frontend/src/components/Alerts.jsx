
const Alert = ( { type, message }) => {
    if (!type || !message) return null;

    const alertStyles = {
        success: 'bg-gray-800 border-yellow-400 text-yellow-400',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    }
    return (
        <div className={`border-l-4 p-4 mb-4 rounded-lg ${alertStyles[type]}`} role="alert">
            <p>{message}</p>
        </div>
    )
}

export default Alert;