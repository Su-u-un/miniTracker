import { DefaultOptons } from "../types"

export default class Tracker{
    public data: options
    constructor(option){

    }

    private init():DefaultOptons{
        return <DefaultOptons>{
            historyTracker:false,
            hashTracker:false,
            
        }
    }
}