const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');
const Profile = require('../../models/profile');
const User = require('../../models/User');
const Post = require('../../models/post');


//@route      GET api/profile/me
//@desc       get current users profile
//@access     Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }

});


//@route      POST api/profile
//@desc       Create or update a user profile-
//@access     private

router.post('/', [auth,
  [
    check('status', 'status is required.').not().isEmpty(),
    check('skills', 'skills is required.').not().isEmpty(),
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructure the request
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    ...rest
  } = req.body;

  //build profile object

  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (skills) {
    profileFields.skills = skills
  }
  if (githubusername) profileFields.githubusername = githubusername;
  //build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);

    }
    //create
    profile = new Profile(profileFields);  // in Profile model structure add to our     profile file

    await profile.save();
    res.json(profile);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route      GET api/profile
//@desc       Get all profiles
//@access     Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route      GET api/profile/user/user_ID
//@desc       Get profile by user ID
//@access     Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route      DELETE api/profile
//@desc       delete profile , user & posts
//@access     Private

router.delete('/', auth, async (req, res) => {
  try {
    // remove user posts
    await Post.deleteMany({ user: req.user.id });
    //Remove profiles
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});



//@route      PUT api/profile/experience
//@desc       put experience
//@access     private

router.put('/experience', [auth,
  [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company is required.').not().isEmpty(),
    check('from', 'From is required.').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.error("error", error.message);
    res.status(500).send('Server Error');
  }

});


//@route      DELETE api/profile/experience/:exp_id
//@desc       delete experience
//@access     Private

router.delete('/experience/:exp_id', auth, async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf
      (req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("delete", error.message);
    res.status(500).send('Server Error');
  }
});


//@route      PUT api/profile/education
//@desc       put education
//@access     private

router.put('/education', [auth,
  [
    check('school', 'School is required.').not().isEmpty(),
    check('degree', 'Degree is required.').not().isEmpty(),
    check('fieldofstudy', 'Fieldofstudy is required.').not().isEmpty(),
    check('from', 'From is required.').not().isEmpty(),


  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.error("error", error.message);
    res.status(500).send('Server Error');
  }

});

//@route      DELETE api/profile/education/:edu_id
//@desc       delete experience
//@access     Private

router.delete('/education/:edu_id', auth, async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf
      (req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("delete", error.message);
    res.status(500).send('Server Error');
  }
});

//@route       GET api/profile/github/:username
//@desc       Get user repos from github
//@access     Public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `http://api.github.com/users/${req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'githubclientId'
        )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;