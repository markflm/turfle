import { CategoryStatus } from '../types/Answer'

export type PositionToolTipProps = {
    status: CategoryStatus
    side: string
}

export default function PositionTooltip(props: PositionToolTipProps) {
    const { status, side } = props

    const tiptext = () => {
        if (status == 'correct') {
            return (
                <div>
                    Player of the day plays at the
                    <span className="font-bold"> same position</span>
                </div>
            )
        } else if (status == 'close') {
            return (
                <div>
                    Player of the day plays a <span>different </span> position
                    also on
                    <span className="font-bold"> {side}</span>
                </div>
            )
        } else if (status == 'miss') {
            return (
                <div>
                    Player of the day does not play on
                    <span className="font-bold"> {side}</span>
                </div>
            )
        }
    }

    return <div className="rubik-font-tooltip text-lg">{tiptext()}</div>
}
