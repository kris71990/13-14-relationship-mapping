'use strict';

import mongoose from 'mongoose';

const carSchema = mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
}); 

export default mongoose.model('car', carSchema);
