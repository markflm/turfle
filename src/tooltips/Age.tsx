import { CategoryStatus } from '../types/Answer'

export type AgeToolTipProps = {
    status: CategoryStatus
}

export default function AgeTooltip(props: AgeToolTipProps) {
    const { status } = props

    const tiptext = () => {
        if (status == 'correct') {
            return (
                <div>
                    Player of the day is the
                    <span className="font-bold"> same age</span>
                </div>
            )
        } else if (status == 'over') {
            return (
                <div>
                    Player of the day is
                    <span className="font-bold"> younger</span>
                </div>
            )
        } else if (status == 'under') {
            return (
                <div>
                    Player of the day is
                    <span className="font-bold"> older</span>
                </div>
            )
        }
    }

    return <div className="rubik-font-tooltip text-lg">{tiptext()}</div>
}
