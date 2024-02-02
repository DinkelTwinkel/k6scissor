const UserState = require('../models/userState');
const { safeRoleID, dangerRoleID, deadRoleID } = require('../ids.json');

module.exports = async (member) => {

    const safeRole = member.guild.roles.cache.get(safeRoleID);
    const dangerRole = member.guild.roles.cache.get(dangerRoleID);
    const deadRole = member.guild.roles.cache.get(deadRoleID);

    if (member.user.bot) return;
    if (member.user.id === member.guild.ownerId) return;


    const result = await UserState.findOne({ userID: member.user.id });

    if (result) {


        const roleArray = [];
        member.roles.cache.forEach(role => {
          roleArray.push(role.id);
        });
  
        console.log (roleArray);
  
        const elementsToRemove = [safeRoleID,dangerRoleID,deadRoleID];
  
        elementsToRemove.forEach(roleToRemove => {
          const index = roleArray.indexOf(roleToRemove)
          if (index !== -1) {
            roleArray.splice(index, 1);
          }
  
        })
        console.log (roleArray);

        if (result.currentState === 'SAFE') {
            roleArray.push(safeRole);
            member.roles.set(roleArray);
        }
        else if (result.currentState === 'DANGER') {
            roleArray.push(dangerRole);
            member.roles.set(roleArray);
        }
        else if (result.currentState === 'DEAD') {
            member.roles.set([deadRole]);
        }
        else {
        // invalid state detected.    
        }
        

    }
    else {
        const newUserDoc = new UserState ({
            userID: member.user.id,
            currentState: 'DANGER',
            lastPostTime: 0,
            streak: 0,
            postedToday: false,
        })
    await newUserDoc.save();
    member.roles.add(dangerRole);
   }

};