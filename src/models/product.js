const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  sku: {
    type: String,
    required: [true, "Por favor, registra el código del producto."],
    trim: true,
    unique: true,
    uppercase: true,
  },
  title: {
    type: String,
    required: [true, "Por favor, registra el título del producto."],
    trim: true,
    maxLength: [
      120,
      "El título del producto no debe exceder los 120 caracteres.",
    ],
  },
  subtitle: {
    type: String,
    required: [true, "Por favor, registra el subtítulo del producto."],
    trim: true,
    maxLength: [
      120,
      "El subtítulo del producto no debe exceder los 120 caracteres.",
    ],
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Por favor, selecciona la categoria del producto."],
    enum: {
      values: [
        "Leche y yogures",
        "Postres y helados",
        "Quesos frescos",
        "Quesos semi-maduros",
        "Quesos maduros",
      ],
    },
  },
  description: {
    type: String,
    required: [true, "Por favor, registra una descripcion para el producto."],
  },
  ingredients: {
    type: String,
    required: [true, "Por favor, registra los ingredientes del producto."],
  },
  price: {
    type: Number,
    required: [true, "Por favor, registra el precio del producto."],
    maxLength: [
      8,
      "El precio del producto no puede estar por encima de 99'999.999",
    ],
    default: 0.0,
  },
  inventory: {
    type: Number,
    required: [true, "Por favor, registra el inventario del producto"],
    maxLength: [5, "Cantidad maxima del producto no puede sobrepasar 99999"],
    default: 0,
  },
  seller: {
    type: String,
    required: [true, "Por favor, selecciona el vendedor del producto."],
    enum: {
      values: ["Daniela"],
    },
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  hasTaxes: {
    type: String,
    required: [true, "Por favor, selecciona si el producto tiene impuestos."],
    enum: {
      values: ["Si", "No"],
    },
  },
  hasDiscount: {
    type: String,
    required: [true, "Por favor, selecciona si el producto tiene descuento."],
    enum: {
      values: ["Si", "No"],
    },
  },
  timeLeft: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  qualifications: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      clientName: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      commentary: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
