import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  deadline: { type: Date, required: true },
  
  assignedUsers: [ // Track each user's activity
    {
      email: { type: String, required: true },
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
        default: 'Pending'
      },
      seen: { type: Boolean, default: false },
      seenAt: { type: Date },
      completedAt: { type: Date },
      submission: { type: String } // ✅ add this field
    }
  ],

  category: { type: String, required: true },
  description: { type: String, required: true },

  queries: [
    {
      id: { type: String, required: true },
      user: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


// ✅ Middleware to mark users as "Failed" if deadline passed
taskSchema.pre('save', function(next) {
  const now = new Date();

  this.assignedUsers = this.assignedUsers.map(user => {
    if (user.status !== 'Completed' && now > this.deadline) {
      return { ...user, status: 'Failed' };
    }
    return user;
  });

  next();
});

export default mongoose.model('Task', taskSchema);