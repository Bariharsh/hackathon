import { create } from "zustand"
import { DashboardData } from "@/types/dashboard.types"

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  fetchDashboard: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({

  data: null,
  loading: false,

  fetchDashboard: async () => {

    set({ loading: true })

    // mock backend response
    const data: DashboardData = {
      receipts: {
        toReceive: 4,
        late: 1,
        operations: 6
      },
      deliveries: {
        toReceive: 4,
        late: 2,
        operations: 6
      }
    }

    // simulate API delay
    await new Promise((res) => setTimeout(res, 500))

    set({
      data,
      loading: false
    })
  }

}))