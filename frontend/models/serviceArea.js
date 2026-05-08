import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      index: true
    },

    courier: {
      type: String, // BlueDart, DTDC
      required: true
    },

    isServiceable: {
      type: Boolean,
      default: true
    },

    estimatedDeliveryDays: {
      type: Number,
      default: 5
    }
  },
  { timestamps: true }
);

const ServiceArea =
  mongoose.models.ServiceArea ||
  mongoose.model("ServiceArea", serviceAreaSchema);

export default ServiceArea;
