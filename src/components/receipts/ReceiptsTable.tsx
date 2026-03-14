import { Receipt } from "@/types/receipts.types"

interface Props {
  receipts: Receipt[]
}

export default function ReceiptsTable({ receipts }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">Reference</th>
            <th className="text-left px-4 py-3">From</th>
            <th className="text-left px-4 py-3">To</th>
            <th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Schedule Date</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {receipts.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">

              <td className="px-4 py-3 font-medium">{r.reference}</td>
              <td className="px-4 py-3">{r.from}</td>
              <td className="px-4 py-3">{r.to}</td>
              <td className="px-4 py-3">{r.contact}</td>
              <td className="px-4 py-3">{r.scheduleDate}</td>

              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  {r.status}
                </span>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}