const Dish = require('./../models/dishModel');
const multer = require('multer');
const sharp = require('sharp');
const factory = require('./controllerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/dishes');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `dish-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadDishImg = upload.single('image');

exports.resizeImg = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `dish-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/dishes/${req.file.filename}`);

  next();
};

//Get the menu
exports.getMenu = factory.getAll(Dish);

//Get for today dishes
exports.getForToday = catchAsync(async (req, res) => {
  const data = await Dish.find({ forToday: true });
  res.status(200).json({
    message: 'success',
    data,
  });
});

//Get one element of the menu
exports.getDish = factory.getOne(Dish, { path: 'reviews', select: 'dish' });
//Add a new element to the menu
exports.addDish = catchAsync(async (req, res) => {
  if (req.file) req.body.image = req.file.filename;
  const doc = await Dish.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

//Update an element of the menu
exports.updateDish = factory.updateOne(Dish);
//Delete a element of the menu
exports.deleteDish = factory.deleteOne(Dish);
