import mongoose from "mongoose"

const CardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  lastReviewed: {
    type: Date,
    default: null,
  },
  nextReview: {
    type: Date,
    default: Date.now,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
    },
  ],
})

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cards: [CardSchema],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      permission: {
        type: String,
        enum: ["view", "edit"],
        default: "view",
      },
    },
  ],
  stats: {
    totalViews: {
      type: Number,
      default: 0,
    },
    totalStudySessions: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

DeckSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export const Deck = mongoose.models.Deck || mongoose.model("Deck", DeckSchema)
