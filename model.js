const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  hireDate: Date,
  role: String,
  favJoke: String,
  favJoke2: String
});

employeeSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.previousState;
  return obj;
};

let Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
