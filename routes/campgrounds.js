var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Some error", err);
        }
        else{
            res.render("campgrounds/index",{campgrounds : allCampgrounds});
        }
    })
});

//CREATE campground and save in database
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newCampground = {name : name, image : image, description : desc, author : author};

    //campgrounds.push(newCampground);
    //add campground to database
    Campground.create(newCampground, function(err, newEntry){
        if(err){
            console.log("Some problem", err);
        }
        else{
            //console.log(newEntry);
            res.redirect('/campgrounds');
        }
    }); 
});

//NEW campground form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//SHOW description of a particular campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundEntry){
        if(err){
            console.log("Something wrong",err);
        }
        else{
            res.render('campgrounds/show', {campground : foundEntry});
        }
    })
    // res.render('show');
});

//EDIT campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground : foundCampground});  
    });
});

//UPDATE campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;