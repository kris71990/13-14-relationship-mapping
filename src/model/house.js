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
  built: {
    type: Number,
    required: true,
  },
  worth: {
    type: Number,
    default: null,
  },
}); 

export default mongoose.model('house', houseSchema);
