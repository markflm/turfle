export type Categories = "team" | "age" | "position" | "conference" | "division"
export type CategoryStatus = "correct" | "over" | "under" | "close" | "miss"

export type Answer = {
category: Categories
status: CategoryStatus
}

