'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import House from './house';

const roomSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
  },
  floor: {
    type: Number,
    required: true,
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'house',
  },
});

function roomPreHook(done) {
  return House.findById(this.house) 
    .then((houseFound) => {
      if (!houseFound) {
        throw new HttpError(404, 'house not found');
      }
      houseFound.rooms.push(this._id);
      return houseFound.save();
    })
    .then(() => done())
    .catch(done);
}

const roomPostHook = (document, done) => {
  return House.findById(document.house)
    .then((houseFound) => {
      if (!houseFound) {
        throw new HttpError(500, 'house not found');
      }
      houseFound.rooms = houseFound.rooms.filter((room) => {
        return room._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

roomSchema.pre('save', roomPreHook);
roomSchema.post('remove', roomPostHook);

export default mongoose.Schema('room', roomSchema);
