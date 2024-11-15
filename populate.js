import {readFile} from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/userModel.js';
import Job from './models/jobModel.js';



try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({email: 'john@gmail.com'})
    const jsonjobs = JSON.parse(
        await readFile(new URL('./utils/MOCK_DATA.json', import.meta.url))
    )
    const jobs = jsonjobs.map((job) => {
        return {...job, createdBy: user._id}
    })
    await Job.deleteMany({createdBy: user._id})
    await Job.create(jobs)
    console.log('success')
    process.exit(0)
} catch (error) {
    console.log(error);
    
    process.exit(1)
}