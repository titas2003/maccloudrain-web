export default function UpcomingAppointments() {
  return (
    <div className="bg-[#1a2b4b] rounded-xl p-6 text-white shadow-sm min-h-[220px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Upcoming Appointments</h3>
        <span className="text-xs opacity-60">Current day</span>
      </div>
      <div className="bg-white rounded-lg overflow-hidden text-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500 uppercase text-[10px] font-bold">
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src="https://i.imgur.com/8Km9tLL.png" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold">Maya Sharma</span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-600">10:00 {i === 0 ? 'AM' : 'PM'}</td>
                <td className="px-4 py-3 text-right">
                  <button className="bg-[#1a2b4b] text-white px-4 py-1.5 rounded-md text-xs font-semibold">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}