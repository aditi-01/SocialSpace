const express = require('express');
const config =require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {check, validationResult} = require('express-validator');
//@route GET api/profile/me
//@desc Get current user's profile
//@access Private
router.get('/me',auth, async(req,res) => {
    try{
        const profile = await Profile.findOne({user : req.user.id}).populate('user',[
            'name','avatar'
        ]);
        if(!profile){
            return res.status(400).json({msg: 'There is no  profile for this user'});
        }
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');

    }

});
//@route POST api/profile
//@desc Create or update users profile 
//@access Private
router.post('/',auth,check('status','status is required').notEmpty(),check('skills','Skills is required').notEmpty(),async(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill=>skill.trim());
    }
    
    //build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    
    try{
        let profile = await Profile.findOne({user:req.user.id});
        //update a profile
        if(profile){ await Profile.findOneAndUpdate(
            {
                user:req.user.id
            },
            {
                $set: profileFields
            },
            {
                new: true
            }
        );
        return res.json(profile);

       }
        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');

    }

});
//@route GET api/profile
//@desc get all profiles
//@access Public
router.get('/',async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles); 
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
    


});
//@route GET api/profile/user/:user_id
//@desc get profile by user ID
//@access Public
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'There is no profile for this user'});
        res.json(profile); 
        
    } catch (err) {
        console.error(err.message);
        if(err.kind=='ObjectId'){return res.status(400).json({msg:'Profile not found'});}
        res.status(500).send('Server Error');
        
    }
});
//@route DELETE api/profile/
//@desc delete profile,user,post
//@access private
router.delete('/',auth,async(req,res)=>{
    try {
        //remove users posts
        await Post.deleteMany({user:req.user.id});
        //Remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove User
        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User Removed'}); 
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
    


});
//@route PUT api/profile/experience
//@desc add profile experience
//@access private
router.put('/experience',[auth,[
    check('title','title is required').notEmpty(),
    check('company','company is required').notEmpty(),
    check('from','from date is required').notEmpty(),
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }= req.body;
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
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
    


});
//@route DELETE api/profile/experience/:exp_id
//@desc delete experience from profile
//@access private
router.delete('/experience/:exp_id',auth,async(req,res)=>{
try {
    const profile = await Profile.findOne({user:req.user.id});
    //Get Remove index
    const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
} catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
    
}
});

//@route PUT api/profile/education
//@desc add profile education
//@access private
router.put('/education',[auth,[
    check('school','School is required').notEmpty(),
    check('degree','Degree is required').notEmpty(),
    check('fieldofstudy','Field of study is required').notEmpty(),
    check('from','from date is required').notEmpty(),
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }= req.body;
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
    


});
//@route DELETE api/profile/education/:edu_id
//@desc delete education from profile
//@access private
router.delete('/education/:edu_id',auth,async(req,res)=>{
try {
    const profile = await Profile.findOne({user:req.user.id});
    //Get Remove index
    const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
} catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
    
}
});
module.exports = router;