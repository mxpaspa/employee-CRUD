const express = require('express');
const router = express.Router();
// const employeeController = require('../controllers/employee-controller');
const { check, validationResult } = require('express-validator');
const Employee = require('../model');
const axios = require('axios');

router.get('/employees/:id', (req, res) => {
  id = req.params.id;
  Employee.findById(id)
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      res.status(422).send(err + ' Could not find that employee');
    });
});

router.get('/employees', (req, res) => {
  Employee.find({})
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      res.status(422).send(err + ' Could not find that employee');
    });
});

router.post(
  '/employees',
  [
    check('firstName')
      .not()
      .isEmpty()
      .isAlpha()
      .withMessage('Please provide a first name'),
    check('lastName')
      .not()
      .isEmpty()
      .isAlpha()
      .withMessage('Please provide a last name'),
    //TODO: hire date must be in the past
    check('hireDate')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('date must be in the format: YYYY-MM-DD')
      .custom(date => {
        let hired = new Date(date);
        var now = new Date();
        if (hired < now) {
          return hired;
        } else {
          throw new Error('hired date must be in the past');
        }
      }),

    check('role').custom(role => {
      const valid = ['CEO', 'VP', 'MANAGER', 'LACKEY'];
      if (!valid.includes(role)) {
        throw new Error('please provide a valid role');
      } else {
        return role;
      }
    })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hireDate = req.body.hireDate;
    const role = req.body.role;

    async function getSwansonQuote() {
      try {
        let swansonQuote = await axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes');
        return swansonQuote.data[0];
      } catch (error) {
        console.error(error);
      }
    }

    async function getSecondJoke() {
      try {
        let response = await axios.get('https://icanhazdadjoke.com/', {
          headers: { accept: 'application/json' }
        });

        return response.data.joke;
      } catch (error) {
        console.log(error);
      }
    }

    //TODO: make sure there are no unintented consequences with using an IFEE
    (async function createEmployee() {
      const newEmployee = new Employee({
        firstName: firstName,
        lastName: lastName,
        hireDate: new Date(hireDate),
        role: role,
        favJoke: await getSwansonQuote(),
        favJoke2: await getSecondJoke()
      });
      return newEmployee.save();
    })()
      .then(employee => {
        res.send(employee);
      })
      .catch(err => {
        return next(err);
      });
  }
);

router.put('/employees/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;
  //TODO: validate the body
  Employee.findOneAndUpdate({ _id: id }, body, { new: true })
    .then(doc => {
      res.send(doc);
    })
    .catch(function(err) {
      res.status(404).send(err);
    });
});

router.delete('/employees/:id', (req, res) => {
  let id = req.params.id;

  Employee.findByIdAndRemove(id)
    .then(employee => {
      res.send(employee);
    })
    .catch(err => res.status(404).send(err));
});

module.exports = router;
