import create from "zustand/react"
import { Team } from "type"
import { fetchTeams } from "services/api"

const useTeamStore = create((set) => ({
  teamOptions: [],
  fetch: async () => {
    const res = await fetchTeams()
    console.log(res)
    set({ teamOptions: formatTeamOptions(res) })
  }
}))

function formatTeamOptions(teams: Array<Team>) {
  return teams.map((team) => ({
    title: team.Name,
    value: team.ID
  }))
}

export default useTeamStore
