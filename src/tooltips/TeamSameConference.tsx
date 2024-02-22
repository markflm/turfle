import { CategoryStatus } from '../types/Answer'

export type TeamSameConferenceProps = {
    conferenceName: string
    divisionName: string
    status: CategoryStatus
}
export default function TeamSameConference(props: TeamSameConferenceProps) {
    const { conferenceName, divisionName, status } = props

    const tiptext = () => {
        if (status == 'correct') {
            return (
                <div>
                    Player's team is in the same conference (
                    {`${conferenceName} ${divisionName}`})
                </div>
            )
        } else return <></>
    }

    return <div className="rubik-font-tooltip text-lg">{tiptext()}</div>
}
