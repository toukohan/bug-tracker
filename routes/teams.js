const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");
const { Team, Member } = require("../models/Team");
 

const { checkAuthenticated } = require("../middleware/auth");
const pjson = require("../package.json");

// routes for teams

router.get("/", checkAuthenticated(), async (req, res) =>{
   try {
       const teams = await Team.find({$in: req.user.teams});
       res.render("teams", {user: req.user, teams});
   } 
   catch (err) {
        console.error(err);
        res.redirect("/dashboard");
   }  
});

router.post("/create", checkAuthenticated(), async (req, res) => {
const {name: teamName} = req.body;
const {name, email } = req.user;
try {
    const newMember = await new Member({
        name,
        email,
        email_verified: true,
        role: "admin",
        projects: [],
    
    });
    console.log(newMember);
    const newTeam = await new Team({
        name: teamName,
        members: [newMember],
        admins: [newMember],
        projects: [teamName],
    });
    console.log(newTeam);
    await newMember.save();
    await newTeam.save();
    await User.findByIdAndUpdate(req.user.id, {$push: {teams: teamName}});
}
catch(err) {
    console.error(err);
    res.redirect("/teams")
}
});

router.post("/add-member", checkAuthenticated(), async (req, res) => {
    const { team, email, role } = req.body;

    try {
        const user = await User.findOne({email: email});
        console.log(user);
        const newMember = new Member({name: user.name, email: user.email, email_verified: false, role: role, projects: [team] });
        await Team.findOneAndUpdate({name: team}, {$push: {members: newMember}});
        console.log("member added to team:", newMember);
        console.log(await Team.findOne({name: team}));
        res.redirect("/teams");

            
    } catch(err) {
        console.error(err);
        res.redirect("/teams");
    }
});

module.exports = router;