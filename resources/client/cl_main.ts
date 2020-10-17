import { ESX } from "../client/client";
import config from '../utils/config';
import { Delay } from '../utils/fivem';
import events from '../utils/events';


RegisterCommand('phone:close', (source: any, args: string[], raw: any) => {
    phoneCloseAnim()
    SetNuiFocus(false, false)
    SendNuiMessage(
      JSON.stringify({
        app: "PHONE",
        method: "setVisibility",
        data: false
      })
    )
}, false);

let prop = 0
let isPhoneOpen = false
let propCreated = false
let phoneModel = "prop_amb_phone" // Refered to in newphoneProp function. Requires custom phone being streamed.

const newPhoneProp = async () =>  { //Function for creating the phone prop
    deletePhone() //deletes the already existing prop before creating another.
    if (!propCreated) {
        RequestModel(phoneModel)
        while (!HasModelLoaded(phoneModel)) {
          await Delay(1)
          console.log("MODEL HASNT LOADED")
        }
        
        const playerPed = PlayerPedId()
        const [x, y, z] = GetEntityCoords(playerPed,  true);
        prop = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true)
        //prop = CreateObject(GetHashKey(phoneModel), 1.0, 1.0, 1.0, 1, 1, 0)
        const boneIndex = GetPedBoneIndex(playerPed, 28422)
        AttachEntityToEntity(prop, playerPed, boneIndex, 0.0, 0.0, 0.0, 0.0, 0.0,  -.0, true, true, false, true, 1.0, true); //-- Attaches the phone to the player.
        propCreated = true
        console.log("prop created")
    }
    else if (propCreated) {
      console.log("prop already created")
    }
}

function deletePhone() { //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
	if (prop != 0) {
    //Citizen.invokeNative(0xAE3CBE5BF394C9C9 , Citizen.pointerValueIntInitialized(prop))
    DeleteEntity(prop);
    prop = 0
    propCreated = false
    console.log("prop destroyed")
  }
}

async function loadAnimDict(dict: any) { //-- Loads the animation dict. Used in the anim functions.
	while (!HasAnimDictLoaded(dict)) {
		RequestAnimDict(dict)
		await Delay(100)
  }
}

async function phoneOpenAnim() { //Phone Open Animation
    console.log("phoneOpenAnim") //Left for testing purposes.
    const flag = 50 //https://runtime.fivem.net/doc/natives/?_0xEA47FE3719165B94
    deletePhone() //Deleting  before creating a new phone where itll be deleted again.
    if (IsPedInAnyVehicle(GetPlayerPed(-1), true)) { //-- true refers to at get in.
        const dict = 'anim@cellphone@in_car@ps'

        ClearPedTasks(GetPlayerPed(-1))
        await loadAnimDict(dict)
        TaskPlayAnim(GetPlayerPed(-1), dict, 'cellphone_text_in', 8.0, -1, -1, flag, 0, false, false, false) 
        await Delay(300) //Gives time for animation starts before creating the phone
        await newPhoneProp() //Creates the phone and attaches it.
    }
    else { //While not in a vehicle it will use this dict.
        const dict = 'cellphone@'

        ClearPedTasks(GetPlayerPed(-1))
        await loadAnimDict(dict)
        TaskPlayAnim(GetPlayerPed(-1), dict, 'cellphone_text_in', 8.0, -1, -1, flag, 0, false, false, false) 
        await Delay(300) //Gives time for animation starts before creating the phone
        await newPhoneProp() //Creates the phone and attaches it.
    }
}

async function phoneCloseAnim() { //Phone Close Animation
    console.log("phoneCloseAnim") //Left for testing purposes.
    const flag = 50 //https://runtime.fivem.net/doc/natives/?_0xEA47FE3719165B94
    const anim = 'cellphone_text_out'
    if (IsPedInAnyVehicle(GetPlayerPed(-1), true)) { //true refers to at get in.
        const dict = 'anim@cellphone@in_car@ps'
        
        StopAnimTask(GetPlayerPed(-1), dict, 'cellphone_text_in', 1.0) //Stop the pull out animation
        deletePhone() //Deletes the prop early incase they get out of the vehicle.
        await Delay(250) //lets it get to a certain point
        loadAnimDict(dict) //loads the new animation
        TaskPlayAnim(GetPlayerPed(-1), dict, anim, 8.0, -1, -1, flag, 1, false, false, false) //puts phone into pocket
        await Delay(200) //waits until the phone is in the pocket
        StopAnimTask(GetPlayerPed(-1), dict, anim, 1.0) //clears the animation
    }
    else { //While not in a vehicle it will use this dict.
        const dict = 'cellphone@'

        StopAnimTask(GetPlayerPed(-1), dict, 'cellphone_text_in', 1.0) //Stop the pull out animation
        await Delay(100) //lets it get to a certain point
        loadAnimDict(dict) //loads the new animation
        TaskPlayAnim(GetPlayerPed(-1), dict, anim, 8.0, -1, -1, flag, 1, false, false, false) //puts phone into pocket
        await Delay(200) //waits until the phone is in the pocket
        StopAnimTask(GetPlayerPed(-1), dict, anim, 1.0) //clears the animation
        deletePhone() //Deletes the prop.
    }
}

