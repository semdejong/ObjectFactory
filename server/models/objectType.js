const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ObjectType",
    required: false,
  },
  uperReference: {
    type: String,
    required: false,
  },
  referenceField: {
    type: String,
    required: false,
  },
  multipleReference: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  metaData: new mongoose.Schema(
    {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    },
    { strict: false }
  ),
  permissions: new mongoose.Schema({
    read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    write: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    update: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    delete: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  }),
  isArchived: {
    type: Boolean,
    default: false,
  },
});

const objectTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  fields: {
    type: [fieldSchema],
  },
  metaData: new mongoose.Schema(
    {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    },
    { strict: false }
  ),
  permissions: new mongoose.Schema({
    read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    write: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    update: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    delete: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  }),
  adminOnly: {
    type: Boolean,
    default: false,
  },
  nonUser: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  ObjectType: mongoose.model("ObjectType", objectTypeSchema),
  Field: mongoose.model("Field", fieldSchema),
};
