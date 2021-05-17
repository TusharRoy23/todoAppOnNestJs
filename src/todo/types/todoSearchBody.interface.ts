export interface TodoSearchBody {
    id: number,
    userEmail: string,
    todo: {
        title: string,
        description: string,
        createdDate: Date,
        updatedDate: Date
    }
}