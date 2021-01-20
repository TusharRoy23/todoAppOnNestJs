export interface TodoPayload {
    id?: number
    title: string
    description: string
    createdDate: Date
    updatedDate: Date
    userId?: number
}