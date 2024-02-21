import { CategoryStatus } from '../types/Answer'

export type TeamSameConferenceProps = {
    conferenceName: string
    status: CategoryStatus
}
export default function TeamSameConference(props: TeamSameConferenceProps) {
    const { conferenceName, status } = props
    return (
        <div className="rubik-font-tooltip text-lg">
            Player's team is in the same conference J
        </div>
    )
}
