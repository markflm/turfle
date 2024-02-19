export type Categories = 'team' | 'age' | 'position'
export type CategoryStatus =
    | 'correct'
    | 'over' //age
    | 'under' //age
    | 'very close' //team: very close = same conference, same division
    | 'close' //team: close = same conference. position: close = same side of the ball
    | 'miss' //team: miss = different conference

export type Answer = {
    value: string
    category: Categories
    status: CategoryStatus
}
