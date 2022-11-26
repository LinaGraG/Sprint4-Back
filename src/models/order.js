const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shipmentInfo: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Colombia",
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "auth",
  },
  items: [
    {
      title: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
  },
  paymentDate: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxesPrice: {
    type: Number,
    required: true,
    defautl: 0.0,
  },
  shipmentPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shipmentStatus: {
    type: String,
    required: true,
    default: "Procesando",
  },
  shipmentDate: {
    type: Date,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema);
