"use client"

import { useRouter } from "next/navigation"

interface Props {
  title: string
  buttonText: string
  stats: string[]
  route: string
}

export default function OperationCard({ title, buttonText, stats, route }: Props) {

  const router = useRouter()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <button
        onClick={() => router.push(route)}
        className="bg-green-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700"
      >
        {buttonText}
      </button>

      <div className="text-sm text-gray-500 space-y-1">
        {stats.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>

    </div>
  )
}