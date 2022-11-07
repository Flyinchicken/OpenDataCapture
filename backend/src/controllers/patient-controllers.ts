import type { RequestHandler } from 'express';

import HttpError from '../models/HttpError';
import Patient from '../models/Patient';

const dummyPatients = [
  new Patient('John', 'Smith', new Date(1950, 11, 1), 'Male'),
  new Patient('Jane', 'Doe', new Date(1965, 7, 14), 'Female')
];

export const getAllPatients: RequestHandler = (req, res) => {
  console.log('GET request');
  res.json(dummyPatients);
};

export const getPatientById: RequestHandler = (req, res, next) => {
  console.log('GET request');
  const patientId = req.params.id;
  console.log(patientId);
  const patient = dummyPatients.find(element => element.id === parseInt(patientId));
  if (!patient) {
    return next(new HttpError(404, `Could not find patient with id ${patientId}`));
  }
  return res.status(200).json(patient);
};

export const addNewPatient: RequestHandler = ((req, res) => {
  const { firstName, lastName, dateOfBirth, sex } = req.body;
  const patient = new Patient(firstName, lastName, dateOfBirth, sex);
  dummyPatients.push(patient);
  return res.status(201).json({
    patient: patient
  });
});