async function carryingPhone(cb: any) {
  if (ESX === null) return cb(0);
  ESX.TriggerServerCallback('phone:getItemAmount', (qtty: number) => {
    cb(qtty > 0);
  }, 'phone');
}

function noPhone() {
	if (ESX === null) return;
    ESX.ShowNotification('Oi Mate, No El Telephono')
}

function sendPhoneConfig() {
  SendNuiMessage(
    JSON.stringify({
      app: "PHONE",
      method: "phoneConfig",
      data: config
    })
  )
}

setTick(() => {
  if (IsControlJustPressed(1, config.KeyTogglePhone)) {
    Phone();
  }
})


async function Phone() {
  if (config.PhoneAsItem) {
    console.log("CONFIG ON") 
    carryingPhone(async (carryingPhone: any) => {
      if (carryingPhone) {
        if (!isPhoneOpen) {
          isPhoneOpen = true 
          await phoneOpenAnim()
          emitNet(events.CONTACTS_GET_CONTACTS);
          emitNet('phone:getCredentials') // Gets the credentials. Will eventually most likely only get the phone number and name, idk.
          SetCursorLocation(0.936, 0.922) //Experimental
          let res = GetActiveScreenResolution()
          SendNuiMessage(
            JSON.stringify({
              app: "PHONE",
              method: "setVisibility",
              data: true
            })
          )
          sendPhoneConfig()
          SetNuiFocus(true, true)
        }
        else {
          isPhoneOpen = false
          await phoneCloseAnim()
          SendNuiMessage( //Hides phone
            JSON.stringify({
              app: "PHONE",
              method: "setVisibility",
              data: false
            })
          )
          SetNuiFocus(false, false)
        }
      }
      else {
        noPhone();
      }
    })
  }
  else if (!config.PhoneAsItem) {   
    console.log("CONFIG OFF") 
    if (!isPhoneOpen) { 
      isPhoneOpen = true 
      await phoneOpenAnim()
      emitNet(events.CONTACTS_GET_CONTACTS);
      emitNet('phone:getCredentials') 
      SetCursorLocation(0.936, 0.922) //Experimental
      let res = GetActiveScreenResolution()
      SendNuiMessage(
        JSON.stringify({
          app: "PHONE",
          method: "setVisibility",
          data: true
        })
      )
      sendPhoneConfig()
      SetNuiFocus(true, true)
    }
    else {
      isPhoneOpen = false
      await phoneCloseAnim()
      SendNuiMessage( //Hides phone
        JSON.stringify({
          app: "PHONE",
          method: "setVisibility",
          data: false
        })
      )
      SetNuiFocus(false, false)
    }
  }
}


RegisterCommand('phone', () => { //-- Toggles Phone
  Phone()
}, false)


RegisterNuiCallbackType('phone:close');
on(`__cfx_nui:phone:close`, () => {
  Phone();
}) // Called for when the phone is closed via the UI.


AddEventHandler('onResourceStop', function(resource: string) {
  if (resource === GetCurrentResourceName()) {
    SendNuiMessage(
      JSON.stringify({
        app: 'PHONE',
        method: 'setVisibility',
        data: false
      })
    )
    SetNuiFocus(false, false)
    deletePhone() //Deletes the phone incase it was attached.
    ClearPedTasks(GetPlayerPed(-1)) //Leave here until launch as it'll fix any stuck animations.
  }
})

//
//Phone Destory When Wet
//
function countPhone(cb: any) {
  if (ESX === null) return cb(0)
  ESX.TriggerServerCallback('phone:getItemAmount', (qtty: number) => {
    cb(qtty > 0);
  }, 'phone');
}

let destroyedPhone = false


setTick(async () => {
  while (config.SwimDestroy) {
    await Delay(config.RunRate * 1000);
    if (IsPedSwimming(PlayerPedId())) {
      let chance = Math.floor((Math.random() * 100) + 1);
      if (chance <= config.DestoryChance) {
        countPhone((countPhone: boolean) => {
          if (countPhone) {
            ESX.ShowNotification('Your phone is ruined from the water!')
            destroyedPhone = true
          }
        })
      }
      if (destroyedPhone) {
        await Delay(config.DestroyPhoneReCheck * 60000)
      }
    } 
  }
})

onNet('phone:sendCredentials', (number: string) => {
  SendNuiMessage(
    JSON.stringify({
      app: "SIMCARD",
      method: "setNumber",
      data: number
    })
  )
});