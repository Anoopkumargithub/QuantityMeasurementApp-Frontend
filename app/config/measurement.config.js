app.constant("MEASUREMENT_CONFIG", {
  measurementTypes: [
    "Length",
    "Weight",
    "Volume",
    "Temperature"
  ],

  operations: [
    { label: "Equality", value: "compare" },
    { label: "Conversion", value: "convert" },
    { label: "Addition", value: "add" },
    { label: "Addition with Target Unit", value: "addWithTarget" },
    { label: "Subtraction", value: "subtract" },
    { label: "Division", value: "divide" }
  ],

  units: {
    Length: [
      "Feet",
      "Inches",
      "Yards",
      "Centimeters"
    ],
    Weight: [
      "Gram",
      "Kilogram",
      "Pound",
      "Tonne"
    ],
    Volume: [
      "Litre",
      "Millilitre",
      "Gallon"
    ],
    Temperature: [
      "Celsius",
      "Fahrenheit",
      "Kelvin"
    ]
  }
});