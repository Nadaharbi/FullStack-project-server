import mongoose from 'mongoose';

const ServiceSchema = mongoose.Schema({
  mobileNumber: { type: String, required: true },
  stationName: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
});

const ServiceModel = mongoose.model("Services", ServiceSchema, "Services");

export default ServiceModel;
