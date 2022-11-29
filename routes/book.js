var router = require('express').Router();

router.get('/face', (req, res)=>{
    //  res.sendFile(__dirname + '/views/face.html');
      res.render('face');
  });
  
router.get('/music', (req, res)=>{
      //res.sendFile(__dirname + '/views/music.html');
      res.render('music');
  });

router.get('/err', (req, res)=>{
    res.render('err');
});


module.exports = router;