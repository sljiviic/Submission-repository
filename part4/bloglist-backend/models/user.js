const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    trim: true,
    lowercase: true
  },
  passwordHash: String,
  name: String
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)