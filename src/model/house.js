'use strict';

import mongoose from 'mongoose';

const houseSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  size: {
    type: Number,
    required: true,
  },
  built: {
    type: Number,
    required: true,
  },
  worth: {
    type: Number,
    default: null,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'room',
    },
  ], 
}, { usePushEach: true });

export default mongoose.model('house', houseSchema);
