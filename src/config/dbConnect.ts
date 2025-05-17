import mongoose from "mongoose";


const dbConnectFunc = async (): Promise<mongoose.Mongoose> => { 
    try {
        return await mongoose.connect(process.env.MONGU_URL as string)
    } catch (error: any) {
    console.log("Db error: "+ error)
       throw new Error(error)
       
    }
}

export default dbConnectFunc