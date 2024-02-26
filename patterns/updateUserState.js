const UserState = require('../models/userState');
const { safeRoleID, dangerRoleID, deadRoleID } = require('../ids.json');
const UserData = require('../models/userData');

module.exports = async (member) => {

    const safeRole = member.guild.roles.cache.get(safeRoleID);
    const dangerRole = member.guild.roles.cache.get(dangerRoleID);
    const deadRole = member.guild.roles.cache.get(deadRoleID);

    if (member.user.bot) return;
    if (member.user.id === member.guild.ownerId) return;
    if (member.roles.cache.get('1209326206151819336')) return;


    const result = await UserState.findOne({ userID: member.user.id });
    const data = await UserData.findOne({ userID: member.user.id });

    if (result) {

        if (member.roles.cache.get('1210274450679922748')) {

            if (result.currentState === 'DANGER') {
                member.roles.add(dangerRoleID);
                member.roles.remove(safeRoleID);
                member.roles.remove(deadRoleID);
            }
    
            if (result.currentState === 'SAFE') {
                member.roles.remove(dangerRoleID);
                member.roles.add(safeRoleID);
                member.roles.remove(deadRoleID);
            }
    
            if (result.currentState === 'DEAD') {
                member.roles.remove(dangerRoleID);
                member.roles.remove(safeRoleID);
                member.roles.add(deadRoleID);
            }

            if (data.group === 0 ) {
                if (!member.roles.cache.get('1202551817708507136')) {
                    member.roles.add('1202551817708507136');
                }
    
                if (member.roles.cache.get('1202876101005803531')){
                    member.roles.remove('1202876101005803531');
                }
                
            }
            else if (data.group === 1) {
                if (!member.roles.cache.get('1202876101005803531')) {
                    member.roles.add('1202876101005803531');
                }
    
    
                if (member.roles.cache.get('1202551817708507136')){
                    member.roles.remove('1202551817708507136');
                }
            }
            return;
        }


        let roleArray = [];
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

        if (data.group === 0 && !member.roles.cache.get('1202749571957006348')) {
            if (!member.roles.cache.get('1202551817708507136')) {
                roleArray.push('1202551817708507136');
            }

            if (member.roles.cache.get('1202876101005803531')){
                roleArray = roleArray.filter(item => item !== '1202876101005803531');
            }
            
        }
        else if (data.group === 1 && !member.roles.cache.get('1202749571957006348')) {
            if (!member.roles.cache.get('1202876101005803531')) {
                roleArray.push('1202876101005803531');
            }


            if (member.roles.cache.get('1202551817708507136')){
                roleArray = roleArray.filter(item => item !== '1202551817708507136');
            }
        }

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