export default function Alert({ message, type }) {
	return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
		<div>
			<p className="font-bold">Error</p>
			<p className="text-sm">{message}</p>
		</div>
	</div>
}