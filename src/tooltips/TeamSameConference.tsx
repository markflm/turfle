import { CategoryStatus } from '../types/Answer'

export type TeamSameConferenceProps = {
    conferenceName: string
    divisionName: string
    status: CategoryStatus
}
export default function TeamSameConferenceTooltip(
    props: TeamSameConferenceProps
) {
    const { conferenceName, divisionName, status } = props

    const tiptext = () => {
        if (status == 'correct') {
            return (
                <div>
                    Player of the day is on the <b>same team</b> (
                    {`${conferenceName} ${divisionName}`})
                </div>
            )
        } else if (status == 'very close') {
            return (
                <div>
                    Player of the day is in the{' '}
                    <span className="font-bold">
                        same Division ({`${conferenceName} ${divisionName}`})
                    </span>
                </div>
            )
        } else if (status == 'close') {
            return (
                <div>
                    Player of the day is in the{' '}
                    <span className="font-bold">
                        same Conference ({`${conferenceName}`})
                    </span>{' '}
                    but a <span className="font-bold">different Division</span>
                </div>
            )
        } else
            return (
                <div>
                    Player of the day is <span className="font-bold">not</span>{' '}
                    in this{' '}
                    <span className="font-bold">
                        Conference ({`${conferenceName}`})
                    </span>
                </div>
            )
    }

    return <div className="rubik-font-tooltip text-lg">{tiptext()}</div>
}
